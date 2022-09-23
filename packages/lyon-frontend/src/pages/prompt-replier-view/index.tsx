import classNames from 'classnames'
import Card from 'components/card'
import CommonLayout from 'components/common-layout'
import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import styles from './index.module.scss'
import {
  firestore,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
} from '../../firebase'
import { useToast } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import { useSigner, useAccount, useSignMessage } from 'wagmi'
import QuestionCards from 'components/question-cards'
import { ethers } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import LyonPrompt from 'contracts/LyonPrompt.json'

const REPLY_TYPES = ['Yes', 'No', "I don 't know"]

const NotReplied = () => {
  const [comment, setComment] = useState('')
  const [replyType, setReplyType] = useState(REPLY_TYPES[0])

  const [question, setQuestion] = useState('')
  const [questionContext, setQuestionContext] = useState('')
  const [questionNumAnswers, setQuestionNumAnswers] = useState(0)
  const [requesterAddr, setRequesterAddr] = useState('')
  const [signatureHash, setSignatureHash] = useState('')
  const { templateId, id } = useParams<{ templateId: string; id: string }>()
  const toast = useToast()
  const context = useWeb3React()
  const { data, error, signMessage } = useSignMessage({
    onSuccess(data, variables) {
      setSignatureHash(data)
      // Verify signature when sign message succeedsconst address = verifyMessage(variables.message, data)
    },
    onError(error) {
      toast({
        title: 'Error',
        description: 'Sign failed',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    },
  })
  // const { library, account, chainId } = context
  const { data: signer, isError, isLoading } = useSigner()
  const { address, isConnecting, isDisconnected } = useAccount()

  const provider = new ethers.providers.JsonRpcProvider(
    'https://rpc-mumbai.maticvigil.com/v1/59e3a028aa7f390b9b604fae35aab48985ebb2f0',
  )
  const adminPrivateKey =
    '6ccc00445230bcf1994b43ca088b4029723e88c4e1fb01e652df03a51f1033b8'
  const signerAdmin = new ethers.Wallet(adminPrivateKey, provider)

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

      const promptMetadataRef = doc(firestore, 'prompt-metadata', templateId!)
      const promptSnapshot = await getDoc(promptMetadataRef)
      setRequesterAddr(promptSnapshot.data()?.[id!]?.promptOwner)
    }

    loadPromptData()
  }, [])

  const handleReply = async () => {
    try {
      if (signer) {
        const message = `${address} am replying to the question: ${question} with the context: ${questionContext} with the reply: ${replyType} from ${requesterAddr} and the comment: ${comment}`
        // signMessage({ message })
        console.log(signatureHash)

        const LyonPromptContract = new Contract(
          '0xb6Dd3FA5C9F212ca4a22635690DC1Cc1b8430388',
          LyonPrompt.abi,
          signerAdmin,
        )
        console.log('here')
        const ReplyPromptResponse = await LyonPromptContract.replyPrompt(
          [templateId, id],
          address,
          replyType,
          comment,
          signatureHash, // TODO: convert to bytes32
        ) //TODO: add uri
        console.log(ReplyPromptResponse)

          const promptRef = doc(firestore, 'prompt-metadata', templateId!)
          console.log('promptRef', promptRef)
          getDoc(promptRef).then(snapshot => {
            const fetchedData = snapshot.data()?.[id!]
            if (fetchedData !== undefined) {
              const replyData = {
                comment: comment,
                createTime: serverTimestamp(),
                replierDetail: replyType,
                signature: signatureHash,
              }
              console.log(replyData)
              updateDoc(promptRef, {
                [id!]: {
                  ...fetchedData, //TODO: check 
                  keys: arrayUnion(address),
                  replies: {
                    ...fetchedData.replies,
                    [address!]: replyData,
                  },
                },
              })
            }
          })

          const templateRef = doc(firestore, 'template-metadata', templateId!)
          getDoc(templateRef).then(snapshot => {
            const fetchedData = snapshot.data()?.connections
            if (fetchedData !== undefined) {
              updateDoc(templateRef, {
                ...fetchedData, //TODO: Check
                connections: arrayUnion({
                  endorserAddress: address,
                  requesterAddress: requesterAddr,
                }),
              })
            }
          })
      }
    } catch (error: any) {
      console.log(error)
      toast({
        title: 'Error',
        description: 'Reply failed',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  return (
    <CommonLayout className={styles.page}>
      <div className={styles.heading}>
        Reply to your friend <u>{requesterAddr}</u>
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
          <div className={styles.cancel} onClick={() => window.history.back()}>
            Cancel
          </div>
          <div className={styles.confirm} onClick={() => handleReply()}>
            Sign your reply
          </div>
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
        <QuestionCards />
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
