import { useToast } from '@chakra-ui/react'
import Card from 'components/card'
import CommonLayout from 'components/common-layout'
import { buildJazziconDataUrl } from 'helpers/jazzicon'
import { redirect } from 'react-router-dom'
import { useAccount } from 'wagmi'
import styles from './index.module.scss'
import { Contract } from '@ethersproject/contracts'
import LyonTemplate from 'contracts/LyonTemplate.json'
import LyonPrompt from 'contracts/LyonPrompt.json'
import { useWeb3React } from '@web3-react/core'

const UserProfilePage = () => {
  const { address } = useAccount()
  const toast = useToast()
  const context = useWeb3React()
  const { library, account, chainId } = context
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
      if (account && library && chainId) {
        if (chainId !== 80001) {
          await handleSwitchNetwork(80001)
          return
        }
        const LyonTemplateContract = new Contract(
          '0x22f0260F47f98968A262DcAe17d981e63a6a7455',
          LyonTemplate.abi,
          context.library.getSigner(context.account),
        )
        const LyonPromptContract = new Contract(
          '0x36a722Dfb58f90dAB9b4AB1BE2e903afaBA3B008',
          LyonPrompt.abi,
          context.library.getSigner(context.account),
        )
        const allPrompts = await LyonPromptContract.queryAllPromptByAddr(
          account,
        )
        const allTemplates = await LyonTemplateContract.queryAllTemplates(
          account,
        )
        if (!allPrompts) {
          return allPrompts
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Ask question failed',
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
        {allPrompts.map((item, index) => (
          <div key={index}>
            <Card className={styles.comment}>
              <span>{item}</span>
            </Card>
          </div>
        ))}
      </div>
      <div className={styles.heading}>My Question Templates</div>
      <div className="list-container">
        {allTemplates.map((item, index) => (
          <div key={index}>
            <Card className={styles.comment}>
              <span>{item}</span>
            </Card>
          </div>
        ))}
      </div>
      <div className={styles.heading}>My Given Replies</div>
      <div className="list-container">
        {allReplies.map((item, index) => (
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
