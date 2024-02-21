import useCountryInfo from '../hooks/useCountryInfo'

interface IProps {
  countryCode: string
}

function InfoBox(props: IProps) {
  const {countryCode} = props

  const {data, isLoading, error} = useCountryInfo(countryCode)

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      right: 0,
      backgroundColor: 'red',
      width: 300,
      fontSize: 18,
    }}>
      {isLoading &&(
         <div>Loading...</div>
      )}
      {error && (
        <div>Error: {error.error?.message}</div>
      )}
      {data && data.length > 0 ? JSON.stringify(data[0]) : ''}
    </div>
  )
}

export default InfoBox
