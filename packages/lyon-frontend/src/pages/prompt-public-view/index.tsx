import classNames from 'classnames'
import Card from 'components/card'
import CommonLayout from 'components/common-layout'
import TemplateTree from 'components/template-tree'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './index.module.scss'
import SBTimage from 'components/promptSVG/SBTSVG.svg'

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

const PromptPublicViewPage = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const [replied] = useState(Boolean(queryParams.get('replied')))

  return (
    <CommonLayout className={styles.page}>
      <div className={styles.heading}>
        Am I a good teammate in ETH Global Hackathon?
      </div>
      <div className={styles.intro}>
        By{' '}
        <a href="https://etherscan.io/address/0xd8da6bf26964af9d7eed9e03e53415d37aa96045">
          yanffyy.eth
        </a>{' '}
        3 days ago
      </div>
      <div className={styles.content}>
        <div className={styles.container}>
          <div className={styles.image}>
            <img src={SBTimage} alt="SBT image" />
          </div>
          <div className={styles.comment}>
            <h2>Comments</h2>
            <div className={styles.comment}>
              <text>A piece of shit!</text>
              <a href="https://etherscan.io/address/0xd8da6bf26964af9d7eed9e03e53415d37aa96045">
                -- onjas.eth
              </a>
            </div>
            <div className={styles.comment}>
              <text>A true gem of shit!</text>
              <a href="https://etherscan.io/address/0xd8da6bf26964af9d7eed9e03e53415d37aa96045">
                -- vitalik.eth
              </a>
            </div>
            <div className={styles.comment}>
              <text>Shittest ever!</text>
              <a href="https://etherscan.io/address/0xd8da6bf26964af9d7eed9e03e53415d37aa96045">
                -- yan.eth
              </a>
            </div>
            <div className={styles.comment}>
              <text>Shittest ever!</text>
              <a href="https://etherscan.io/address/0xd8da6bf26964af9d7eed9e03e53415d37aa96045">
                -- yan.eth
              </a>
            </div>
            <div className={styles.comment}>
              <text>Shittest ever!</text>
              <a href="https://etherscan.io/address/0xd8da6bf26964af9d7eed9e03e53415d37aa96045">
                -- yan.eth
              </a>
            </div>
          </div>
        </div>
        <div className={styles.charts}>
          <div className={styles.stats}></div>
          <div className={styles.graph}>
            <TemplateTree />
          </div>
        </div>
        <div className={styles.buttons}>
          <div className={styles.cancel} onClick={() => window.history.back()}>
            Back
          </div>
          <div className={styles.confirm}>Ask the question</div>
        </div>
      </div>
    </CommonLayout>
  )
}

export default PromptPublicViewPage
