import Navbar from 'components/navbar'
import SearchBar from 'components/search-bar'
import { useNavigate } from 'react-router-dom'
import { getDefaultProvider } from 'ethers'
import styles from './index.module.scss'
import QuestionCards from 'components/question-cards'
import { useEffect } from 'react'
import { firestore, doc, getDoc, updateDoc } from '../../firebase'
import { useAccount } from 'wagmi'

const AppPage = () => {
  const navigate = useNavigate()
  const { address, isConnecting, isDisconnected } = useAccount()
  useEffect(() => {
    const syncNameMapping = async () => {
      const userRef = doc(firestore, 'user-metadata', 'info')
      const userRefSnapshot = await getDoc(userRef)
      const userAddressNameMapping = userRefSnapshot.data()

      if (
        userAddressNameMapping !== undefined &&
        address !== undefined &&
        userAddressNameMapping[address] === undefined
      ) {
        const providerETH = getDefaultProvider('homestead')
        const ENSName = await providerETH.lookupAddress(address)
        if (ENSName !== null) {
          updateDoc(userRef, {
            [address]: ENSName,
          })
        }
      }
    }

    syncNameMapping()
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Navbar />
        <div className={styles.searchRow}>
          <SearchBar
            className={styles.searchBar}
            placeholder="Search question templates or create new one"
          />
          <div
            className={styles.createButton}
            onClick={() => navigate('/templates/create')}
          >
            Create
          </div>
        </div>
      </div>
      <div className={styles.questionList}>
        <QuestionCards />
      </div>
    </div>
  )
}

export default AppPage
