import { useToast } from '@chakra-ui/react'
import { Contract } from '@ethersproject/contracts'
import { doc, firestore, getDoc, updateDoc } from 'common/firebase'
import Button from 'components/button'
import Card from 'components/card'
import CommonLayout from 'components/common-layout'
import NFTSBTBox from 'components/NFTSBTBox'
import LyonPrompt from 'contracts/LyonPrompt.json'
import { ethers } from 'ethers'
import * as htmlToImage from 'html-to-image'
import { File, NFTStorage } from 'nft.storage'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAccount, useSigner } from 'wagmi'
import styles from './index.module.scss'

const PromptRequesterViewPage = () => {
  const [question, setQuestion] = useState('')
  const [checked, setChecked] = useState<string[]>([])
  const [commentList, setCommentList] = useState<string[]>()
  const [userAddressNameMapping, setUserAddressNameMapping] = useState<any>()
  const [comment, setComment] = useState('')
  const [uri, setUri] = useState('')
  const { data: signer, isError, isLoading } = useSigner()
  const { address, isConnecting, isDisconnected } = useAccount()
  const toast = useToast()

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
    setUri(metadata.url)
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

  const { templateId, id } = useParams<{ templateId: string; id: string }>()
  const provider = new ethers.providers.JsonRpcProvider(
    'https://rpc-mumbai.maticvigil.com/v1/59e3a028aa7f390b9b604fae35aab48985ebb2f0',
  )

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

  const handleMintPrompt = async () => {
    try {
      HTML2PNG2IPFS()

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
  }, [])

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
