import { doc, firestore, getDoc, updateDoc } from 'common/firebase'
import Button from 'components/button'
import Navbar from 'components/navbar'
import SearchBar from 'components/search-bar'
import TemplateCardList from 'components/template-card-list'
import { getDefaultProvider } from 'ethers'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'
import styles from './index.module.scss'

const TemplateListPage = () => {
  const navigate = useNavigate()
  const { address } = useAccount()

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
  }, [address])

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Navbar />
        <div className={styles.searchRow}>
          <SearchBar
            className={styles.searchBar}
            placeholder="Search question templates or create new one"
          />
          <Button
            className={styles.createButton}
            onClick={() => navigate('/templates/create')}
          >
            Create
          </Button>
        </div>
      </div>
      <div className={styles.content}>
        <TemplateCardList />
      </div>
    </div>
  )
}

export default TemplateListPage
