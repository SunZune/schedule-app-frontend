import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export interface UploadResult {
  session_id: string
  sheets: string[]
  filename: string
}

export interface DailyRecord {
  col: number
  day: string
  shift: string
  rest_type: string | null  // '休息' | '周末休息' | '节假日休息' | null
  hours: number
  is_weekend: boolean
  is_holiday: boolean
  weekday: number | null    // 1=Mon..7=Sun
}

export interface SheetResult {
  sheet: string
  name: string
  actual_work: number
  should_work: number | null
  month_balance: number | null
  total_balance: number | null
  duty: number
  day_shift: number
  rest: number
  weekend_rest: number
  holiday_rest: number
  annual_leave: number
  mode: string
  daily: DailyRecord[]
  has_summary: boolean
}

export interface AllResult {
  name: string
  sheets: SheetResult[]
  grand_actual: number
}

export const uploadFile = async (file: File): Promise<UploadResult> => {
  const form = new FormData()
  form.append('file', file)
  const res = await api.post<UploadResult>('/upload', form)
  return res.data
}

export const calcAll = async (
  sessionId: string,
  name: string,
  holidaysBySheet: Record<string, string[]> = {},
): Promise<AllResult> => {
  const res = await api.post<AllResult>(
    `/calc-all?session_id=${sessionId}&name=${encodeURIComponent(name)}`,
    holidaysBySheet,
  )
  return res.data
}

export const getColorDownloadUrl = (
  sessionId: string,
  name: string,
) => `/api/color-download?session_id=${sessionId}&name=${encodeURIComponent(name)}`
