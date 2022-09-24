import classNames from 'classnames'
import Card from 'components/card'
import Checkbox from 'components/checkbox'
import CommonLayout from 'components/common-layout'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './index.module.scss'
import NFTSBTBox from 'components/NFTSBTBox'
import * as htmlToImage from 'html-to-image'
import { NFTStorage, File } from 'nft.storage'
import { useParams } from 'react-router-dom'
import {
  firestore,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  serverTimestamp,
} from '../../firebase'
import Popup from 'components/popup'
import NFTSBTMintBox from 'components/NFTSBTMintBox'
import { useToast } from '@chakra-ui/react'
import { useSigner, useAccount } from 'wagmi'
import { Contract } from '@ethersproject/contracts'
import LyonPrompt from 'contracts/LyonPrompt.json'
import LyonTemplate from 'contracts/LyonTemplate.json'
import { ethers } from 'ethers'

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
  const [question, setQuestion] = useState('')
  const [questionContext, setQuestionContext] = useState('')
  const [questionNumAnswers, setQuestionNumAnswers] = useState(0)
  const [buttonPopup, setButtonPopup] = useState(false)
  const [mintConfirm, setMintConfirm] = useState(false)
  const [chainId, setChainId] = useState(80001)
  const [checked, setChecked] = useState<string[]>([])
  const [commentList, setCommentList] = useState<string[][]>()
  const [userAddressNameMapping, setUserAddressNameMapping] = useState<any>()
  const [comment, setComment] = useState('')

  const { data: signer, isError, isLoading } = useSigner()
  const { address, isConnecting, isDisconnected } = useAccount()
  const toast = useToast()

  const { templateId, id } = useParams<{ templateId: string; id: string }>()
  const provider = new ethers.providers.JsonRpcProvider(
    'https://rpc-mumbai.maticvigil.com/v1/59e3a028aa7f390b9b604fae35aab48985ebb2f0',
  )
  // Add/Remove checked item from list
  const handleClick = () => {
    console.log('confirmed')
    if (mintConfirm != true) {
      setMintConfirm(current => !current)
    }
    return (
      <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
        <h1 style={{ fontSize: '20px', fontFamily: 'Ubuntu' }}>
          Update Success - Congrats!
        </h1>
        <h1 style={{ fontSize: '20px', fontFamily: 'Ubuntu' }}>
          Your new SBT page can be viewed here：
          <a href={'/' + templateId + '/' + { id }}>
            https://lyonprotocol.xyz/prompts/{templateId}/{id}
          </a>
        </h1>
      </Popup>
    )
  }
  // const { library, account, chainId } = context

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

  console.log(checked)
  const checkedItems = checked.length
    ? checked.reduce((total, item) => {
        return total + '; ' + item
      })
    : ''

  const handleSwitchNetwork = async (networkId: number) => {
    try {
      if ((window as any).web3?.currentProvider) {
        await (window as any).web3.currentProvider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${networkId.toString(16)}` }],
        })
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message
          ? `${error.message.substring(0, 120)}...`
          : 'Please switch to Mumbai testnet to proceed the payment',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }
  const handleMintPrompt = async () => {
    try {
      HTML2PNG2IPFS()
      if (provider && signer && chainId) {
        if (chainId !== 80001) {
          await handleSwitchNetwork(80001)
          return
        }
        const LyonPromptContract = new Contract(
          '0x36a722Dfb58f90dAB9b4AB1BE2e903afaBA3B008',
          LyonPrompt.abi,
          signer,
        )

        const setTokenURIResponse = await LyonPromptContract.setTokenURI(
          [templateId, id],
          '', // TODO add updated TokenURI
        )
        console.log('setTokenURIResponse', setTokenURIResponse)

        const promptMetadataRef = doc(firestore, 'prompt-metadata', templateId!)
        const promptSnapshot = await getDoc(promptMetadataRef)

        if (promptSnapshot.exists()) {
          const promptData = {
            chosenReplies: {}, // TODO add checked Data
            ...promptSnapshot.data()[id!],
          }
          updateDoc(promptMetadataRef, {
            [id!]: promptData,
          })
        }
        handleClick()
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
        setQuestionContext(fetchedData.context)
        setQuestionNumAnswers(fetchedData.numAnswers)
      }

      const network = await provider.getNetwork()
      setChainId(network.chainId)
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
          const commentListTemp: string[][] = []
          for (let key of Object.keys(replies)) {
            const name = getName(userAddressNameMapping, key)
            const value = replies[key]
            commentListTemp.push([key, name, value.comment])
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
            <NFTSBTBox question={question} replyShow={["asdasd"]} />
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
        <div className={styles.cancel} onClick={() => window.history.back()}>
          Cancel
        </div>
        <div className={styles.confirm} onClick={() => handleMintPrompt()}>
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
