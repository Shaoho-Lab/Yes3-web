import classNames from 'classnames'
import { ConnectKitButton } from 'connectkit'
import { buildJazziconDataUrl } from 'helpers/jazzicon'
import { useAccount } from 'wagmi'
import styles from './index.module.scss'

export interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {}

const Navbar = ({ className, ...props }: NavbarProps) => {
  const { address } = useAccount()

  return (
    <div className={classNames(styles.navbar, className)} {...props}>
      <div className={styles.logo}>Lyon</div>
      {address ? (
        <img
          className={styles.jazzicon}
          src={buildJazziconDataUrl(address)}
          alt={address}
        />
      ) : (
        <ConnectKitButton />
      )}
    </div>
  )
}

export default Navbar
