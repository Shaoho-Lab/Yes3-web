import classNames from 'classnames'
import styles from './index.module.scss'
import { firestore, doc, getDoc } from '../../firebase'
import { Graph } from 'react-d3-graph'
import { useState, useEffect } from 'react'

export interface TemplateTreeProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  templateId: string
}

// const data = {
//   nodes: [
//     { id: 'Vitalik' },
//     { id: 'Jason' },
//     { id: 'zh3036' },
//     { id: 'Will' },
//     { id: 'Aego' },
//     { id: 'Yan' },
//   ],
//   links: [
//     { source: 'Vitalik', target: 'Jason' },
//     { source: 'Jason', target: 'zh3036' },
//     { source: 'Jason', target: 'Will' },
//     { source: 'Aego', target: 'zh3036' },
//     { source: 'Aego', target: 'Will' },
//     { source: 'Yan', target: 'Jason' },
//     { source: 'Will', target: 'zh3036' },
//   ],
// }

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
  height: 300,
  width: 400,
  directed: true,
  automaticRearrangeAfterDropNode: true,
  collapsible: true,
  highlightDegree: 2,
  highlightOpacity: 0.2,
  linkHighlightBehavior: true,
  maxZoom: 12,
  minZoom: 0.05,
  panAndZoom: false,
  staticGraph: false,
  d3: {
    alphaTarget: 0.05,
    gravity: -250,
    linkLength: 120,
    linkStrength: 2,
  },
}

const onClickNode = function (nodeId: string) {
  window.alert(`Clicked node ${nodeId}`)
}

const onClickLink = function (source: string, target: string) {
  window.alert(`Clicked link between ${source} and ${target}`)
}

const TemplateTree = ({
  className,
  templateId,
  ...props
}: TemplateTreeProps) => {
  const [treeData, setTreeData] = useState<{
    nodes: { id: string }[]
    links: { source: string; target: string }[]
  }>({
    nodes: [],
    links: [],
  })

  useEffect(() => {
    const templateRef = doc(firestore, 'template-graph', templateId)
    getDoc(templateRef).then(snapshot => {
      if (snapshot.data() !== undefined) {
        const data: {
          nodes: { id: string }[]
          links: { source: string; target: string }[]
        } = {
          nodes: [],
          links: [],
        }
        const templateData = snapshot.data()?.connections
        for (var i = 0; i < templateData.length; i++) {
          data.nodes.push({ id: templateData[i].endorser })
          data.nodes.push({ id: templateData[i].requester })
          data.links.push({
            source: templateData[i].endorser,
            target: templateData[i].requester,
          })
        }
        setTreeData(data)
      } else {
        throw new Error('No data')
      }
    })
  }, [])
  return (
    <div className={classNames(styles.templateTree, className)} {...props}>
      <Graph
        id="graph-id"
        data={treeData}
        config={myConfig}
        onClickNode={onClickNode}
        onClickLink={onClickLink}
      />
    </div>
  )
}

export default TemplateTree
