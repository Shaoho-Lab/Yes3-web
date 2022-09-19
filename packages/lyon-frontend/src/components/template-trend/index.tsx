import classNames from 'classnames'
import styles from './index.module.scss'
import { firestore, doc, getDoc } from '../../firebase'

export interface TemplateTrendProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const TemplateTrend = ({ className, ...props }: TemplateTrendProps) => {
  const templateRef = doc(firestore, 'template-trend', '1')
  getDoc(templateRef).then(snapshot => {
    if (snapshot.data() !== undefined) {
      console.log(snapshot.data())
    } else {
      throw new Error('No data')
    }
    return (
      <div className={classNames(styles.templateTrend, className)} {...props}>
       abc
      </div>
    )
  })

}

export default TemplateTrend
