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
import Card from 'components/card'
import CommonLayout from 'components/common-layout'
import NFTSBTBox from 'components/NFTSBTBox'
import NFTSBTMintBox from 'components/NFTSBTMintBox'
import TemplateTree from 'components/template-tree'
import LyonPrompt from 'contracts/LyonPrompt.json'
import LyonTemplate from 'contracts/LyonTemplate.json'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAccount, useSigner } from 'wagmi'
import * as htmlToImage from 'html-to-image'
import { File, NFTStorage } from 'nft.storage'
import styles from './index.module.scss'
import { dataURLtoFile } from 'helpers/image'

const PromptPublicViewPage = () => {
  const toast = useToast()
  const navigate = useNavigate()

  const [question, setQuestion] = useState('')
  const [questionContext, setQuestionContext] = useState('')
  const [questionNumAnswers, setQuestionNumAnswers] = useState(0)
  const [promptOwner, setPromptOwner] = useState('')
  const [promptOwnerAddress, setPromptOwnerAddress] = useState('')
  const [propmtTimeDiff, setPropmtTimeDiff] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [commentList, setCommentList] = useState<string[][]>()
  const [chosenRepliesList, setChosenRepliesList] = useState<string[]>()

  const { templateId, id } = useParams<{ templateId: string; id: string }>()
  const { data: signer } = useSigner()
  const { address } = useAccount()

  useEffect(() => {
    const getName = (userAddressNameMapping: any, address: string) => {
      const name = userAddressNameMapping[address]
      return name ? name : address
    }

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

      const userRef = doc(firestore, 'user-metadata', 'info')
      const userRefSnapshot = await getDoc(userRef)
      const userAddressNameMapping = userRefSnapshot.data()

      const promptMetadataRef = doc(firestore, 'prompt-metadata', templateId!)
      const promptSnapshot = await getDoc(promptMetadataRef)
      const promptData = promptSnapshot.data()

      if (promptData !== undefined) {
        const promptOwnerAddress = promptData[id!].promptOwner
        const promptOwnerName = getName(
          userAddressNameMapping,
          promptOwnerAddress,
        )
        const promptCreateTime = promptData[id!].createTime

        setPromptOwnerAddress(promptOwnerAddress)
        setPromptOwner(promptOwnerName)

        const diff = Math.abs(Date.now() - promptCreateTime.toDate())

        if (diff < 1000 * 60 * 60 * 24) {
          setPropmtTimeDiff('Today')
        } else {
          const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24))
          setPropmtTimeDiff(diffDays + ' days ago')
        }

        const replies = promptData[id!].replies
        const chosenReplies = promptData[id!].chosenReplies

        if (replies !== undefined) {
          const commentListTemp: string[][] = []

          for (let key of Object.keys(replies)) {
            const name = getName(userAddressNameMapping, key)
            const value = replies[key]
            commentListTemp.push([key, name, value.comment])
          }

          setCommentList(commentListTemp)
        }

        if (chosenReplies !== undefined) {
          let chosenRepliesTemp: string[] = []
          for (let key of Object.keys(chosenReplies)) {
            const name = getName(userAddressNameMapping, key)
            const value = chosenReplies[key]

            chosenRepliesTemp.push(name + ': ' + value.replierDetail)
          }

          setChosenRepliesList(chosenRepliesTemp)
        }
      }
    }

    loadTemplateData()
  }, [id, templateId])

  const client = new NFTStorage({
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEI5QTUwQjZGN0Y0YTkwODExNDQzNDU1ZTBGODQ1OTk0QTc4OTQ4MjciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MzgxMzI2MjY4OCwibmFtZSI6IlllczMifQ.CFX9BRbLs1ohAslhXC3T-4CWyPZexG1CLWjicH7akRU',
  })

  const upload2IPFS = async (image: File) => {
    const metadata = await client.store({
      name: 'Yes3',
      description:
        'Mint your social interactions on-chain! Powered by Lyon with <3',
      image,
    })

    return metadata.url.toString()
  }

  const HTML2PNG2IPFS = async () => {
    const node = document.getElementById('NFTSBTMint')
    const dataUrl = await htmlToImage.toJpeg(node!)
    const img = dataURLtoFile(dataUrl, 'image.jpg')

    return upload2IPFS(img)
  }

  const handleMintPrompt = async () => {
    try {
      if (signer) {
        const uri = await HTML2PNG2IPFS()

        const LyonPromptContract = new Contract(
          '0xBE7F59766e1ff6959ADE04163a2682D49fA3b57e',
          LyonPrompt.abi,
          signer,
        )

        const LyonTemplateContract = new Contract(
          '0xB6D2be364f94FFc9aC902066fdB59DB8Aa176D8A',
          LyonTemplate.abi,
          signer,
        )

        const promptSafeMintResponse = await LyonPromptContract.safeMint(
          templateId,
          question,
          questionContext,
          address,
          uri,
        )

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
      toast({
        title: 'Ask Error',
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  //need to figure out if the SBT owner info is queryable
  return (
    <CommonLayout className={styles.page}>
      <div className={styles.heading}>{question}</div>
      <div className={styles.sub}>
        {' '}
        By{' '}
        <a href={`https://etherscan.io/address/${promptOwnerAddress}`}>
          {promptOwner}
        </a>{' '}
        {propmtTimeDiff} - Asked {id} times
      </div>
      <div className={styles.description}>{questionContext}</div>
      <div className={styles.content}>
        <div className={styles.container}>
          <div className={styles.image}>
            <NFTSBTBox question={question} replyShow={chosenRepliesList!} />
          </div>
          <div className={styles.comments}>
            <div className={styles.title}>Comments</div>
            <div className="checkList">
              <div className="list-container">
                {commentList?.map((item, index) => (
                  <div key={index}>
                    <Card className={styles.comment}>
                      <a href={`https://etherscan.io/address/${item[0]}`}>
                        {item[1]}
                      </a>
                      :&nbsp;
                      {item[2]}
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.charts}>
          <TemplateTree className={styles.graph} templateId={templateId!} />
        </div>
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
            variant="primary"
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
                <p>
                  <a href={'/prompts/' + templateId + '/' + questionNumAnswers}>
                    https://yes3.app/prompts/{templateId}/{questionNumAnswers}
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
  )
}

export default PromptPublicViewPage
