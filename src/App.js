import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import cases_country from "./datos/cases_country";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const MapContainer = styled.div`
  height: 100vh;
`;

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // se inicializa el mapa una sola vez
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on("load", () => {
      map.current.addSource("covid-cases-source", {
        type: "geojson",
        data: cases_country,
      });
      map.current.addLayer({
        id: "covid-cases-layer",
        type: "circle",
        source: "covid-cases-source",
        paint: {
          "circle-color": "red",
          "circle-radius": [
            "step",
            ["get", "Confirmed"],
            3,100,
            5,500,
            7,1000,
            9,10000,
            12,50000,
            15,80000,
            20,
          ],
        },
      });
      map.current.addLayer({
        id:'covid-cases-layer_text',
        type:'symbol',
        source:'covid-cases-source',
        layout:{
          "text-field":'{Confirmed}',
          "text-offset":[1,-1]
        }
      })
    });
  });

  return (
    <div>
      <MapContainer ref={mapContainer} />
    </div>
  );
}

export default App;
