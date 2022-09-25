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
    <div className={classNames(styles.body, className)} id="NFTSBT">
      <h5>{question}</h5>
      <div className="list-container">
        {replyShow?.map((item, index) => (
          <div key={index}>
            <a color="white">{item}</a>
          </div>
        ))}
      </div>

      <h6>Powered by Lyon with &lt;3</h6>
    </div>
  )
}

export default NFTSBTBox
