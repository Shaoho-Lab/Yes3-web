import { useToast } from '@chakra-ui/react'
import CommonLayout from 'components/common-layout'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import styles from './index.module.scss'
import { useSigner, useAccount } from 'wagmi'
import { Contract } from '@ethersproject/contracts'
import LyonTemplate from 'contracts/LyonTemplate.json'
import {
  firestore,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  serverTimestamp,
} from '../../firebase'
import { useNavigate } from 'react-router-dom'
import Popup from 'components/popup'
import NFTSBTMintBox from 'components/NFTSBTMintBox'

const TemplateCreatePage = () => {
  const [templateQuestion, setTemplateQuestion] = useState('')
  const [templateContext, setTemplateContext] = useState('')
  const [templateId, setTemplateId] = useState('0')
  const [buttonPopup, setButtonPopup] = useState(false)
  const [mintConfirm, setMintConfirm] = useState(false)
  const [chainId, setChainId] = useState(80001)

  const navigate = useNavigate()
  const toast = useToast()
  const provider = new ethers.providers.JsonRpcProvider(
    'https://rpc-mumbai.maticvigil.com/v1/59e3a028aa7f390b9b604fae35aab48985ebb2f0',
  )
  const { data: signer, isError, isLoading } = useSigner()
  const { address, isConnecting, isDisconnected } = useAccount()

  const handleClick = () => {
    if (mintConfirm != true) {
      setMintConfirm(current => !current)
    }
  }

  useEffect(() => {
    provider.getNetwork().then((network: any) => {
      setChainId(network.chainId)
    })
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

  const handleMintTemplate = async () => {
    try {
      if (provider && signer && chainId) {
        if (chainId !== 80001) {
          await handleSwitchNetwork(80001)
          return
        }
        const LyonTemplateContract = new Contract(
          '0x22f0260F47f98968A262DcAe17d981e63a6a7455',
          LyonTemplate.abi,
          signer,
        )
        const promptSafeMintResponse = await LyonTemplateContract.mintTemplate(
          templateQuestion,
          templateContext,
          '',
        ) //TODO: add template uri
        const promptSafeMintResponseHash = promptSafeMintResponse.hash 
        console.log('promptSafeMintResponse', promptSafeMintResponse)

        const templateMetadataRef = doc(
          firestore,
          'template-metadata',
          'global',
        )
        const templateMetadataSnapshot = await getDoc(templateMetadataRef)
        const fetchedData = templateMetadataSnapshot.data()
        const templateCount = fetchedData?.count + 1
        setTemplateId(templateCount.toString())
        await updateDoc(templateMetadataRef, {
          count: templateCount,
        })

        const templateRef = doc(
          firestore,
          'template-metadata',
          templateCount!.toString(),
        )
        setDoc(templateRef, {
          question: templateQuestion,
          context: templateContext,
          ownerAddress: address,
          numAnswers: 0,
          trend: {},
          connections: [],
          createTime: serverTimestamp(),
          templateURI: '', //TODO: add template uri
        })

        // navigate(`/app`)
      }
    } catch (error: any) {
      toast({
        title: 'Mint Error',
        description: error.reason,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
    
    handleClick()
  }

  return (
    <CommonLayout className={styles.page}>
      <div className={styles.heading}>Create a new prompt template</div>
      <div className={styles.description}>
        Each template is an NFT, you can trade it like any other NFT.
      </div>
      <textarea
        className={styles.textarea}
        placeholder="What do you want to ask?"
        value={templateQuestion}
        onChange={event =>
          setTemplateQuestion(event.target.value.replace(/\n/g, ''))
        }
      />
      <textarea
        className={styles.textarea}
        placeholder="context"
        value={templateContext}
        onChange={event =>
          setTemplateContext(event.target.value.replace(/\n/g, ''))
        }
      />
      <div className={styles.options}>
        <div className={styles.description}>
          Your frenz can respond either Yes, No, or I don't know to your prompt.
        </div>
      </div>
      <div className={styles.buttons}>
        <div className={styles.cancel} onClick={() => window.history.back()}>
          Cancel
        </div>
        <div className={styles.confirm} onClick={() => setButtonPopup(true)}>
          Mint
        </div>
        <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
          <NFTSBTMintBox question={templateQuestion} replyShow={''} />
          <h1 style={{ fontSize: '20px', fontFamily: 'Ubuntu' }}>
            Preview your SBT, then click the button to mint your SBT!
          </h1>
          <br></br>
          <div style={{ display: 'flex' }}>
            <div
              className={styles.confirm}
              onClick={() => handleMintTemplate()}
            >
              Confirm
            </div>
            {mintConfirm && (
              <div>
                <h1 style={{ fontSize: '20px', fontFamily: 'Ubuntu' }}>
                  Mint Success - Congrats!
                </h1>
                <h1 style={{ fontSize: '20px', fontFamily: 'Ubuntu' }}>
                  Find your question NFT here:
                  <a href="abc.com">
                    https://lyonprotocol.xyz/templates/{templateId}
                  </a>
                </h1>
              </div>
            )}
          </div>
        </Popup>
      </div>
    </CommonLayout>
  )
}

export default TemplateCreatePage
