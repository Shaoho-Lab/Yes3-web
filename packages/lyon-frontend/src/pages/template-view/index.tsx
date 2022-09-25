import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react'
import { Contract } from '@ethersproject/contracts'
import {
  doc,
  firestore,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'common/firebase'
import Button from 'components/button'
import CommonLayout from 'components/common-layout'
import NFTSBTMintBox from 'components/NFTSBTMintBox'
import TemplateTree from 'components/template-tree'
import TemplateTrend from 'components/template-trend'
import LyonPrompt from 'contracts/LyonPrompt.json'
import LyonTemplate from 'contracts/LyonTemplate.json'
import { useEffect, useState } from 'react'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { useNavigate, useParams } from 'react-router-dom'
import { useAccount, useSigner } from 'wagmi'
import * as htmlToImage from 'html-to-image'
import { File, NFTStorage } from 'nft.storage'
import styles from './index.module.scss'

const TemplateViewPage = () => {
  const toast = useToast()
  const navigate = useNavigate()

  const [question, setQuestion] = useState('')
  const [questionContext, setQuestionContext] = useState('')
  const [questionNumAnswers, setQuestionNumAnswers] = useState(0)

  const [uri, setUri] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  const { templateId } = useParams<{ templateId: string }>()
  const { data: signer } = useSigner()
  const { address } = useAccount()

  useEffect(() => {
    const loadTemplateData = async () => {
      const templateMetadataRef = doc(
        firestore,
        'template-metadata',
        templateId!,
      )

      const templateSnapshot = await getDoc(templateMetadataRef)
      const fetchedData = templateSnapshot.data()

      if (fetchedData !== undefined) {
        setQuestion(fetchedData.question)
        setQuestionContext(fetchedData.context)
        setQuestionNumAnswers(fetchedData.numAnswers)
      }
    }

    loadTemplateData()
  }, [templateId])

  const client = new NFTStorage({
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEI5QTUwQjZGN0Y0YTkwODExNDQzNDU1ZTBGODQ1OTk0QTc4OTQ4MjciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MzgxMzI2MjY4OCwibmFtZSI6IlllczMifQ.CFX9BRbLs1ohAslhXC3T-4CWyPZexG1CLWjicH7akRU',
  })

  async function upload2IPFS(img: BlobPart) {
    const metadata = await client.store({
      name: 'Yes3',
      description:
        'Mint your social interactions on-chain! Powered by Lyon with <3',
      image: new File([img], 'test.png', { type: 'image/png' }),
    })
    console.log(metadata.url)
    setUri(metadata.url)
  }

  const HTML2PNG2IPFS = () => {
    console.log('mint clicked')
    var node = document.getElementById('NFTSBT')
    htmlToImage
      .toPng(node!)
      .then(function (dataUrl) {
        // convert to file
        var img = dataURLtoFile(dataUrl, 'image')
        upload2IPFS(img)
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error)
      })
  }

  const dataURLtoFile = (dataUrl: string, filename: string) => {
    const arr = dataUrl.split(',')
    const mime = arr[0].match(/:(.*?);/)?.[1]
    const bstr = window.atob(arr[1])

    let n = bstr.length
    let u8arr = new Uint8Array(n)

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }

    return new File([u8arr], filename, { type: mime })
  }

  const handleMintPrompt = async () => {
    HTML2PNG2IPFS()
    try {
      if (signer) {
        const LyonPromptContract = new Contract(
          '0xc6050AF89109746D0F1817A6096dA4e656DF8A7A',
          LyonPrompt.abi,
          signer,
        )

        const LyonTemplateContract = new Contract(
          '0x91D3bC32F60259D254a45eA66dB63EFFaf9882e8',
          LyonTemplate.abi,
          signer,
        )

        const promptSafeMintResponse = await LyonPromptContract.safeMint(
          templateId,
          question,
          questionContext,
          address,
          uri,
        ) //TODO: add uri

        console.log('promptSafeMintResponse', promptSafeMintResponse)

        const templateNewPrompMinted =
          await LyonTemplateContract.newPrompMinted(templateId)

        console.log('templateNewPrompMinted', templateNewPrompMinted)

        const questionNumAnswersAdded = questionNumAnswers + 1

        setQuestionNumAnswers(questionNumAnswersAdded)

        const templateRef = doc(firestore, 'template-metadata', templateId!)
        const templateSnapshot = await getDoc(templateRef)
        const fetchedData = templateSnapshot.data()?.trend
        const currentYear = new Date().getFullYear()
        const currentMonth = new Date().getMonth() + 1
        const currentTime = [currentYear, currentMonth].join('-')

        if (fetchedData !== undefined) {
          updateDoc(templateRef, {
            trend: {
              ...fetchedData,
              [currentTime]:
                fetchedData[currentTime] !== undefined
                  ? fetchedData[currentTime] + 1
                  : 1,
            },
            numAnswers: questionNumAnswersAdded,
          })
        }

        const promptMetadataRef = doc(firestore, 'prompt-metadata', templateId!)
        const promptSnapshot = await getDoc(promptMetadataRef)
        const promptData = {
          promptOwner: address,
          question: question,
          context: questionContext,
          replies: {},
          chosenReplies: {},
          keys: [],
          createTime: serverTimestamp(),
          SBTURI: uri, // TODO add SBT uri
        }

        if (promptSnapshot.exists()) {
          updateDoc(promptMetadataRef, {
            [questionNumAnswersAdded.toString()]: promptData,
          })
        } else {
          setDoc(promptMetadataRef, {
            [questionNumAnswersAdded.toString()]: promptData,
          })
        }

        setIsModalOpen(false)
        setIsSuccessModalOpen(true)
      }
    } catch (error: any) {
      console.log(error)

      toast({
        title: 'Ask Error',
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  return question !== '' && questionContext !== '' ? (
    <CommonLayout className={styles.page}>
      <div className={styles.content}>
        <div className={styles.heading}>{question}</div>
        <div className={styles.description}>{questionContext}</div>
        <div className={styles.charts}>
          <div className={styles.stats}>
            <TemplateTrend templateId={templateId!} />
          </div>
          <div className={styles.graph}>
            <TemplateTree templateId={templateId!} />
          </div>
        </div>
        <br></br>
        <div className={styles.buttons}>
          <Button
            className={styles.cancel}
            variant="secondary"
            onClick={() => window.history.back()}
          >
            Back
          </Button>
          <Button
            className={styles.confirm}
            onClick={() => setIsModalOpen(true)}
          >
            Ask the question
          </Button>
          <Modal
            size="xl"
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Mint Question Prompt SBT</ModalHeader>
              <ModalBody>
                <p>Preview your SBT, then click the button to mint your SBT!</p>
                <br />
                <NFTSBTMintBox question={question} />
              </ModalBody>
              <ModalFooter>
                <Button
                  size="medium"
                  variant="secondary"
                  onClick={() => setIsModalOpen(false)}
                  style={{ marginRight: 15 }}
                >
                  Cancel
                </Button>
                <Button size="medium" onClick={() => handleMintPrompt()}>
                  Confirm
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Modal
            isOpen={isSuccessModalOpen}
            onClose={() => setIsSuccessModalOpen(false)}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Mint Success - Congrats!</ModalHeader>
              <ModalBody>
                <p>Your question prompt SBT has been minted!</p>
                <p>Share this link to your friends for reply:</p>
                <br></br>
                <p>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={
                      '/prompts/' +
                      templateId +
                      '/' +
                      questionNumAnswers +
                      '/reply'
                    }
                  >
                    {`https://yes3.app/prompts/${templateId}/${questionNumAnswers}/reply`}
                  </a>
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  size="medium"
                  onClick={() =>
                    navigate(`/prompts/${templateId}/${questionNumAnswers}`)
                  }
                >
                  Navigate to your SBT
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      </div>
    </CommonLayout>
  ) : null
}

export default TemplateViewPage
