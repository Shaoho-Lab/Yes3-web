import Navbar from 'components/navbar'
import QuestionCard from 'components/question-card'
import SearchBar from 'components/search-bar'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.scss'

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
        <QuestionCard
          content="Am I a good Solidity engineer?"
          ownerAddress="0xf5d6348B82e2049D72DbfC91c41E224dC19c7296"
          numAnswers={20}
        />
        <QuestionCard
          content="Am I a good team member in ETH Global Hackathon?"
          ownerAddress="0xf5d6348B82e2049D72DbfC91c41E224dC19c7296"
          numAnswers={128}
        />
        <QuestionCard
          content="Do you recommend me to work at Ethereum Foundation?"
          ownerAddress="0xf5d6348B82e2049D72DbfC91c41E224dC19c7296"
          numAnswers={5}
        />
        <QuestionCard
          content="Am I a good Solidity engineer?"
          ownerAddress="0xf5d6348B82e2049D72DbfC91c41E224dC19c7296"
          numAnswers={20}
        />
        <QuestionCard
          content="Am I a good team member in ETH Global Hackathon?"
          ownerAddress="0xf5d6348B82e2049D72DbfC91c41E224dC19c7296"
          numAnswers={128}
        />
        <QuestionCard
          content="Do you recommend me to work at Ethereum Foundation?"
          ownerAddress="0xf5d6348B82e2049D72DbfC91c41E224dC19c7296"
          numAnswers={5}
        />
        <QuestionCard
          content="Am I a good Solidity engineer?"
          ownerAddress="0xf5d6348B82e2049D72DbfC91c41E224dC19c7296"
          numAnswers={20}
        />
        <QuestionCard
          content="Am I a good team member in ETH Global Hackathon?"
          ownerAddress="0xf5d6348B82e2049D72DbfC91c41E224dC19c7296"
          numAnswers={128}
        />
        <QuestionCard
          content="Do you recommend me to work at Ethereum Foundation?"
          ownerAddress="0xf5d6348B82e2049D72DbfC91c41E224dC19c7296"
          numAnswers={5}
        />
      </div>
    </div>
  )
}

export default AppPage
