import Card from 'components/card'
import CommonLayout from 'components/common-layout'
import SBTimage from 'components/promptSVG/SBTSVG.svg'
import TemplateTree from 'components/template-tree'
import { useState } from 'react'
import styles from './index.module.scss'

const PromptPublicViewPage = () => {
  const [templateId, setTemplateId] = useState("1");
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
            <img src={SBTimage} alt="your sbt" />
          </div>
          <div className={styles.comments}>
            <div className={styles.title}>Comments</div>
            <Card className={styles.comment}>
              <a href="https://etherscan.io/address/0xd8da6bf26964af9d7eed9e03e53415d37aa96045">
                onjas.eth
              </a>
              :&nbsp;
              <text>A piece of shit!</text>
            </Card>
            <Card className={styles.comment}>
              <a href="https://etherscan.io/address/0xd8da6bf26964af9d7eed9e03e53415d37aa96045">
                yan.eth
              </a>
              :&nbsp;<text>A true gem of shit!</text>
            </Card>
            <Card className={styles.comment}>
              <a href="https://etherscan.io/address/0xd8da6bf26964af9d7eed9e03e53415d37aa96045">
                zh3036.eth
              </a>
              :&nbsp;<text>Shittest ever!</text>
            </Card>
            <Card className={styles.comment}>
              <a href="https://etherscan.io/address/0xd8da6bf26964af9d7eed9e03e53415d37aa96045">
                jasonhu.eth
              </a>
              :&nbsp;<text>Shittest ever!</text>
            </Card>
          </div>
        </div>
        <div className={styles.charts}>
          <div className={styles.chart}></div>
          <TemplateTree className={styles.graph} templateId={templateId} />
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
