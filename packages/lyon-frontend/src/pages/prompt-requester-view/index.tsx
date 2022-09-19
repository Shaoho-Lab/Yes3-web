import classNames from 'classnames'
import Card from 'components/card'
import Checkbox from 'components/checkbox'
import CommonLayout from 'components/common-layout'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './index.module.scss'
import SBTimage from 'components/promptSVG/SBTSVG.svg'

const REPLY_TYPES = ['Yes', 'No']

const Edit = () => {
  const [comment, setComment] = useState('')
  const [replyType, setReplyType] = useState(REPLY_TYPES[0])

  return (
    <CommonLayout className={styles.page}>
      <div className={styles.heading}>Manage your question</div>
      <Card>
        <div className={styles.question}>
          Am I a good team member in ETH Global Hackathon?
        </div>
        <div className={styles.stats}>3 days ago</div>
        <div className={styles.container}>
          <img src={SBTimage} alt="SBT image" />
          <div className={styles.comment}>
            <h2>Select to show replies</h2>
            <h5>Max 4</h5>
            <Checkbox label="onjas.eth: a piece of shit!" />
            <Checkbox label="vitalik.eth: a true gem!" />
            <Checkbox label="yan.eth: shittest ever!" />
            <Checkbox label="yan.eth: support!" />
            <Checkbox label="yan.eth: nice!" />
          </div>
        </div>
        <div className={styles.buttons}>
          <div className={styles.cancel} onClick={() => window.history.back()}>
            Cancel
          </div>
          <div className={styles.confirm}>Update your SBT</div>
        </div>
      </Card>
    </CommonLayout>
  )
}

const PromptRequesterViewPage = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  return <Edit />
}

export default PromptRequesterViewPage
