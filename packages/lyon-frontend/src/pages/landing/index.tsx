import Button from 'components/button'
import Card from 'components/card'
import CommonLayout from 'components/common-layout'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.scss'
import SBT from './sbt.png'
import NFT from './nft.png'

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <CommonLayout className={styles.page}>
      <div className={styles.firstView}>
        <div className={styles.heading}>Yes3 is a P2P credential platform</div>
        <div className={styles.description}>
          You can ask anything and get your replies on chain
        </div>
        <Button
          className={styles.button}
          onClick={() => navigate('/templates')}
        >
          Ask your question now
        </Button>
      </div>
      <div className={styles.cards}>
        <Card className={styles.card}>
          <div className={styles.heading}>Get Promise</div>
          <div className={styles.description}>
            Want to record someone's promise on chain?
            <br />
            <br />
            Ask them a question and record their reply with Yes3!
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
            <br />
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
            <p>Mint a new question as NFT</p>
            <p>
              <b>OR</b>
            </p>
            <p>Use existing NFT template</p>
            <img className={styles.squareLeft} src={NFT} alt="NFT" />
          </div>
          <div className={styles.arrow} />
          <div className={styles.step}>
            <p>Send to your friend and let them reply (it's free!)</p>
          </div>
          <div className={styles.arrow} />
          <div className={styles.step}>
            <p>Record the interaction reply with dynamic SBT</p>
            <br />
            <p>
              <small>
                (SBT, or Soulbound Tokens, are non-transferrable NFT designed to
                show your permenant credentials)
              </small>
            </p>
            <img className={styles.squareRight} src={SBT} alt="SBT" />
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
