import classNames from 'classnames'
import styles from './index.module.scss'

export interface NFTSBTBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  question: string
  replyShow: string[]
}

const NFTSBTBox = ({
  className,
  question,
  replyShow,
  ...props
}: NFTSBTBoxProps) => {
  return (
    <div
      id="NFTSBT"
      className={classNames(styles.NFTSBTBox, className)}
      {...props}
    >
      <div className={styles.question}>{question}</div>
      <div className={styles.replies}>
        {replyShow?.map((item, index) => (
          <div key={index} className={styles.reply}>
            {item}
          </div>
        ))}
      </div>
      <div className={styles.powerBy}>Powered by Lyon with &lt;3</div>
    </div>
  )
}

export default NFTSBTBox
