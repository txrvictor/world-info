import { useLayoutEffect } from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5map from '@amcharts/amcharts5/map'
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'
import './Map.css'

const MAP_DIV_ID = "chartdiv"

function Map() {
  useLayoutEffect(() => {
    const root = am5.Root.new(MAP_DIV_ID)

    root.setThemes([
      am5themes_Animated.new(root)
      // TODO test other themes
    ])

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "rotateX",
        panY: "rotateY",
        projection: am5map.geoOrthographic(),
        paddingBottom: 20,
        paddingTop: 20,
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
      interactive: true
    })

    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: root.interfaceColors.get("primaryButtonHover")
    })
    
    polygonSeries.mapPolygons.template.states.create("active", {
      fill: root.interfaceColors.get("primaryButtonHover")
    })

    const backgroundSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {})
    )
    backgroundSeries.mapPolygons.template.setAll({
      fill: root.interfaceColors.get("alternativeBackground"),
      fillOpacity: 0.1,
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
    
    graticuleSeries.mapLines.template.set("strokeOpacity", 0.1)
  
    return () => {
      root.dispose()
    }
  }, [])

  return (
    <div
      id={MAP_DIV_ID}
      className="map"
    />
  )
}

export default Map
