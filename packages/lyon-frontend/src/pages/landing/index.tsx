import { useNavigate } from 'react-router-dom'
import styles from './index.module.scss'

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <h1>Hi, Lyon</h1>
      <button onClick={() => navigate('/app')}>Go to App</button>
    </div>
  )
}

export default LandingPage
