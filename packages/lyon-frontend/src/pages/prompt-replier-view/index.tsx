import classNames from 'classnames'
import Card from 'components/card'
import CommonLayout from 'components/common-layout'
import QuestionCard from 'components/question-card'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './index.module.scss'

const REPLY_TYPES = ['Yes', 'No']

const NotReplied = () => {
  const [comment, setComment] = useState('')
  const [replyType, setReplyType] = useState(REPLY_TYPES[0])

  return (
    <CommonLayout className={styles.page}>
      <div className={styles.heading}>
        Reply to your friend <u>zh3036.eth</u>
      </div>
      <Card>
        <div className={styles.question}>
          Am I a good team member in ETH Global Hackathon?
        </div>
        <div className={styles.stats}>1.2k answers</div>
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
          <div className={styles.confirm}>Sign your reply</div>
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
