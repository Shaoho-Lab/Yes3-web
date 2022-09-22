import classNames from 'classnames'
import styles from './index.module.scss'
import { firestore, doc, getDoc } from '../../firebase'
import { useState, useEffect } from 'react'

export interface NFTSBTBoxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  question: string
  replyShow: string
}

const NFTSBTBox = ({
  className,
  question,
  replyShow,
  ...props
}: NFTSBTBoxProps) => {
  return (
    <div className={styles.body} id="NFTSBT">
      <h1>{question}</h1>
      <a href="www.google.com" color="white">
        {replyShow}
      </a>
      <h2>Powered by Lyon with &lt;3</h2>
    </div>
  )
}

export default NFTSBTBox
