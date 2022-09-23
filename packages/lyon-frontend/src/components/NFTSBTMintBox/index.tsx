import classNames from 'classnames'
import styles from './index.module.scss'

export interface NFTSBTMintBoxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  question: string
  replyShow: string
}

const NFTSBTMintBox = ({
  className,
  question,
  replyShow,
  ...props
}: NFTSBTMintBoxProps) => {
  return (
    <div className={styles.body} id="NFTSBTMint">
      <h5>{question}</h5>
      <a href="www.google.com" color="white">
        {replyShow}
      </a>
      <h6>Powered by Lyon with &lt;3</h6>
    </div>
  )
}

export default NFTSBTMintBox
