import Card from 'components/card'
import CommonLayout from 'components/common-layout'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.scss'

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <CommonLayout className={styles.page}>
      <div className={styles.firstView}>
        <div className={styles.heading}>Lyon is a P2P credential platform</div>
        <div className={styles.description}>
          You can ask anything and get your replies on chain
        </div>
        <div className={styles.button} onClick={() => navigate('/app')}>
          Ask now
        </div>
      </div>
      <div className={styles.cards}>
        <Card className={styles.card}>
          <div className={styles.heading}>Get Promise</div>
          <div className={styles.description}>
            Want to record someone's promise on chain?
            <br />
            <br />
            Ask them a question and record their reply with Lyon!
          </div>
        </Card>
        <Card className={styles.card}>
          <div className={styles.heading}>Get Endorsement</div>
          <div className={styles.description}>
            Did something great off-chain but want to showcase with the credible
            support of someone?
            <br />
            <br />
            Describe it and ask for endorsement!
          </div>
        </Card>
        <Card className={styles.card}>
          <div className={styles.heading}>Get Badges</div>
          <div className={styles.description}>
            Whenever you ask a question, you get a NFT or SBT designed to show
            your credential across the whole web3 world
          </div>
        </Card>
      </div>
      <div className={styles.howTo}>
        <div className={styles.heading}>How you can use it?</div>
        <div className={styles.steps}>
          <div className={styles.step}>
            Mint a new question as NFT
            <br />
            <br />
            OR
            <br />
            <br />
            Use existing NFT template
            <div className={styles.squareLeft} />
          </div>
          <div className={styles.arrow} />
          <div className={styles.step}>
            Send to your friend and let them reply (it's free!)
          </div>
          <div className={styles.arrow} />
          <div className={styles.step}>
            Record the interaction reply with dynamic SBT
            <br />
            <br />
            <small>
              (SBT, or Soulbound Tokens, are non-transferrable NFT designed to
              show your permenant credentials)
            </small>
            <div className={styles.squareRight} />
          </div>
        </div>
      </div>
      <div className={styles.credit}>
        <div className={styles.heading}>Let the credit flow~</div>
        <div className={styles.graph}></div>
      </div>
    </CommonLayout>
  )
}

export default LandingPage
