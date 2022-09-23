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
  const [questionNumAnswers, setQuestionNumAnswers] = useState(0)
  const [buttonPopup, setButtonPopup] = useState(false)
  const [mintConfirm, setMintConfirm] = useState(false)
  const [chainId, setChainId] = useState(80001)
  const handleClick = () => {
    if (mintConfirm != true) {
      setMintConfirm(current => !current)
    }
  }
  // const { library, account, chainId } = context
  const { templateId } = useParams<{ templateId: string }>()
  const provider = new ethers.providers.JsonRpcProvider(
    'https://rpc-mumbai.maticvigil.com/v1/59e3a028aa7f390b9b604fae35aab48985ebb2f0',
  )
  const { data: signer, isError, isLoading } = useSigner()
  const { address, isConnecting, isDisconnected } = useAccount()

  // need change after getting the real id!!!!
  const id = '1'
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
        setQuestionNumAnswers(fetchedData.numAnswers)
      }
    }

    provider.getNetwork().then((network: any) => {
      setChainId(network.chainId)
    })

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
        const questionNumAnswersAdded = questionNumAnswers + 1

        const templateRef = doc(firestore, 'template-metadata', templateId!)
        getDoc(templateRef).then(snapshot => {
          const fetchedData = snapshot.data()?.trend
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
        })

        const promptMetadataRef = doc(firestore, 'prompt-metadata', templateId!)
        getDoc(promptMetadataRef).then(snapshot => {
          const promptData = {
            promptOwner: address,
            question: question,
            context: questionContext,
            replies: {},
            keys: [],
            createTime: serverTimestamp(),
            SBTURI: '', // TODO add uri
          }

          if (snapshot.exists()) {
            updateDoc(promptMetadataRef, {
              [questionNumAnswersAdded.toString()]: promptData,
            })
          } else {
            setDoc(promptMetadataRef, {
              [questionNumAnswersAdded.toString()]: promptData,
            })
          }
        })
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
        setQuestionNumAnswers(fetchedData.numAnswers)
      }
    }

    loadTemplateData()
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
