import classNames from 'classnames'
import styles from './index.module.scss'
import { firestore, doc, getDoc } from '../../firebase'
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

export interface TemplateTrendProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  templateId: string
}

const TemplateTrend = ({
  className,
  templateId,
  ...props
}: TemplateTrendProps) => {
  const [trendData, setTrendData] = useState<any>([])
  const data: any = []
  
  useEffect(() => {
    const templateRef = doc(firestore, 'template-trend', templateId)
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

  return trendData.length > 0 ? (
    <div className={classNames(styles.templateTrend, className)} {...props}>
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
    </div>
  ) : null
}

export default TemplateTrend
