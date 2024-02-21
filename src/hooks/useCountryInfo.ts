
import useSWR from 'swr'
import countryFetcher, {IRestCountriesError} from '../api/restcountries'

interface ICountryInfo {
  name: {
    common: string,
    official: string,
    nativeName: {
      [key: string]: {official: string, common: string}
    }
  },
  currencies: {
    [key: string]: {name: string, symbol: string}
  },
  capital: Array<string>,
  region: string,
  subregion: string,
  languages: {
    [key: string]: string
  },
  latlng: Array<number>,
  flag: string,
  maps: {
    googleMaps: string,
    openStreetMaps: string
  },
  population: number,
  timezones: Array<string>,
  flags: {
    png: string,
    svg: string,
    alt: string
  },
  startOfWeek: string,
}

function useCountryInfo (countryCode: string) {
  const {data, error, isLoading} = useSWR<Array<ICountryInfo>, IRestCountriesError>(
    `/alpha/${countryCode}`,
    countryFetcher
  )

  return {data, isLoading, error}
}

export default useCountryInfo
