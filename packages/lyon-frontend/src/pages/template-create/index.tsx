import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react'
import { Contract } from '@ethersproject/contracts'
import {
  doc,
  firestore,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'common/firebase'
import Button from 'components/button'
import CommonLayout from 'components/common-layout'
import NFTMintBox from 'components/NFTMintBox'
import LyonTemplate from 'contracts/LyonTemplate.json'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount, useSigner } from 'wagmi'
import * as htmlToImage from 'html-to-image'
import { File, NFTStorage } from 'nft.storage'
import styles from './index.module.scss'
import { dataURLtoFile } from 'helpers/image'

const TemplateCreatePage = () => {
  const [templateQuestion, setTemplateQuestion] = useState('')
  const [templateContext, setTemplateContext] = useState('')
  const [templateId, setTemplateId] = useState('0')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  const navigate = useNavigate()
  const toast = useToast()

  const { data: signer } = useSigner()
  const { address } = useAccount()

  const client = new NFTStorage({
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEI5QTUwQjZGN0Y0YTkwODExNDQzNDU1ZTBGODQ1OTk0QTc4OTQ4MjciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MzgxMzI2MjY4OCwibmFtZSI6IlllczMifQ.CFX9BRbLs1ohAslhXC3T-4CWyPZexG1CLWjicH7akRU',
  })

  const upload2IPFS = async (image: File) => {
    const metadata = await client.store({
      name: 'Yes3',
      description:
        'Mint your social interactions on-chain! Powered by Lyon with <3',
      image,
    })

    return metadata.url.toString()
  }

  const HTML2PNG2IPFS = async () => {
    const node = document.getElementById('NFTMint')
    const dataUrl = await htmlToImage.toJpeg(node!)
    const img = dataURLtoFile(dataUrl, 'image.jpg')

    return upload2IPFS(img)
  }

  const handleMintTemplate = async () => {
    try {
      if (signer) {
        const uri = await HTML2PNG2IPFS()

        const LyonTemplateContract = new Contract(
          LyonTemplate.contract,
          LyonTemplate.abi,
          signer,
        )

        const promptSafeMintResponse = await LyonTemplateContract.mintTemplate(
          templateQuestion,
          templateContext,
          uri,
        )

        console.log('promptSafeMintResponse', promptSafeMintResponse.hash)

        const templateMetadataRef = doc(
          firestore,
          'template-metadata',
          'global',
        )
        const templateMetadataSnapshot = await getDoc(templateMetadataRef)
        const fetchedData = templateMetadataSnapshot.data()
        const templateCount = fetchedData?.count + 1

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
          templateURI: uri, //TODO: add template uri
        })

        setTemplateId(templateCount.toString())
        setIsModalOpen(false)
        setIsSuccessModalOpen(true)
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
        placeholder="What's the context?"
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
        <Button
          className={styles.cancel}
          variant="secondary"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button
          className={styles.confirm}
          variant="primary"
          onClick={() => {
            if (templateQuestion.length === 0) {
              toast({
                title: 'Oops!',
                description: 'Question content is required.',
                status: 'error',
                duration: 2000,
                isClosable: true,
              })
            } else {
              setIsModalOpen(true)
            }
          }}
        >
          Mint
        </Button>
        <Modal
          size="xl"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Mint Question Template NFT</ModalHeader>
            <ModalBody>
              <p>Preview your NFT, then click the button to mint your NFT!</p>
              <br />
              <NFTMintBox question={templateQuestion} />
            </ModalBody>
            <ModalFooter>
              <Button
                size="medium"
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
                style={{ marginRight: 15 }}
              >
                Cancel
              </Button>
              <Button size="medium" onClick={() => handleMintTemplate()}>
                Confirm
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Mint Success - Congrats!</ModalHeader>
            <ModalBody>
              <p>Your question template NFT has been minted!</p>
              <p>Now people can use it to mint SBTs.</p>
            </ModalBody>
            <ModalFooter>
              <Button
                size="medium"
                onClick={() => navigate(`/templates/${templateId}`)}
              >
                Navigate to your template
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </CommonLayout>
  )
}

export default TemplateCreatePage
