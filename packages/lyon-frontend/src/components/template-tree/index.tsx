import { doc, firestore, getDoc } from 'common/firebase'
import { useEffect, useState } from 'react'
import { Graph } from 'react-d3-graph'

export interface TemplateTreeProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  templateId: string
}

const myConfig = {
  nodeHighlightBehavior: true,
  node: {
    color: '#3F5EFB',
    size: 120,
    fontWeight: '900',
    highlightStrokeColor: 'blue',
    symbolType: 'circle',
  },
  link: {
    color: '#FC466B',
    highlightColor: 'red',
  },
  height: 400,
  width: 1000,
  directed: true,
  automaticRearrangeAfterDropNode: true,
  highlightDegree: 2,
  highlightOpacity: 0.2,
  linkHighlightBehavior: true,
  maxZoom: 12,
  minZoom: 1,
  labelPosition: 'top',
  d3: {
    alphaTarget: 0.05,
    gravity: -100,
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
    const getName = (userAddressNameMapping: any, address: string) => {
      const name = userAddressNameMapping[address]
      return name ? name : address
    }
    const loadGraph = async () => {
      const userRef = doc(firestore, 'user-metadata', 'info')
      const userRefSnapshot = await getDoc(userRef)
      const userAddressNameMapping = userRefSnapshot.data()

      const templateRef = doc(firestore, 'template-metadata', templateId)
      const snapshot = await getDoc(templateRef)

      if (snapshot.exists()) {
        const fetchedData = snapshot.data()
        const data: {
          nodes: { id: string }[]
          links: { source: string; target: string }[]
        } = {
          nodes: [],
          links: [],
        }
        const templateData = fetchedData.connections
        if (templateData !== undefined) {
          for (var i = 0; i < templateData.length; i++) {
            data.nodes.push({
              id: getName(
                userAddressNameMapping,
                templateData[i].endorserAddress,
              ),
            })
            data.nodes.push({
              id: getName(
                userAddressNameMapping,
                templateData[i].requesterAddress,
              ),
            })
            data.links.push({
              source: getName(
                userAddressNameMapping,
                templateData[i].endorserAddress,
              ),
              target: getName(
                userAddressNameMapping,
                templateData[i].requesterAddress,
              ),
            })
          }
        }
        setTreeData(data)
      } 
    }

    loadGraph()
  }, [templateId])

  return (
    // <div className={classNames(styles.templateTree, className)} {...props}>
    <Graph
      id="graph-id"
      data={treeData ? treeData : { nodes: [], links: [] }}
      config={myConfig}
      onClickNode={onClickNode}
      onClickLink={onClickLink}
    />
    // </div>
  )
}

export default TemplateTree
