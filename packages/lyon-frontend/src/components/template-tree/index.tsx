import classNames from 'classnames'
import { useState } from 'react'
import styles from './index.module.scss'
import { Graph } from 'react-d3-graph'

export interface TemplateTreeProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const data = {
  nodes: [
    { id: 'Vitalik' },
    { id: 'Jason' },
    { id: 'zh3036' },
    { id: 'Will' },
    { id: 'Aego' },
    { id: 'Yan' },
  ],
  links: [
    { source: 'Vitalik', target: 'Jason' },
    { source: 'Jason', target: 'zh3036' },
    { source: 'Jason', target: 'Will' },
    { source: 'Aego', target: 'zh3036' },
    { source: 'Aego', target: 'Will' },
    { source: 'Yan', target: 'Jason' },
    { source: 'Will', target: 'zh3036' },
  ],
}

const myConfig = {
  nodeHighlightBehavior: true,
  node: {
    color: 'lightgreen',
    size: 120,
    highlightStrokeColor: 'blue',
  },
  link: {
    highlightColor: 'lightblue',
  },
}

const onClickNode = function (nodeId: string) {
  window.alert(`Clicked node ${nodeId}`)
}

const onClickLink = function (source: string, target: string) {
  window.alert(`Clicked link between ${source} and ${target}`)
}

const TemplateTree = ({ className, ...props }: TemplateTreeProps) => {
  return (
    <div className={classNames(styles.templateTree, className)} {...props}>
      <Graph
        id="graph-id" // id is mandatory
        data={data}
        config={myConfig}
        onClickNode={onClickNode}
        onClickLink={onClickLink}
      />
    </div>
  )
}

export default TemplateTree
