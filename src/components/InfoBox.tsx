import useCountryInfo from '../hooks/useCountryInfo'
import Loading from './Loading'
import {capitalizeFirstLetter} from '../utils/formatting'
import './InfoBox.scss'

interface IProps {
  countryCode?: string
}

function InfoBox(props: IProps) {
  const {countryCode} = props

  const {data, isLoading, error} = useCountryInfo(countryCode)

  const country = data && data.length > 0 ? data[0] : undefined

  return (
    <div className="panel">
      {isLoading &&(
        <Loading />
      )}

      {error && (
        <span className="error-message">Error: {error?.error?.message || "something went wrong"}</span>
      )}

      {country ? (
        <div>
          <div className="header">
            <span>{country.flag}</span>
            <span>{country.name.common}</span>
          </div>
          <div className="official-name">{country.name.official}</div>

          <div className="grid">
            <span className="label">Capital</span>
            <span className="value">{country.capital}</span>

            <span className="label">Region</span>
            <span className="value">{country.region}</span>

            <span className="label">Sub-region</span>
            <span className="value">{country.subregion}</span>

            <span className="label">Lat / Lon</span>
            <span className="value">
              {`(${country.latlng[0]}, ${country.latlng[1]})`}
            </span>

            <span className="label">Population</span>
            <span className="value">{country.population?.toLocaleString()}</span>

            <span className="label">Languages</span>
            <span className="value">
              {Object.keys(country.languages).map((key) => (
                <div key={key}>&bull; {country.languages[key]}</div>
              ))}
            </span>

            <span className="label">Currencies</span>
            <span className="value">
              {Object.keys(country.currencies).map((key) => {
                const {name, symbol} = country.currencies[key]
                
                return <div key={key}>{`${name} [${symbol}]`}</div>
              })}
            </span>

            <span className="label">Time Zones</span>
            <span className="value">
              {country.timezones?.map((t, index) => (
                <div key={`tz-${index}`}>&bull; {t}</div>
              ))}
            </span>

            <span className="label">Start Of The Week</span>
            <span className="value">{capitalizeFirstLetter(country.startOfWeek)}</span>
          </div>

          <div className="maps-button">
            <button onClick={() => window.open(country.maps.googleMaps, '_blank')}>
              View on Google Maps
            </button>
          </div>
        </div>
      ) : (
        <span className="error-message">No data</span>
      )}
    </div>
  )
}

export default InfoBox
