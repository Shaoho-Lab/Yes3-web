// import React from 'react'
// import Popup from './popupModal'

// interface PopupWrapperProps {
//   isVisible: boolean
//   onClose: () => void
// }

// const PopupWrapper: React.FC<PopupWrapperProps> = ({ onClose, isVisible }) => {
//   if (!isVisible) {
//     return null
//   }
//   return <Popup onClose={onClose} />
// }

//export default PopupWrapper
import React, { ButtonHTMLAttributes, HtmlHTMLAttributes } from 'react'
import styles from './index.module.scss'

interface PopupProps {
  setTrigger: any
  trigger: boolean
  children?: React.ReactNode
}

function Popup(props: PopupProps) {
  return props.trigger ? (
    <div className={styles.popup}>
      <div className={styles.popupInner}>
        <div className={styles.title}>Mint</div>
        <button
          className={styles.closeBtn}
          onClick={() => props.setTrigger(false)}
        >
          x
        </button>
        {props.children}
      </div>
    </div>
  ) : (
    <></>
  )
}

export default Popup
