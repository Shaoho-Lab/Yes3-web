import classNames from 'classnames'
import { doc, firestore, getDoc } from 'common/firebase'
import { TemplateStruct } from 'common/structs'
import { CardProps } from 'components/card'
import QuestionCard from 'components/template-card'
import { useEffect, useState } from 'react'
import styles from './index.module.scss'

export interface TemplateCardListProps extends Omit<CardProps, 'children'> {}

const TemplateCardList = ({ className, ...props }: TemplateCardListProps) => {
  // TODO how to render when read, or we can just read all at once and have the list to for loop
  const [templateCardList, setTemplateCardList] = useState<TemplateStruct[]>()

  useEffect(() => {
    const loadQuestion = async () => {
      // TODO use getter to get all document ids
      const templateMetadataRef = doc(firestore, 'template-metadata', 'global')
      const snapshot = await getDoc(templateMetadataRef)
      const templateIds: string[] = []

      if (snapshot.exists()) {
        const fetchedData = snapshot.data()
        const count = fetchedData.count

        for (let i = 1; i < count + 1; i++) {
          templateIds.push(i.toString())
        }
      }

      const templateCardListData: TemplateStruct[] = []

      await Promise.all(
        templateIds.map(async templateId => {
          const templateRef = doc(firestore, 'template-metadata', templateId)
          const snapshot = await getDoc(templateRef)

          if (snapshot.exists()) {
            const fetchedData = snapshot.data()
            const question = fetchedData.question
            const ownerAddress = fetchedData.ownerAddress
            const numAnswers = fetchedData.numAnswers

            templateCardListData.push({
              templateId,
              question,
              ownerAddress,
              numAnswers,
            })
          }
        }),
      )

      templateCardListData.sort((a, b) => b.numAnswers - a.numAnswers)

      setTemplateCardList(templateCardListData)
    }

    loadQuestion()
  }, [])

  return (
    <div className={classNames(styles.templateCardList, className)} {...props}>
      {templateCardList?.map((templateCard, index) => (
        <QuestionCard
          key={index}
          templateId={templateCard.templateId}
          content={templateCard.question}
          ownerAddress={templateCard.ownerAddress}
          numAnswers={templateCard.numAnswers}
        />
      ))}
    </div>
  )
}

export default TemplateCardList
