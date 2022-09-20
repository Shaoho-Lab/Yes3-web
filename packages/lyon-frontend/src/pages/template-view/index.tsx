import Checkbox from 'components/checkbox'
import CommonLayout from 'components/common-layout'
import styles from './index.module.scss'
import TemplateTree from 'components/template-tree'
import TemplateTrend from 'components/template-trend'

const TemplateViewPage = () => {
  return (
    <CommonLayout className={styles.page}>
      <div className={styles.content}>
        <div className={styles.heading}>Am I a good solidity dev?</div>
        <div className={styles.heading}>info box</div>
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
<<<<<<< HEAD
=======
        <div className={styles.charts}>
          <div className={styles.stats}>
            <TemplateTrend />
          </div>
          <div className={styles.graph}>
            <TemplateTree />
          </div>
        </div>
>>>>>>> 7d8d6233409c7a0a1fbd253c07982bf972ce32bc
      </div>
    </CommonLayout>
  )
}

export default TemplateViewPage
