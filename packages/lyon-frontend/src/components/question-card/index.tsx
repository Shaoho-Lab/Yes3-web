import classNames from 'classnames'
import Card, { CardProps } from 'components/card'
import { buildJazziconDataUrl } from 'helpers/jazzicon'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.scss'

export interface QuestionCardProps extends Omit<CardProps, 'children'> {
  content: string
  ownerAddress: string
  numAnswers?: number
}

const QuestionCard = ({
  content,
  ownerAddress,
  numAnswers = 0,
  className,
  ...props
}: QuestionCardProps) => {
  const navigate = useNavigate()

  return (
    <Card className={classNames(styles.questionCard, className)} {...props}>
      <div className={styles.firstRow}>
        <div className={styles.content}>{content}</div>
        <img
          className={styles.jazzicon}
          src={buildJazziconDataUrl(ownerAddress)}
          alt={ownerAddress}
        />
      </div>
      <div className={styles.secondRow}>
        <div className={styles.stats}>{numAnswers} answers</div>
        <div
          className={styles.button}
          onClick={() => navigate('/templates/0x123456781234567812345678')}
        >
          Mint question
        </div>
      </div>
    </Card>
  )
}

export default QuestionCard
