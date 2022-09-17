import Checkbox from 'components/checkbox'
import Navbar from 'components/navbar'
import { useState } from 'react'
import styles from './index.module.scss'

const TemplateCreatePage = () => {
  const [templateContent, setTemplateContent] = useState('')

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Navbar />
      </div>
      <div className={styles.content}>
        <h1>Mint new question NFT</h1>
        <textarea
          className={styles.textarea}
          placeholder="Type your question prompt here"
          value={templateContent}
          onChange={event =>
            setTemplateContent(event.target.value.replace(/\n/g, ''))
          }
        />
        <div className={styles.options}>
          <Checkbox label="Some option A" />
          <Checkbox label="Some option B" />
        </div>
        <div className={styles.buttons}>
          <div className={styles.cancel} onClick={() => window.history.back()}>
            Cancel
          </div>
          <div className={styles.confirm}>Mint</div>
        </div>
      </div>
    </div>
  )
}

export default TemplateCreatePage
