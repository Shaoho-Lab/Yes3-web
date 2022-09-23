import Navbar from 'components/navbar'
import QuestionCard from 'components/question-card'
import SearchBar from 'components/search-bar'
import { useNavigate } from 'react-router-dom'
import { ethers } from 'ethers'
import styles from './index.module.scss'
import QuestionCards from 'components/question-cards'

const AppPage = () => {
  const navigate = useNavigate()

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
