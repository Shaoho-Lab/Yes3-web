import Checkbox from 'components/checkbox'
import Navbar from 'components/navbar'
import styles from './index.module.scss'

const TemplateViewPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Navbar />
      </div>
      <div className={styles.content}>
        <h1>Am I a good teammate in ETH Global Hackathon?</h1>
        <div className={styles.options}>
          <Checkbox label="Set as a private question" />
          <Checkbox label="Generate a password" />
        </div>
        <div className={styles.buttons}>
          <div className={styles.cancel} onClick={() => window.history.back()}>
            Back
          </div>
          <div className={styles.confirm}>Ask the question</div>
        </div>
        <div className={styles.charts}>
          <div className={styles.stats}></div>
          <div className={styles.graph}></div>
        </div>
      </div>
    </div>
  )
}

export default TemplateViewPage
