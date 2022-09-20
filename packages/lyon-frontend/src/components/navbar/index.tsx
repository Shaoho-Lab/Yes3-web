import classNames from 'classnames'
import { ConnectKitButton } from 'connectkit'
import { buildJazziconDataUrl } from 'helpers/jazzicon'
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { ethers } from 'ethers'
import styles from './index.module.scss'

export interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {}

const Navbar = ({ className, ...props }: NavbarProps) => {
  const navigate = useNavigate()

  const { address } = useAccount()

  return (
    <div className={classNames(styles.navbar, className)} {...props}>
      <div className={styles.logo} onClick={() => navigate('/app')}>
        Yes3
      </div>
      {address ? (
        <img
          className={styles.jazzicon}
          src={buildJazziconDataUrl(address)}
          alt={address}
          onClick={() => navigate('/user/profile')}
        />
      ) : (
        <ConnectKitButton />
      )}
    </div>
  )
}

export default Navbar
