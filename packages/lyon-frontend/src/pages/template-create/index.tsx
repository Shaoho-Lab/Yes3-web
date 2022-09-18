import Checkbox from 'components/checkbox'
import CommonLayout from 'components/common-layout'
import { useState } from 'react'
import styles from './index.module.scss'

const TemplateCreatePage = () => {
  const [templateContent, setTemplateContent] = useState('')

  return (
    <CommonLayout className={styles.page}>
      <div className={styles.heading}>Create a new question template</div>
      <div className={styles.description}>
        Each template is an NFT, you can trade it like any other NFT.
      </div>
      <textarea
        className={styles.textarea}
        placeholder="What do you want to ask?"
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
    </CommonLayout>
  )
}

export default TemplateCreatePage
