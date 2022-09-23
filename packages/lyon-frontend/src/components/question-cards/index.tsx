import classNames from 'classnames'
import Card, { CardProps } from 'components/card'
import { buildJazziconDataUrl } from 'helpers/jazzicon'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.scss'
import { firestore, doc, getDoc, collection } from '../../firebase'
import QuestionCard from 'components/question-card'

export interface QuestionCardsProps extends Omit<CardProps, 'children'> {}

const QuestionCards = ({ className, ...props }: QuestionCardsProps) => {
  // TODO how to render when read, or we can just read all at once and have the list to for loop
  const [questionCardList, setQuestionCardList] = useState<
    {
      templateId: string
      question: string
      ownerAddress: string
      numAnswers: number
    }[]
  >()

  useEffect(() => {
    const loadQuestion = async () => {
      // TODO use getter to get all document ids
      const templateMetadataRef = doc(firestore, 'template-metadata', 'global')
      const snapshot = await getDoc(templateMetadataRef)
      const quesitonIds: string[] = []
      if (snapshot.exists()) {
        const fetchedData = snapshot.data()
        const count = fetchedData.count
        for (let i = 1; i < count + 1; i++) {
          quesitonIds.push(i.toString())
        }
      }
      const questionCardListData: {
        templateId: string
        question: string
        ownerAddress: string
        numAnswers: number
      }[] = []

      for (const id of quesitonIds) {
        const questionRef = doc(firestore, 'template-metadata', id)
        const snapshot = await getDoc(questionRef)

        if (snapshot.exists()) {
          const fetchedData = snapshot.data()
          const question = fetchedData.question
          const ownerAddress = fetchedData.ownerAddress
          const numAnswers = fetchedData.numAnswers

          questionCardListData.push({
            templateId: id,
            question: question,
            ownerAddress: ownerAddress,
            numAnswers: numAnswers,
          })
        }
      }
      questionCardListData.sort((a, b) => b.numAnswers - a.numAnswers)
      setQuestionCardList(questionCardListData)
    }

    loadQuestion()
  }, [])

  return (
    <div className={classNames(styles.questionCards, className)} {...props}>
      {questionCardList?.map((questionCard, index) => (
        <QuestionCard
          key={index}
          templateId={questionCard.templateId}
          content={questionCard.question}
          ownerAddress={questionCard.ownerAddress}
          numAnswers={questionCard.numAnswers}
        />
      ))}
    </div>
  )
}

export default QuestionCards
