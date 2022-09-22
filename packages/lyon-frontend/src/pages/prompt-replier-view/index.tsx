import classNames from 'classnames'
import Card from 'components/card'
import CommonLayout from 'components/common-layout'
import QuestionCard from 'components/question-card'
import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import styles from './index.module.scss'
import { firestore, doc, getDoc } from '../../firebase'
import { useToast } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import { useSigner, useAccount, useSignMessage } from 'wagmi'

const REPLY_TYPES = ['Yes', 'No', "I don 't know"]

const NotReplied = () => {
  const [comment, setComment] = useState('')
  const [replyType, setReplyType] = useState(REPLY_TYPES[0])

  const [question, setQuestion] = useState('')
  const [questionContext, setQuestionContext] = useState('')
  const [questionCount, setQuestionCount] = useState(0)
  const [requesterAddr, setRequesterAddr] = useState('')
  const [signatureHash, setSignatureHash] = useState('')
  const { templateId, id } = useParams<{ templateId: string; id: string }>()
  const toast = useToast()
  const context = useWeb3React()
  const { data, error, signMessage } = useSignMessage({
    onSuccess(data, variables) {
      setSignatureHash(data)
      // Verify signature when sign message succeedsconst address = verifyMessage(variables.message, data)
    }
  })
  // const { library, account, chainId } = context
  const { data: signer, isError, isLoading } = useSigner()
  const { address, isConnecting, isDisconnected } = useAccount()

  useEffect(() => {
    const templateMetadataRef = doc(firestore, 'template-metadata', templateId!)
    getDoc(templateMetadataRef).then(snapshot => {
      const fetchedData = snapshot.data()
      if (fetchedData !== undefined) {
        setQuestion(fetchedData.question)
        setQuestionContext(fetchedData.context)
        setQuestionCount(fetchedData.count)
      }
    })
    
    const promptMetadataRef = doc(firestore, 'prompt-metadata', templateId!)
    getDoc(promptMetadataRef).then(snapshot => {
      setRequesterAddr(snapshot.data()?.[id!]?.promptOwner)
    })
  }, [])

  const handleReply = async () => {
    try {
      if (signer) {
        const message = `I am replying to the question: ${question} with the context: ${questionContext} with the reply: ${replyType} and the comment: ${comment}`
        signMessage({message})
        console.log(signatureHash)
        
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

  return (
    <CommonLayout className={styles.page}>
      <div className={styles.heading}>
        Reply to your friend <u>{requesterAddr}</u>
      </div>
      <Card>
        <div className={styles.question}>{question}</div>
        <div className={styles.context}>{questionContext}</div>
        <div className={styles.stats}>{questionCount} answers</div>
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
        <QuestionCard
          content="Am I a good Solidity engineer?"
          ownerAddress="0xf5d6348B82e2049D72DbfC91c41E224dC19c7296"
          numAnswers={20}
        />
        <QuestionCard
          content="Am I a good team member in ETH Global Hackathon?"
          ownerAddress="0xf5d6348B82e2049D72DbfC91c41E224dC19c7296"
          numAnswers={128}
        />
        <QuestionCard
          content="Am I a good Solidity engineer?"
          ownerAddress="0xf5d6348B82e2049D72DbfC91c41E224dC19c7296"
          numAnswers={20}
        />
        <QuestionCard
          content="Am I a good team member in ETH Global Hackathon?"
          ownerAddress="0xf5d6348B82e2049D72DbfC91c41E224dC19c7296"
          numAnswers={128}
        />
        <QuestionCard
          content="Am I a good Solidity engineer?"
          ownerAddress="0xf5d6348B82e2049D72DbfC91c41E224dC19c7296"
          numAnswers={20}
        />
        <QuestionCard
          content="Am I a good team member in ETH Global Hackathon?"
          ownerAddress="0xf5d6348B82e2049D72DbfC91c41E224dC19c7296"
          numAnswers={128}
        />
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
