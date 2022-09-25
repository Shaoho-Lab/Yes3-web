import classNames from 'classnames'
import { doc, firestore, getDoc } from 'common/firebase'
import { useEffect, useState } from 'react'
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import styles from './index.module.scss'

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

  useEffect(() => {
    const loadTrend = async () => {
      const templateRef = doc(firestore, 'template-metadata', templateId)
      const snapshot = await getDoc(templateRef)

      if (snapshot.exists()) {
        const fetchedData = snapshot.data()
        const trend = fetchedData.trend
        const trendKeys = Object.keys(trend).sort()
        const data: any = []

        trendKeys.forEach(key => {
          data.push({ timeInterval: key, numAnswers: trend[key] })
        })

        setTrendData(data)
      }
    }

    loadTrend()
  }, [templateId])

  return trendData.length > 0 ? (
    <div className={classNames(styles.templateTrend, className)} {...props}>
      <LineChart
        width={1000}
        height={300}
        data={trendData}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <XAxis dataKey="timeInterval" />
        <YAxis allowDecimals={false}/>
        <Tooltip />
        <CartesianGrid stroke="#f5f5f5" />
        <Line
          type="monotone"
          dataKey="numAnswers"
          stroke="#FC466B"
          yAxisId={0}
        />
      </LineChart>
    </div>
  ) : null
}

export default TemplateTrend
