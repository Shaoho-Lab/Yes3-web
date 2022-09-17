import classNames from 'classnames'
import { useState } from 'react'
import styles from './index.module.scss'

export interface SearchBarProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const SearchBar = ({ className, ...props }: SearchBarProps) => {
  const [focused, setFocused] = useState(false)

  console.log(focused)

  return (
    <input
      className={classNames(styles.searchBar, className)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      {...props}
    />
  )
}

export default SearchBar
