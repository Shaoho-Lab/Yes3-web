import { useToast } from '@chakra-ui/react'
import Card from 'components/card'
import CommonLayout from 'components/common-layout'
import { buildJazziconDataUrl } from 'helpers/jazzicon'
import { redirect } from 'react-router-dom'
import styles from './index.module.scss'
import { Contract } from '@ethersproject/contracts'
import LyonTemplate from 'contracts/LyonTemplate.json'
import LyonPrompt from 'contracts/LyonPrompt.json'
import { useWeb3React } from '@web3-react/core'
import { useSigner, useAccount, useSignMessage } from 'wagmi'
import { ethers } from 'ethers'
import { useState } from 'react'

const UserProfilePage = () => {
  const toast = useToast()
  const context = useWeb3React()
  //const [allPrompts, setAllPrompts] = useState<number[][]>()
  //const [allTemplates, setAllTemplates] = useState<number[][]>()
  //const [allReplies, setAllReplies] = useState<number[][]>()

  const provider = new ethers.providers.JsonRpcProvider(
    'https://rpc-mumbai.maticvigil.com/v1/59e3a028aa7f390b9b604fae35aab48985ebb2f0',
  )
  const adminPrivateKey =
    '6ccc00445230bcf1994b43ca088b4029723e88c4e1fb01e652df03a51f1033b8'
  const signerAdmin = new ethers.Wallet(adminPrivateKey, provider)
  const { data: signer, isError, isLoading } = useSigner()
  const { address, isConnecting, isDisconnected } = useAccount()
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

  const queryAll = async () => {
    try {
      if (signer) {
        const LyonPromptContract = new Contract(
          '0x36a722Dfb58f90dAB9b4AB1BE2e903afaBA3B008',
          LyonPrompt.abi,
          signerAdmin,
        )
        const LyonTemplateContract = new Contract(
          '0x22f0260F47f98968A262DcAe17d981e63a6a7455',
          LyonTemplate.abi,
          signerAdmin,
        )

        // const allPrompts = await LyonPromptContract.queryAllPromptByAddress(
        //   address,
        // )
        // setAllPrompts(allPrompts)
        // console.log(allPrompts)
        // const allTemplates = await LyonTemplateContract.queryAllPromptByAddress(
        //   address,
        // )
        // setAllTemplates(allTemplates)
        // console.log(allTemplates)
        // const allReplies = await LyonPromptContract.queryAllRepliesByAddress(
        //   address,
        // )
        // console.log(allReplies)
        // setAllReplies(allReplies)
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Reply failed',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }
  queryAll()

  if (!address) {
    redirect('/')
    return null
  }

  const allPrompts = ['a', 'b', 'c']
  const allTemplates = ['a', 'b', 'c']
  const allReplies = ['a', 'b', 'c']

  return (
    <CommonLayout className={styles.page}>
      <div className={styles.heading}>My Profile</div>
      <Card className={styles.info}>
        <img
          className={styles.jazzicon}
          src={buildJazziconDataUrl(address)}
          alt={address}
        />
        <div className={styles.identity}>
          <div className={styles.name}>Query ENS</div>
          <div className={styles.address}>{address}</div>
        </div>
      </Card>
      <div className={styles.heading}>My Prompts</div>
      <div className="list-container">
        {allPrompts?.map((item, index) => (
          <div key={index}>
            <Card className={styles.comment}>
              <span>{item}</span>
            </Card>
          </div>
        ))}
      </div>
      <div className={styles.heading}>My Question Templates</div>
      <div className="list-container">
        {allTemplates?.map((item, index) => (
          <div key={index}>
            <Card className={styles.comment}>
              <span>{item}</span>
            </Card>
          </div>
        ))}
      </div>
      <div className={styles.heading}>My Given Replies</div>
      <div className="list-container">
        {allReplies?.map((item, index) => (
          <div key={index}>
            <Card className={styles.comment}>
              <span>{item}</span>
            </Card>
          </div>
        ))}
      </div>
    </CommonLayout>
  )
}

export default UserProfilePage
