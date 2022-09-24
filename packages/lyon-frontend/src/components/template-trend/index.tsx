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
    const loadTrend = async () => {
      const templateRef = doc(firestore, 'template-metadata', templateId)
      const snapshot = await getDoc(templateRef)

      if (snapshot.exists()) {
        const fetchedData = snapshot.data()
        const trend = fetchedData.trend
        const trendKeys = Object.keys(trend).sort()
        trendKeys.forEach((key) => {
          data.push({ timeInterval: key, numAnswers: trend[key] })
        })
        console.log(data)
        setTrendData(data)
      }
    }

    loadTrend()
  }, [])
  

  return trendData.length > 0 ? (
    <div className={classNames(styles.templateTrend, className)} {...props}>
      <LineChart
        width={500}
        height={300}
        data={trendData}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <XAxis dataKey="timeInterval" />
        <YAxis />
        <Tooltip />
        <CartesianGrid stroke="#f5f5f5" />
        <Line type="monotone" dataKey="numAnswers" stroke="#ff7300" yAxisId={0} />
      </LineChart>
    </div>
  ) : null
}

export default TemplateTrend
