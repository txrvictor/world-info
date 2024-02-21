import axios, {AxiosError} from 'axios'

const URL = 'https://restcountries.com/v3.1/'

const api = axios.create({
  baseURL: URL
})

export interface IRestCountriesError {
  data: unknown
  error: AxiosError
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
const fetcher = (url: string) => api.get(url).then((res) => res.data)

export default fetcher
