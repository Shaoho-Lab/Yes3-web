import classNames from 'classnames'
import styles from './index.module.scss'
import { firestore, doc, getDoc } from '../../firebase'
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js'
import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
]

export interface TemplateTrendProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const TemplateTrend = ({ className, ...props }: TemplateTrendProps) => {
  const [trendData, setTrendData] = useState<any>([])

  useEffect(() => {
    const data: any = []
    const templateRef = doc(firestore, 'template-trend', '1')
    getDoc(templateRef).then(snapshot => {
      if (snapshot.data() !== undefined) {
        const fetchedData = snapshot.data()
        const trendKeys = Object.keys(fetchedData!).sort()
        trendKeys.forEach(name => {
          data.push({ timeInterval: name, count: fetchedData![name] })
        })
        setTrendData(data)
      } else {
        throw new Error('No data')
      }
    })
  }, [])
  console.log(trendData)
  return trendData.length > 0 ? (
    <LineChart
      width={400}
      height={200}
      data={trendData}
      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
    >
      <XAxis dataKey="timeInterval" />
      <Tooltip />
      <CartesianGrid stroke="#f5f5f5" />
      <Line type="monotone" dataKey="count" stroke="#ff7300" yAxisId={0} />
    </LineChart>
  ) : null
  // return (
  //   <div className={classNames(styles.templateTree, className)} {...props}>
  //     <Graph
  //       id="graph-id"
  //       data={data}
  //       config={myConfig}
  //       onClickNode={onClickNode}
  //       onClickLink={onClickLink}
  //     />
  //     ;
  //   </div>
  // )
}

export default TemplateTrend
