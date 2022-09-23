import React, { ButtonHTMLAttributes, HtmlHTMLAttributes } from 'react'
import styles from './index.module.scss'
import ReactDOM from 'react-dom'

interface PopupProps {
  onClose: () => void
}

const Popup: React.FC<PopupProps> = ({ onClose }) => {
  return ReactDOM.createPortal(
    <div onClick={onClose}>
      <span>Pop!</span>
    </div>,
    document.getElementById('PopupProp')!,
  )
}

export default Popup

// function Popup(props: {
//   trigger: boolean
//   children:
//     | string
//     | number
//     | boolean
//     | React.ReactElement<any, string | React.JSXElementConstructor<any>>
//     | React.ReactFragment
//     | React.ReactPortal
//     | null
//     | undefined
// }) {
//   return props.trigger ? (
//     <div className="popup">
//       <div className="popup-inner">
//         <button className="close-btn">close</button>
//         {props.children}
//       </div>
//     </div>
//   ) : (
//     ''
//   )
// }

// export default Popup
