import { useToast } from '@chakra-ui/react'
import { Contract } from '@ethersproject/contracts'
import { doc, firestore, getDoc } from 'common/firebase'
import Button from 'components/button'
import Card from 'components/card'
import CommonLayout from 'components/common-layout'
import LyonPrompt from 'contracts/LyonPrompt.json'
import LyonTemplate from 'contracts/LyonTemplate.json'
import { ethers } from 'ethers'
import { buildJazziconDataUrl } from 'helpers/jazzicon'
import { useEffect, useState } from 'react'
import { redirect, useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'
import styles from './index.module.scss'

const provider = new ethers.providers.JsonRpcProvider(
  'https://rpc-mumbai.maticvigil.com/v1/59e3a028aa7f390b9b604fae35aab48985ebb2f0',
)
const adminPrivateKey =
  '6ccc00445230bcf1994b43ca088b4029723e88c4e1fb01e652df03a51f1033b8'

const signerAdmin = new ethers.Wallet(adminPrivateKey, provider)

const UserProfilePage = () => {
  const [ENSName, setENSName] = useState('')
  const [allPrompts, setAllPrompts] = useState<string[]>()
  const [allTemplates, setAllTemplates] = useState<string[]>()
  const [allReplies, setAllReplies] = useState<string[]>()

  const { address } = useAccount()
  const toast = useToast()
  const navigate = useNavigate()

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

      const templateQuestionMapping: any = {}

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
            '0xc6050AF89109746D0F1817A6096dA4e656DF8A7A',
            LyonPrompt.abi,
            signerAdmin,
          )

          const LyonTemplateContract = new Contract(
            '0x91D3bC32F60259D254a45eA66dB63EFFaf9882e8',
            LyonTemplate.abi,
            signerAdmin,
          )

          // Query all prompts
          const allPromptsQuery =
            await LyonPromptContract.queryAllPromptByAddress(address)

          const allPromptQueryInQuestion: string[] = []
          allPromptsQuery.forEach((prompt: any) => {
            const templateId = parseInt(prompt.templateId._hex)
            const templateQuestion = templateQuestionMapping![templateId]

            allPromptQueryInQuestion.push(templateQuestion)
          })

          setAllPrompts(allPromptQueryInQuestion)

          // Query all templates
          const allTemplatesQuery =
            await LyonTemplateContract.queryAllTemplatesByAddress(address)

          const allTemplatesQueryInQuestion: string[] = []

          allTemplatesQuery.forEach((template: any) => {
            const templateId = parseInt(template._hex)
            const templateQuestion = templateQuestionMapping![templateId]
            allTemplatesQueryInQuestion.push(templateQuestion)
          })

          setAllTemplates(allTemplatesQueryInQuestion)

          // Query all replies
          const allReplies = await LyonPromptContract.queryAllRepliesByAddress(
            address,
          )

          const allRepliesInQuestion: string[] = []

          allReplies.forEach((reply: any) => {
            const templateId = parseInt(reply.templateId._hex)
            const templateQuestion = templateQuestionMapping![templateId]
            allRepliesInQuestion.push(templateQuestion)
          })

          setAllReplies(allRepliesInQuestion)
        }
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      }
    }

    loadData()
  }, [address, toast])

  if (!address) {
    redirect('/')
    return null
  }

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
            <Card
              className={styles.comment}
              onClick={e => navigate(`prompts/$`)}
            >
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
