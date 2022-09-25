import classNames from 'classnames'
import styles from './index.module.scss'

export interface NFTSBTMintBoxProps
  extends React.HTMLAttributes<HTMLDivElement> {
  question: string
}

const NFTSBTMintBox = ({
  className,
  question,
  ...props
}: NFTSBTMintBoxProps) => {
  return (
    <div
      className={classNames(styles.NFTSBTMintBox, className)}
      id="NFTSBTMint"
    >
      <div className={styles.question}>{question}</div>
      <div className={styles.powerBy}>Powered by Lyon with &lt;3</div>
    </div>
  )
}

export default NFTSBTMintBox
