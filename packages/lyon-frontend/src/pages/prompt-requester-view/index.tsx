import classNames from 'classnames'
import Card from 'components/card'
import Checkbox from 'components/checkbox'
import CommonLayout from 'components/common-layout'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './index.module.scss'
import NFTSBTBox from 'components/NFTSBTBox'
import * as htmlToImage from 'html-to-image'
import { toPng } from 'html-to-image'
import { NFTStorage, File } from 'nft.storage'
import { useParams } from 'react-router-dom'
import { firestore, doc, getDoc, updateDoc, setDoc } from '../../firebase'

const client = new NFTStorage({
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEI5QTUwQjZGN0Y0YTkwODExNDQzNDU1ZTBGODQ1OTk0QTc4OTQ4MjciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MzgxMzI2MjY4OCwibmFtZSI6IlllczMifQ.CFX9BRbLs1ohAslhXC3T-4CWyPZexG1CLWjicH7akRU',
})

async function upload2IPFS(img: BlobPart) {
  const metadata = await client.store({
    name: 'Yes3',
    description:
      'Mint your social interactions on-chain! Powered by Lyon with <3',
    image: new File([img], 'test.png', { type: 'image/png' }),
  })
  console.log(metadata.url)
}

const HTML2PNG2IPFS = () => {
  console.log('mint clicked')
  var node = document.getElementById('NFTSBT')
  htmlToImage
    .toPng(node!)
    .then(function (dataUrl) {
      // convert to file
      var img = dataURLtoFile(dataUrl, 'image')
      upload2IPFS(img)
    })
    .catch(function (error) {
      console.error('oops, something went wrong!', error)
    })
}

const dataURLtoFile = (dataUrl: string, filename: string) => {
  const arr = dataUrl.split(',')
  const mime = arr[0].match(/:(.*?);/)?.[1]
  const bstr = window.atob(arr[1])

  let n = bstr.length
  let u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new File([u8arr], filename, { type: mime })
}

const Edit = () => {
  const [comment, setComment] = useState('')
  // need to change to query
  const checkList = [
    ['onjas.eth', 'A piece of shit!'],
    ['vitalik.eth', 'Shittest ever!'],
    ['yan.eth', 'Go shit!'],
    ['onjas.eth', 'A piece of shit!'],
  ]
  const selected = [
    ['onjas.eth', 'A piece of shit!'],
    ['vitalik.eth', 'Shittest ever!'],
    ['yan.eth', 'Go shit!'],
  ]
  const [checked, setChecked] = useState<string[]>([])
  // Add/Remove checked item from list
  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    var updatedList: string[] = [...checked]
    if (event.target.checked) {
      updatedList = [...checked, event.target.value]
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1)
    }
    setChecked(updatedList)
  }
  const isChecked = (item: string) =>
    checked.includes(item) ? 'checked-item' : 'not-checked-item'
  //<NFTSBTBox replyShow={isChecked} />

  const checkedItems = checked.length
    ? checked.reduce((total, item) => {
        return total + '; ' + item
      })
    : ''

  const [question, setQuestion] = useState('')
  const [questionContext, setQuestionContext] = useState('')
  const [questionNumAnswers, setQuestionNumAnswers] = useState(0)
  const { templateId } = useParams<{ templateId: string }>()
  useEffect(() => {
    const getTempalteData = async () => {
      const templateMetadataRef = doc(
        firestore,
        'template-metadata',
        templateId!,
      )
      const templateSnapshot = await getDoc(templateMetadataRef)
        const fetchedData = templateSnapshot.data()
        if (fetchedData !== undefined) {
          setQuestion(fetchedData.question)
          setQuestionContext(fetchedData.context)
          setQuestionNumAnswers(fetchedData.numAnswers)
        }
    }
    getTempalteData()
  }, [])

  return (
    <CommonLayout className={styles.page}>
      <div className={styles.heading}>Manage your question</div>
      <div className={styles.question}>{question}</div>
      <div className={styles.stats}>3 days ago</div>
      <div className={styles.container}>
        <div className={styles.container}>
          <div className={styles.image}>
            <NFTSBTBox question={question} replyShow={checkedItems} />
          </div>
          <div className={styles.comments}>
            <div className={styles.title}>
              Select to show replies on your SBT
            </div>
            <h5>Max 4</h5>
            <div className="checkList">
              <div className="list-container">
                {checkList.map((item, index) => (
                  <div key={index}>
                    <Card className={styles.comment}>
                      <input
                        value={item}
                        type="checkbox"
                        onChange={handleCheck}
                      />
                      <span className={isChecked(item[0])}>{item}</span>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
            <div>{`Items checked are: ${checkedItems}`}</div>
          </div>
        </div>
      </div>
      <div className={styles.buttons}>
        <div className={styles.cancel} onClick={() => window.history.back()}>
          Cancel
        </div>
        <div className={styles.confirm} onClick={() => HTML2PNG2IPFS()}>
          Update your SBT
        </div>
      </div>
    </CommonLayout>
  )
}

const PromptRequesterViewPage = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  return <Edit />
}

export default PromptRequesterViewPage
