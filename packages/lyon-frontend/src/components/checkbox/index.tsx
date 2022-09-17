import classNames from 'classnames'
import styles from './index.module.scss'

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Checkbox = ({ className, label, ...props }: CheckboxProps) => {
  return (
    <label className={classNames(styles.checkbox, className)}>
      <input className={styles.input} type="checkbox" {...props} />
      {label}
    </label>
  )
}

export default Checkbox
