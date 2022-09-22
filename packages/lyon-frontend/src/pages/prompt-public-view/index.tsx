import Card from 'components/card'
import CommonLayout from 'components/common-layout'
import TemplateTree from 'components/template-tree'
import { useEffect, useState } from 'react'
import styles from './index.module.scss'
import NFTSBTBox from 'components/NFTSBTBox'
import { useParams } from 'react-router-dom'
import { firestore, doc, getDoc, updateDoc, setDoc } from '../../firebase'

const PromptPublicViewPage = () => {
  const [question, setQuestion] = useState('')
  const [questionContext, setQuestionContext] = useState('')
  const [questionCount, setQuestionCount] = useState(0)
  const { templateId } = useParams<{ templateId: string }>()
  useEffect(() => {
    const templateMetadataRef = doc(firestore, 'template-metadata', templateId!)
    getDoc(templateMetadataRef).then(snapshot => {
      const fetchedData = snapshot.data()
      if (fetchedData !== undefined) {
        setQuestion(fetchedData.question)
        setQuestionContext(fetchedData.context)
        setQuestionCount(fetchedData.count)
        console.log(question)
      }
    })
  }, [])
  //const [templateId, setTemplateId] = useState('1')
  const checkList = [
    ['onjas.eth', 'A piece of shit!'],
    ['vitalik.eth', 'Shittest ever!'],
    ['yan.eth', 'Go shit!'],
    ['onjas.eth', 'A piece of shit!'],
  ]
  const checkedItems = 'onjas.eth: A pice of shit!; vitalik.eth: Shittest ever!'

  //need to figure out if the SBT owner info is queryable
  return (
    <CommonLayout className={styles.page}>
      <div className={styles.heading}>{question}</div>
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
            <NFTSBTBox question={question} replyShow={checkedItems} />
          </div>
          <div className={styles.comments}>
            <div className={styles.title}>Comments</div>
            <div className="checkList">
              <div className="list-container">
                {checkList.map((item, index) => (
                  <div key={index}>
                    <Card className={styles.comment}>
                      <a href="https://etherscan.io/address/0xd8da6bf26964af9d7eed9e03e53415d37aa96045">
                        {item[0]}
                      </a>
                      :&nbsp;
                      <text>{item[1]}</text>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.charts}>
          <div className={styles.chart}></div>
          <TemplateTree className={styles.graph} templateId={templateId!} />
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
