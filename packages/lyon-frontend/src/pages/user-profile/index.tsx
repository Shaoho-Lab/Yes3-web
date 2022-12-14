import { useToast } from '@chakra-ui/react'
import { Contract } from '@ethersproject/contracts'
import { doc, firestore, getDoc } from 'common/firebase'
import { PromptStruct, TemplateStruct } from 'common/structs'
import Card from 'components/card'
import CommonLayout from 'components/common-layout'
import LyonPrompt from 'contracts/LyonPrompt.json'
import LyonTemplate from 'contracts/LyonTemplate.json'
import { ethers } from 'ethers'
import { buildJazziconDataUrl } from 'helpers/jazzicon'
import { useEffect, useState } from 'react'
import { redirect, useNavigate, useParams } from 'react-router-dom'
import styles from './index.module.scss'

const provider = new ethers.providers.JsonRpcProvider(
  'https://rpc-mumbai.maticvigil.com/v1/59e3a028aa7f390b9b604fae35aab48985ebb2f0',
)
const adminPrivateKey =
  '6ccc00445230bcf1994b43ca088b4029723e88c4e1fb01e652df03a51f1033b8'

const signerAdmin = new ethers.Wallet(adminPrivateKey, provider)

const UserProfilePage = () => {
  const [ENSName, setENSName] = useState('')
  const [LensName, setLensName] = useState('')
  const [allPrompts, setAllPrompts] = useState<PromptStruct[]>()
  const [allTemplates, setAllTemplates] = useState<TemplateStruct[]>()
  const [allReplies, setAllReplies] = useState<PromptStruct[]>()

  const { address } = useParams<{ address: string }>()

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
      setLensName(name.slice(0, -4))

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
            LyonPrompt.contract,
            LyonPrompt.abi,
            signerAdmin,
          )

          const LyonTemplateContract = new Contract(
            LyonTemplate.contract,
            LyonTemplate.abi,
            signerAdmin,
          )

          // Query all prompts
          const allPromptsQuery =
            await LyonPromptContract.queryAllPromptByAddress(address)

          setAllPrompts(
            allPromptsQuery.map((prompt: any) => {
              const templateId = parseInt(prompt.templateId._hex)
              const promptId = parseInt(prompt.id._hex)
              const question = templateQuestionMapping![templateId]

              return { templateId, promptId, question }
            }),
          )

          // Query all templates
          const allTemplatesQuery =
            await LyonTemplateContract.queryAllTemplatesByAddress(address)

          setAllTemplates(
            allTemplatesQuery.map((template: any) => {
              const templateId = parseInt(template._hex)
              const question = templateQuestionMapping![templateId]

              return { templateId, question }
            }),
          )

          // Query all replies
          const allReplies = await LyonPromptContract.queryAllRepliesByAddress(
            address,
          )

          setAllReplies(
            allReplies.map((reply: any) => {
              const templateId = parseInt(reply.templateId._hex)
              const promptId = parseInt(reply.id._hex)
              const question = templateQuestionMapping![templateId]

              return { templateId, promptId, question }
            }),
          )
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
      <div className={styles.heading}>Profile</div>
      <Card className={styles.info}>
        <img
          className={styles.jazzicon}
          src={buildJazziconDataUrl(address)}
          alt={address}
        />
        <div className={styles.identity}>
          <div
            className={styles.name}
            onClick={() =>
              window.open(`http://www.lensfrens.xyz/${LensName}.lens`)
            }
          >
            {ENSName}
          </div>
          <a href={'https://rainbow.me/' + address} className={styles.address}>
            {address}
          </a>
        </div>
      </Card>
      <div className={styles.heading}>Prompts</div>
      <div className="list-container">
        {allPrompts?.map((item, index) => (
          <div key={index}>
            <Card
              className={styles.comment}
              onClick={() =>
                navigate(`/prompts/${item.templateId}/${item.promptId}/sender`)
              }
            >
              <span>{item.question}</span>
            </Card>
          </div>
        ))}
      </div>
      <div className={styles.heading}>Question Templates</div>
      <div className="list-container">
        {allTemplates?.map((item, index) => (
          <div key={index}>
            <Card
              className={styles.comment}
              onClick={() => navigate(`/templates/${item.templateId}`)}
            >
              <span>{item.question}</span>
            </Card>
          </div>
        ))}
      </div>
      <div className={styles.heading}>Given Replies</div>
      <div className="list-container">
        {allReplies?.map((item, index) => (
          <div key={index}>
            <Card
              className={styles.comment}
              onClick={() =>
                navigate(`/prompts/${item.templateId}/${item.promptId}`)
              }
            >
              <span>{item.question}</span>
            </Card>
          </div>
        ))}
      </div>
    </CommonLayout>
  )
}

export default UserProfilePage
