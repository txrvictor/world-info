import { useCallback, useLayoutEffect, useRef } from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5map from '@amcharts/amcharts5/map'
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'
import am5themes_Responsive from '@amcharts/amcharts5/themes/Responsive'
import './Map.css'

type CountryItem = am5map.MapPolygon

interface IDataCountryContext {
  id: string
  name: string
}

interface IProps {
  onCountrySelect: (countryCode: string) => void
}

const MAP_DIV_ID = "chartdiv"

function Map(props: IProps) {
  const {onCountrySelect} = props

  const selectedCountry = useRef<CountryItem>()

  const selectCountry = useCallback((activeItem: CountryItem) => {
    if (selectedCountry.current) {
      const previousId = selectedCountry.current.dataItem?.uid
      const targetId = activeItem?.dataItem?.uid

      if (previousId !== targetId) {
        selectedCountry.current.set("active", false)
      }

    }
    selectedCountry.current = activeItem

    // execute callback
    const countryCode = (activeItem?.dataItem?.dataContext as IDataCountryContext)?.id
    onCountrySelect(countryCode)
  }, [onCountrySelect])

  useLayoutEffect(() => {
    const root = am5.Root.new(MAP_DIV_ID)

    root.setThemes([
      am5themes_Animated.new(root),
      am5themes_Responsive.new(root)
    ])

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "rotateX",
        panY: "rotateY",
        projection: am5map.geoOrthographic(),
        paddingTop: 36,
        paddingBottom: 36,
        paddingLeft: 20,
        paddingRight: 20
      })
    )

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow
      })
    )
    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{name}",
      toggleKey: "active",
      interactive: true,
      fill: am5.Color.fromHex(0x6b8e23)
    })
    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.Color.fromHex(0xa0d462)
    })
    polygonSeries.mapPolygons.template.states.create("active", {
      fill: am5.Color.fromHex(0x8a2be2)
    })

    polygonSeries.mapPolygons.template.on("active", (active, target) => {
      if (target && active) {
        // rotate map to center selected country
        const centroid = target.geoCentroid()
        if (centroid) {
          chart.animate({ key: "rotationX", to: -centroid.longitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) })
          chart.animate({ key: "rotationY", to: -centroid.latitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) })
        }

        selectCountry(target)
      }
    })

    const backgroundSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {})
    )
    backgroundSeries.mapPolygons.template.setAll({
      fill: am5.Color.fromHex(0x0077be),
      fillOpacity: 0.2,
      strokeOpacity: 0
    })
    backgroundSeries.data.push({
      geometry: am5map.getGeoRectangle(90, 180, -90, -180)
    })

    const graticuleSeries = chart.series.unshift(
      am5map.GraticuleSeries.new(root, {
        step: 10
      })
    )
    graticuleSeries.mapLines.template.set("strokeOpacity", 0.5)
  
    return () => {
      root.dispose()
    }
  }, [selectCountry])

  return (
    <div
      id={MAP_DIV_ID}
      className="map"
    />
  )
}

export default Map
