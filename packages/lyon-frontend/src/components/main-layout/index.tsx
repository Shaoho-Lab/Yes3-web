import Navbar from 'components/navbar'
import { PropsWithChildren } from 'react'
import styles from './index.module.scss'

export interface MainLayoutProps extends PropsWithChildren {}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className={styles.mainLayout}>
      <Navbar className={styles.header} />
      <div className={styles.content}>{children}</div>
    </div>
  )
}

export default MainLayout
