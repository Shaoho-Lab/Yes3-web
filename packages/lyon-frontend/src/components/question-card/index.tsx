import classNames from 'classnames'
import Card, { CardProps } from 'components/card'
import { buildJazziconDataUrl } from 'helpers/jazzicon'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.scss'

export interface QuestionCardProps extends Omit<CardProps, 'children'> {
  templateId: string
  content: string
  ownerAddress: string
  numAnswers?: number
}

const QuestionCard = ({
  templateId,
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
        <div className={styles.stats}>
          {numAnswers} people used this template
        </div>
        <div
          className={styles.button}
          onClick={() => navigate('/templates/' + templateId)}
        >
          Ask this question
        </div>
      </div>
    </Card>
  )
}

export default QuestionCard
