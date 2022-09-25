import classNames from 'classnames'
import styles from './index.module.scss'

export interface NFTMintBoxProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  question: string
}

const NFTMintBox = ({ className, question, ...props }: NFTMintBoxProps) => {
  return (
    <div
      id="NFTSBTMint"
      className={classNames(styles.NFTMintBox, className)}
      {...props}
    >
      <div className={styles.question}>{question}</div>
      <div className={styles.powerBy}>Powered by Lyon with &lt;3</div>
    </div>
  )
}

export default NFTMintBox
