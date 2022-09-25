import { useToast } from '@chakra-ui/react'
import { Contract } from '@ethersproject/contracts'
import classNames from 'classnames'
import { doc, firestore, getDoc, updateDoc } from 'common/firebase'
import Button from 'components/button'
import Card from 'components/card'
import CommonLayout from 'components/common-layout'
import NFTSBTBox from 'components/NFTSBTBox'
import LyonPrompt from 'contracts/LyonPrompt.json'
import { dataURLtoFile } from 'helpers/image'
import * as htmlToImage from 'html-to-image'
import { File, NFTStorage } from 'nft.storage'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSigner } from 'wagmi'
import styles from './index.module.scss'

const PromptRequesterViewPage = () => {
  const [question, setQuestion] = useState('')
  const [checked, setChecked] = useState<string[]>([])
  const [commentList, setCommentList] = useState<string[]>()
  const [userAddressNameMapping, setUserAddressNameMapping] = useState<any>()

  const { data: signer } = useSigner()
  const toast = useToast()

  const client = new NFTStorage({
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEI5QTUwQjZGN0Y0YTkwODExNDQzNDU1ZTBGODQ1OTk0QTc4OTQ4MjciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MzgxMzI2MjY4OCwibmFtZSI6IlllczMifQ.CFX9BRbLs1ohAslhXC3T-4CWyPZexG1CLWjicH7akRU',
  })

  const upload2IPFS = async (image: File) => {
    const metadata = await client.store({
      name: 'Yes3',
      description:
        'Mint your social interactions on-chain! Powered by Lyon with <3',
      image,
    })

    return metadata.url.toString()
  }

  const HTML2PNG2IPFS = async () => {
    const node = document.getElementById('NFTSBTMint')
    const dataUrl = await htmlToImage.toJpeg(node!)
    const img = dataURLtoFile(dataUrl, 'image/jpeg')

    return upload2IPFS(img)
  }

  const { templateId, id } = useParams<{ templateId: string; id: string }>()

  const handleMintPrompt = async () => {
    try {
      const uri = await HTML2PNG2IPFS()

      if (signer) {
        const LyonPromptContract = new Contract(
          '0xBE7F59766e1ff6959ADE04163a2682D49fA3b57e',
          LyonPrompt.abi,
          signer,
        )

        const setTokenURIResponse = await LyonPromptContract.setTokenURI(
          [templateId, id],
          uri,
        )
        console.log('setTokenURIResponse', setTokenURIResponse)

        const promptMetadataRef = doc(firestore, 'prompt-metadata', templateId!)
        const promptSnapshot = await getDoc(promptMetadataRef)

        if (promptSnapshot.exists()) {
          var checnRepliesData: any = {}
          checked.forEach(item => {
            const key = item.split(':')[0]
            const value = item.split(':').slice(1).join(':')
            const name = userAddressNameMapping[key]

            checnRepliesData[name] = value
          })
          const promptData = {
            chosenReplies: checnRepliesData, // TODO add checked Data
            ...promptSnapshot.data()[id!],
          }
          updateDoc(promptMetadataRef, {
            [id!]: promptData,
          })
        }
      }
    } catch (error: any) {
      toast({
        title: 'Ask Error',
        description: error.reason,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  useEffect(() => {
    const loadTemplateData = async () => {
      const getName = (userAddressNameMapping: any, address: string) => {
        const name = userAddressNameMapping[address]
        return name ? name : address
      }
      const templateMetadataRef = doc(
        firestore,
        'template-metadata',
        templateId!,
      )
      const templateSnapshot = await getDoc(templateMetadataRef)
      const fetchedData = templateSnapshot.data()

      if (fetchedData !== undefined) {
        setQuestion(fetchedData.question)
      }

      const userRef = doc(firestore, 'user-metadata', 'info')
      const userRefSnapshot = await getDoc(userRef)
      const userAddressNameMapping = userRefSnapshot.data()

      setUserAddressNameMapping(userAddressNameMapping)

      const promptMetadataRef = doc(firestore, 'prompt-metadata', templateId!)
      const promptSnapshot = await getDoc(promptMetadataRef)
      const promptData = promptSnapshot.data()

      if (promptData !== undefined) {
        const replies = promptData[id!].replies
        if (replies !== undefined) {
          const commentListTemp: string[] = []
          for (let key of Object.keys(replies)) {
            const name = getName(userAddressNameMapping, key)
            const value = replies[key]
            commentListTemp.push(name + ': ' + value.comment)
          }

          setCommentList(commentListTemp)
        }
      }
    }

    loadTemplateData()
  }, [id, templateId])

  return (
    <CommonLayout className={styles.page}>
      <div className={styles.heading}>Manage your question</div>
      <div className={styles.question}>{question}</div>
      <div className={styles.stats}>3 days ago</div>
      <div className={styles.container}>
        <div className={styles.container}>
          <div className={styles.image}>
            <NFTSBTBox question={question} replyShow={checked} />
          </div>
          <div className={styles.comments}>
            <div className={styles.title}>
              Select to show replies on your SBT
            </div>
            <h5>Max 4</h5>
            <div className="checkList">
              <div className="list-container">
                {commentList?.map((item, index) => (
                  <div key={index}>
                    <Card
                      className={classNames(styles.comment, {
                        [styles.selected]: checked.includes(item),
                      })}
                      onClick={() => {
                        if (checked.includes(item)) {
                          setChecked(checked.filter(x => x !== item))
                        } else {
                          setChecked(checked.concat(item))
                        }
                      }}
                    >
                      {item}
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.buttons}>
        <Button
          className={styles.cancel}
          variant="secondary"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button
          className={styles.confirm}
          variant="primary"
          onClick={() => handleMintPrompt()}
        >
          Update your SBT
        </Button>
      </div>
    </CommonLayout>
  )
}

export default PromptRequesterViewPage
