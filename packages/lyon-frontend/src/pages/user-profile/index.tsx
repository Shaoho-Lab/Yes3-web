import Card from 'components/card'
import CommonLayout from 'components/common-layout'
import { buildJazziconDataUrl } from 'helpers/jazzicon'
import { redirect } from 'react-router-dom'
import { useAccount } from 'wagmi'
import styles from './index.module.scss'

const UserProfilePage = () => {
  const { address } = useAccount()

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
          <div className={styles.name}>Jason Hu</div>
          <div className={styles.address}>{address}</div>
        </div>
      </Card>
      <div className={styles.heading}>My Prompts</div>
      <div className={styles.heading}>My Question Templates</div>
      <div className={styles.heading}>My Given Replies</div>
    </CommonLayout>
  )
}

export default UserProfilePage
