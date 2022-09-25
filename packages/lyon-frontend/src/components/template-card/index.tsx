import classNames from 'classnames'
import Button from 'components/button'
import Card, { CardProps } from 'components/card'
import { buildJazziconDataUrl } from 'helpers/jazzicon'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.scss'

export interface TemplateCardProps extends Omit<CardProps, 'children'> {
  templateId: string
  content: string
  ownerAddress: string
  numAnswers?: number
}

const TemplateCard = ({
  templateId,
  content,
  ownerAddress,
  numAnswers = 0,
  className,
  ...props
}: TemplateCardProps) => {
  const navigate = useNavigate()

  return (
    <Card className={classNames(styles.templateCard, className)} {...props}>
      <div className={styles.firstRow}>
        <div className={styles.content}>{content}</div>
        <img
          className={styles.jazzicon}
          src={buildJazziconDataUrl(ownerAddress)}
          alt={ownerAddress}
          onClick={() => navigate(`/users/${ownerAddress}`)}
        />
      </div>
      <div className={styles.secondRow}>
        <div className={styles.count}>
          {numAnswers > 0
            ? `${numAnswers} people used this template`
            : 'Has not been used yet'}
        </div>
        <Button
          size="medium"
          onClick={() => navigate('/templates/' + templateId)}
        >
          Ask this question
        </Button>
      </div>
    </Card>
  )
}

export default TemplateCard
