import Card from 'components/card'
import CommonLayout from 'components/common-layout'
import TemplateTree from 'components/template-tree'
import { useEffect, useState } from 'react'
import styles from './index.module.scss'
import NFTSBTBox from 'components/NFTSBTBox'
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

const PromptPublicViewPage = () => {
  const toast = useToast()
  const [question, setQuestion] = useState('')
  const [questionContext, setQuestionContext] = useState('')
  const [promptOwner, setPromptOwner] = useState('')
  const [promptOwnerAddress, setPromptOwnerAddress] = useState('')
  const [propmtTimeDiff, setPropmtTimeDiff] = useState("")
  const [buttonPopup, setButtonPopup] = useState(false)
  const [mintConfirm, setMintConfirm] = useState(false)
  const [chainId, setChainId] = useState(80001)
  const [userAddressNameMapping, setUserAddressNameMapping] = useState<any>()
  const [commentList, setCommentList] = useState<string[][]>()
  const [chosenRepliesString, setChosenRepliesString] = useState<string>('')
  const handleClick = () => {
    if (mintConfirm != true) {
      setMintConfirm(current => !current)
    }
  }
  // const { library, account, chainId } = context
  const { templateId, id } = useParams<{ templateId: string; id: string }>()
  const provider = new ethers.providers.JsonRpcProvider(
    'https://rpc-mumbai.maticvigil.com/v1/59e3a028aa7f390b9b604fae35aab48985ebb2f0',
  )
  const { data: signer, isError, isLoading } = useSigner()
  const { address, isConnecting, isDisconnected } = useAccount()

  useEffect(() => {
    const getName = (userAddressNameMapping: any, address: string) => {
      const name = userAddressNameMapping[address]
      return name ? name : address
    }

    const loadTemplateData = async () => {
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
        const promptOwnerAddress = promptData[id!].promptOwner
        const promptOwnerName = getName(userAddressNameMapping, promptOwnerAddress)
        const promptCreateTime = promptData[id!].createTime
        setPromptOwnerAddress(promptOwnerAddress)
        setPromptOwner(promptOwnerName)
        const diff = Math.abs(Date.now() - promptCreateTime.toDate())
        if (diff < (1000 * 60 * 60 * 24)) {
          setPropmtTimeDiff("Today")
        } 
        else {
          const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24))
          setPropmtTimeDiff(diffDays + " days ago")
        }

        const replies = promptData[id!].replies
        const chosenReplies = promptData[id!].chosenReplies
        if (replies !== undefined) {
          const commentListTemp: string[][] = []
          for (let key of Object.keys(replies)) {
            const name = getName(userAddressNameMapping, key)
            const value = replies[key]
            commentListTemp.push([key, name, value.comment])
          }

          setCommentList(commentListTemp)
        }
        if (chosenReplies !== undefined) {
          let chosenRepliesTemp = ''
          for (let key of Object.keys(chosenReplies)) {
            const name = getName(userAddressNameMapping, key)
            const value = chosenReplies[key]
            chosenRepliesTemp = chosenRepliesTemp.concat(
              name + ': ' + value.replierDetail + ';',
            )
          }

          setChosenRepliesString(chosenRepliesTemp)
        }
      }
    }

    loadTemplateData()
  }, [])

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
        const LyonTemplateContract = new Contract(
          '0x22f0260F47f98968A262DcAe17d981e63a6a7455',
          LyonTemplate.abi,
          signer,
        )
        const promptSafeMintResponse = await LyonPromptContract.safeMint(
          templateId,
          question,
          questionContext,
          address,
          '',
        ) //TODO: add uri
        const promptSafeMintResponseHash = promptSafeMintResponse.hash
        console.log('promptSafeMintResponse', promptSafeMintResponse)
        const questionNumAnswersAdded = id! + 1

        const templateRef = doc(firestore, 'template-metadata', templateId!)
        const templateSnapshot = await getDoc(templateRef)
        const fetchedData = templateSnapshot.data()?.trend
        const currentYear = new Date().getFullYear()
        const currentMonth = new Date().getMonth() + 1
        const currentTime = [currentYear, currentMonth].join('-')
        if (fetchedData !== undefined) {
          updateDoc(templateRef, {
            trend: {
              [currentTime]:
                fetchedData[currentTime] !== undefined
                  ? fetchedData[currentTime] + 1
                  : 1,
            },
            numAnswers: questionNumAnswersAdded,
          })
          // setQuestionNumAnswers(questionNumAnswers + 1)
          handleClick()
        }

        const promptMetadataRef = doc(firestore, 'prompt-metadata', templateId!)
        const promptSnapshot = await getDoc(promptMetadataRef)
        const promptData = {
          promptOwner: address,
          question: question,
          context: questionContext,
          replies: {},
          chosenReplies: {},
          keys: [],
          createTime: serverTimestamp(),
          SBTURI: '', // TODO add uri
        }

        if (promptSnapshot.exists()) {
          updateDoc(promptMetadataRef, {
            [id!]: promptData,
          })
        } else {
          setDoc(promptMetadataRef, {
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
      }
    }

    loadTemplateData()
  }, [])

  //need to figure out if the SBT owner info is queryable
  return (
    <CommonLayout className={styles.page}>
      <div className={styles.heading}>{question}</div>
      <div className={styles.heading}>{questionContext}</div>
      <div className={styles.heading}>Asked {id} times</div>
      <div className={styles.intro}>
        By{' '}
        <a href={`https://etherscan.io/address/${promptOwnerAddress}`}>
          {promptOwner}
        </a>{' '}
        {propmtTimeDiff}
      </div>
      <div className={styles.content}>
        <div className={styles.container}>
          <div className={styles.image}>
            <NFTSBTBox question={question} replyShow={chosenRepliesString} />
          </div>
          <div className={styles.comments}>
            <div className={styles.title}>Comments</div>
            <div className="checkList">
              <div className="list-container">
                {commentList?.map((item, index) => (
                  <div key={index}>
                    <Card className={styles.comment}>
                      <a href={`https://etherscan.io/address/${item[0]}`}>
                        {item[1]}
                      </a>
                      :&nbsp;
                      {item[2]}
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
          <div className={styles.confirm} onClick={() => setButtonPopup(true)}>
            Ask the question
          </div>
          <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
            <NFTSBTMintBox question={question} replyShow={''} />
            <h1 style={{ fontSize: '20px', fontFamily: 'Ubuntu' }}>
              Preview your SBT, then click the button to mint your SBT!
            </h1>
            <br></br>
            <div style={{ display: 'flex' }}>
              <div className={styles.confirm} onClick={handleMintPrompt}>
                Confirm
              </div>
              {mintConfirm && (
                <div>
                  <h1 style={{ fontSize: '20px', fontFamily: 'Ubuntu' }}>
                    Mint Success - Congrats!
                  </h1>
                  <h1 style={{ fontSize: '20px', fontFamily: 'Ubuntu' }}>
                    Share this link to your friends for reply：
                    <a href="abc.com">
                      https://lyonprotocol.xyz/prompts/{templateId}/{id}
                    </a>
                  </h1>
                </div>
              )}
            </div>
          </Popup>
        </div>
      </div>
    </CommonLayout>
  )
}

export default PromptPublicViewPage
