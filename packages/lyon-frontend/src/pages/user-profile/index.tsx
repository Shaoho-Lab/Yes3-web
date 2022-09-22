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
  console.log(account)
  console.log(chainId)
  console.log(library)

  const queryAll = async () => {
    try {
      if (account && library && chainId) {
        console.log('account', account)
        if (chainId !== 80001) {
          await handleSwitchNetwork(80001)
          return
        }
        const LyonTemplateContract = new Contract(
          '0x15f6682adC43ff249F645Cd6e121D2109632313e',
          LyonTemplate.abi,
          context.library.getSigner(context.account),
        )
        const LyonPromptContract = new Contract(
          '0xb6Dd3FA5C9F212ca4a22635690DC1Cc1b8430388',
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
