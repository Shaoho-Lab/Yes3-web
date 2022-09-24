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
import { useEffect, useState } from 'react'
import { firestore, doc, getDoc } from '../../firebase'

const UserProfilePage = () => {
  const [ENSName, setENSName] = useState('')
  const [allPrompts, setAllPrompts] = useState<string[]>()
  const [allTemplates, setAllTemplates] = useState<string[]>()
  const [allReplies, setAllReplies] = useState<string[]>()

  const provider = new ethers.providers.JsonRpcProvider(
    'https://rpc-mumbai.maticvigil.com/v1/59e3a028aa7f390b9b604fae35aab48985ebb2f0',
  )
  const adminPrivateKey =
    '6ccc00445230bcf1994b43ca088b4029723e88c4e1fb01e652df03a51f1033b8'
  const signerAdmin = new ethers.Wallet(adminPrivateKey, provider)
  const { data: signer, isError, isLoading } = useSigner()
  const { address, isConnecting, isDisconnected } = useAccount()
  const toast = useToast()
  const context = useWeb3React()

  useEffect(() => {
    const getName = (userAddressNameMapping: any, address: string) => {
      const name = userAddressNameMapping[address]
      return name ? name : "ENS Name doesn't exist" //TODO: can be input by user
    }
    const loadData = async () => {
      const userRef = doc(firestore, 'user-metadata', 'info')
      const userRefSnapshot = await getDoc(userRef)
      const userAddressNameMapping = userRefSnapshot.data()
      const name = getName(userAddressNameMapping, address!)
      setENSName(name)

      const templateRef = doc(firestore, 'template-metadata', 'global')
      const templateSnapshot = await getDoc(templateRef)
      const count = templateSnapshot.data()?.count
      var templateQuestionMapping: any = {}
      if (count !== undefined) {
        for (let i = 1; i <= count; i++) {
          const templateRef = doc(firestore, 'template-metadata', i.toString())
          const templateSnapshot = await getDoc(templateRef)
          const templateData = templateSnapshot.data()
          if (templateData !== undefined) {
            const templateQuestion = templateData.question
            templateQuestionMapping[i] = templateQuestion
          }
        }
      }

      try {
        if (signerAdmin) {
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

          const allPromptsQuery =
            await LyonPromptContract.queryAllPromptByAddress(address)

          //TODO: debug why there is error when using this
          var allTemplatesQueryInQuestion: string[] = []
          for (let i = 0; i < allPromptsQuery.length; i++) {
            const templateId = parseInt(allPromptsQuery[i].templateId._hex)
            // const id = Number(allPromptsQuery[i].id._hex)
            // allTemplatesQueryTemp.push([templateId, id])
            const templateQuestion = templateQuestionMapping![templateId]
            allTemplatesQueryInQuestion.push(templateQuestion)
          }
          
          setAllPrompts(allTemplatesQueryInQuestion)

          // fix contract bug
          // const allTemplatesQuery = await LyonTemplateContract.queryAllPromptByAddress(
          //   address,
          // )
          // console.log(allTemplatesQuery)
          // var allTemplatesQueryTemp: number[] = []
          // var allTemplatesQueryInQuestion: string[] = []
          // for (let i = 0; i < allTemplatesQuery.length; i++) {
          //   const templateId = Number(allTemplatesQuery[i].templateId._hex)
          //   const id = Number(allTemplatesQuery[i].id._hex)
          //   // allTemplatesQueryTemp.push([templateId, id])
          //   allTemplatesQueryTemp.push(templateId)
          // }
          // console.log(allTemplatesQueryTemp)

          // // TODO debug, the following function does not work
          // allTemplatesQueryTemp.forEach((templateId) => {
          //   allTemplatesQueryInQuestion.push(
          //     templateQuestionMapping![templateId.toString()],
          //   )
          // })
          // setAllTemplates(allTemplatesQueryInQuestion)

          //TODO fix contract bug
          // const allReplies = await LyonPromptContract.queryAllRepliesByAddress(
          //   address,
          // )
          // var allRepliesTemp: number[] = []
          // var allRepliesInQuestion: string[] = []
          // for (let i = 0; i < allReplies.length; i++) {
          //   const templateId = allReplies[i].templateId._hex
          //   const id = allReplies[i].id._hex
          //   allRepliesTemp.push(templateId)
          // }
          // allRepliesTemp.forEach((templateId) => {
          //   allRepliesInQuestion.push(
          //     templateQuestionMapping![templateId.toString()],
          //   )
          // })
          // setAllReplies(allRepliesInQuestion)
        }
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.reason,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      }
    }

    loadData()
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

  if (!address) {
    redirect('/')
    return null
  }

  // const allPrompts = ['a', 'b', 'c']
  // const allTemplates = ['a', 'b', 'c']
  // const allReplies = ['a', 'b', 'c']

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
          <div className={styles.name}>{ENSName}</div>
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
