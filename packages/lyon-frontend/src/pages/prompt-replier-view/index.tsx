import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useToast,
} from '@chakra-ui/react'
import { Contract } from '@ethersproject/contracts'
import classNames from 'classnames'
import {
  arrayUnion,
  doc,
  firestore,
  getDoc,
  serverTimestamp,
  updateDoc,
} from 'common/firebase'
import Button from 'components/button'
import Card from 'components/card'
import CommonLayout from 'components/common-layout'
import TemplateCardList from 'components/template-card-list'
import LyonPrompt from 'contracts/LyonPrompt.json'
import { ethers } from 'ethers'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAccount, useSigner, useSignMessage } from 'wagmi'
import styles from './index.module.scss'

const REPLY_TYPES = ['Yes', 'No', "I don 't know"]

const NotReplied = () => {
  const [comment, setComment] = useState('')
  const [replyType, setReplyType] = useState(REPLY_TYPES[0])
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const [question, setQuestion] = useState('')
  const [questionContext, setQuestionContext] = useState('')
  const [questionNumAnswers, setQuestionNumAnswers] = useState(0)
  const [requesterAddr, setRequesterAddr] = useState('')
  const [requesterName, setRequesterName] = useState('')
  const [signatureHash, setSignatureHash] = useState('')
  const { templateId, id } = useParams<{ templateId: string; id: string }>()

  const toast = useToast()
  const navigate = useNavigate()

  const { signMessage } = useSignMessage({
    onSuccess(data, variables) {
      setSignatureHash(data)
      setIsAlertOpen(true)
      // Verify signature when sign message succeedsconst address = verifyMessage(variables.message, data)
    },
    onError(error) {
      setIsAlertOpen(false)
      toast({
        title: 'Error',
        description: 'Sign failed',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    },
  })

  const { data: signer } = useSigner()
  const { address } = useAccount()

  const provider = new ethers.providers.JsonRpcProvider(
    'https://rpc-mumbai.maticvigil.com/v1/59e3a028aa7f390b9b604fae35aab48985ebb2f0',
  )
  const adminPrivateKey =
    '6ccc00445230bcf1994b43ca088b4029723e88c4e1fb01e652df03a51f1033b8'

  const signerAdmin = new ethers.Wallet(adminPrivateKey, provider)

  const getName = (userAddressNameMapping: any, address: string) => {
    const name = userAddressNameMapping[address]
    return name ? name : address
  }

  useEffect(() => {
    const loadPromptData = async () => {
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
      if (userAddressNameMapping !== undefined) {
        const promptMetadataRef = doc(firestore, 'prompt-metadata', templateId!)
        const promptSnapshot = await getDoc(promptMetadataRef)
        const requesterAddr = promptSnapshot.data()?.[id!]?.promptOwner
        setRequesterAddr(requesterAddr!)
        setRequesterAddr(requesterAddr)
        setRequesterName(getName(userAddressNameMapping, requesterAddr))
        //
      }
    }

    loadPromptData()
  }, [id, templateId])

  const handleReply = async () => {
    try {
      if (signer) {
        const message = `${address} am replying to the question: ${question} with the context: ${questionContext} with the reply: ${replyType} from ${requesterAddr} and the comment: ${comment}`
        signMessage({ message })

        const LyonPromptContract = new Contract(
          '0xCd2DE63538C88a873cF0abCc21818a165C106Be9',
          LyonPrompt.abi,
          signerAdmin,
        )

        const ReplyPromptResponse = await LyonPromptContract.replyPrompt(
          [templateId, id],
          address,
          replyType,
          comment,
          signatureHash,
        )

        console.log(ReplyPromptResponse)

        const promptRef = doc(firestore, 'prompt-metadata', templateId!)
        const promptSnapshot = await getDoc(promptRef)
        const promptFetchedData = promptSnapshot.data()?.[id!]

        if (promptFetchedData !== undefined) {
          const replyData = {
            comment: comment,
            createTime: serverTimestamp(),
            replierDetail: replyType,
            signature: signatureHash,
          }

          const keysList = promptFetchedData.keys

          if (!keysList.includes(address)) {
            keysList.push(address)
          }

          const updateReplyData = {
            ...promptFetchedData,
            keys: keysList,
            replies: {
              ...promptFetchedData.replies,
              [address!]: replyData,
            },
          }

          updateDoc(promptRef, {
            [id!]: updateReplyData,
          })
        }

        const templateRef = doc(firestore, 'template-metadata', templateId!)
        const templateSnapshot = await getDoc(templateRef)
        const templateFetchedData = templateSnapshot.data()?.connections

        if (templateFetchedData !== undefined) {
          updateDoc(templateRef, {
            connections: arrayUnion({
              endorserAddress: address,
              requesterAddress: requesterAddr,
            }),
          })
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Reply failed',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  const cancelRef = useRef(null)

  return (
    <CommonLayout className={styles.page}>
      <div className={styles.heading}>
        Reply to your friend <u>{requesterName}</u>
      </div>
      <Card>
        <div className={styles.question}>{question}</div>
        <div className={styles.context}>{questionContext}</div>
        <div className={styles.stats}>{questionNumAnswers} answers</div>
        <div className={styles.options}>
          {REPLY_TYPES.map(type => (
            <div
              key={type}
              className={classNames(styles.option, {
                [styles.selected]: type === replyType,
              })}
              onClick={() => setReplyType(type)}
            >
              {type}
            </div>
          ))}
        </div>
        <textarea
          className={styles.textarea}
          placeholder="Leave some comments"
          value={comment}
          onChange={event => setComment(event.target.value.replace(/\n/g, ''))}
        />
        <div className={styles.buttons}>
          <Button
            className={styles.cancel}
            variant="secondary"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button
            className={styles.confirm}
            variant="primary"
            onClick={() => handleReply()}
          >
            Sign your reply
          </Button>
          <AlertDialog
            isOpen={isAlertOpen}
            onClose={() => setIsAlertOpen(false)}
            leastDestructiveRef={cancelRef}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Reply Success - Congrats!
                </AlertDialogHeader>

                <AlertDialogBody>
                  Now you may ask some other questions!
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button
                    size="medium"
                    onClick={() => navigate(`/prompts/${templateId}/${id}`)}
                  >
                    Go to comments
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </div>
      </Card>
    </CommonLayout>
  )
}

const Replied = () => {
  return (
    <CommonLayout className={styles.page}>
      <div className={styles.heading}>Thanks for your reply!</div>
      <div className={styles.intro}>
        Now you can see some other popular questions on Lyon...
      </div>
      <div className={styles.questionList}>
        <TemplateCardList />
      </div>
    </CommonLayout>
  )
}

const PromptReplierViewPage = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const [replied] = useState(Boolean(queryParams.get('replied')))

  if (replied) {
    return <Replied />
  } else {
    return <NotReplied />
  }
}

export default PromptReplierViewPage
