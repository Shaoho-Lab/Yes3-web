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
import styles from './index.module.scss'

const TemplateViewPage = () => {
  const toast = useToast()
  const navigate = useNavigate()

  const [question, setQuestion] = useState('')
  const [questionContext, setQuestionContext] = useState('')
  const [questionNumAnswers, setQuestionNumAnswers] = useState(0)

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

  const handleMintPrompt = async () => {
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
          '',
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
          SBTURI: '', // TODO add SBT uri
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
                <p>
                  <a href={'/prompts/' + templateId + '/' + questionNumAnswers}>
                    https://yes3.app/prompts/{templateId}/{questionNumAnswers}
                    /reply
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
