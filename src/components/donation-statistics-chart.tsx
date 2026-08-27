'use client'

import Plot from 'react-plotly.js'

type DonationTypeStat = {
  id: number
  name: string
  total: number
}

type DonationStatisticsChartProps = {
  data: DonationTypeStat[]
  type?: 'bar' | 'pie'
}

const chartColors = [
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#ef4444',
]

export function DonationStatisticsChart({ data, type = 'bar' }: DonationStatisticsChartProps) {
  if (type === 'pie') {
    const pieData: any[] = [
      {
        values: data.map(item => item.total),
        labels: data.map(item => item.name),
        type: 'pie',
        marker: {
          colors: data.map((_, i) => chartColors[i % chartColors.length]),
        },
        textinfo: 'label+percent',
        hole: 0.4,
      },
    ]

    const pieLayout = {
      autosize: true,
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      margin: { l: 20, r: 20, t: 20, b: 20 },
      showlegend: true,
      legend: { orientation: 'h', y: -0.2 },
    }

    const config = { responsive: true, displayModeBar: false }

    return (
      <div style={{ width: '100%', height: '400px' }}>
        <Plot data={pieData} layout={pieLayout} config={config} style={{ width: '100%', height: '100%' }} />
      </div>
    )
  }

  const barData: any[] = data.map((item, i) => ({
    x: [item.name],
    y: [item.total],
    type: 'bar',
    marker: { color: chartColors[i % chartColors.length] },
    name: item.name,
  }))

  const barLayout = {
    autosize: true,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    margin: { l: 60, r: 20, t: 20, b: 80 },
    xaxis: { title: 'Account' },
    yaxis: { title: 'Amount (KES)' },
    showlegend: false,
  }

  const barConfig = { responsive: true, displayModeBar: false }

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Plot data={barData} layout={barLayout} config={barConfig} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}
