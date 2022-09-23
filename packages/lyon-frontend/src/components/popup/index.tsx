import React, { ButtonHTMLAttributes, HtmlHTMLAttributes } from 'react'
import styles from './index.module.scss'
import { firestore, doc, getDoc } from '../../firebase'
import { useState, useEffect } from 'react'
import NFTSBTBox from 'components/NFTSBTBox'

export interface PopupProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  question: string
  replyShow: string
  targetId?: string
  title?: string
  message?: string
  buttons?: Array<
    {
      label: string
      className?: string
    } & ButtonHTMLAttributes<HTMLButtonElement>
  >
  childrenElement?: () => React.ReactNode
  customUI?: (customUiOptions: {
    title: string
    message: string
    onClose: () => void
  }) => React.ReactNode
  closeOnClickOutside?: boolean
}

const PopupProps = ({
  className,
  question,
  replyShow,
  ...props
}: PopupProps) => {
  return (
    <div className={styles.alertOverlay}>
      <div className={styles.body} id="NFTSBT">
        <h5>{question}</h5>
        <a href="www.google.com" color="white">
          {replyShow}
        </a>
        <h6>Powered by Lyon with &lt;3</h6>
      </div>
    </div>
  )
}

export default PopupProps
