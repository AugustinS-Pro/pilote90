export type UserRole = 'ADMIN' | 'CLIENT'

export type CycleWithWeeks = {
  id:              string
  cycleNumber:     number
  mainObjective:   string
  startDate:       Date
  endDate:         Date
  caTargetMonthly: number | null
  status:          string
  weeks: {
    id:          string
    weekNumber:  number
    focusTitle:  string | null
    startDate:   Date
  }[]
}

export type KpiData = {
  currentMonthRevenue:  number
  currentMonthExpenses: number
  lastMonthRevenue:     number
  trésorerie:           number
  caTarget:             number
  cycleProgressPct:     number
}