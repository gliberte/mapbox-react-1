import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import Control from "./componentes/control";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { obtenerTornadosPorDibujo } from "./fetch/index";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const MapContainer = styled.div`
  height: 100vh;
`;
const Contenedor = styled.div`
  position: relative;
  display: flex;
  flex-direction: column-reverse;
  width: 100%;
  height: 100vh;
  @media screen and (min-width: 700px) {
    & .seccion1 {
      position: absolute;
      background: rgba(0, 0, 0, 0.5);
      width: 400px;
      height: 600px;
      z-index: 1;
      left: 15%;
      top: 10%;
      color: white;
    }
  }
`;

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  const setTornadosPorEstado = (data) => {
    map.current.getSource("tornados").setData(data);
  };

  const onSetTornadosBounds = (latLngBoundslike) => {
    map.current.fitBounds(latLngBoundslike, {
      padding: { top: 10, bottom: 25, left: 15, right: 5 },
    });
  };

  const actualizarPopup = (map, popup, evt) => {
    map.current.getCanvas().style.cursor = "pointer";
    const infoTornado = evt.features[0]["properties"];
    const descripcionHtml = `
      <h2>${new Date(infoTornado.date).toLocaleDateString()}</h2>
      <div>
      <p>Magnitud: ${infoTornado.mag}</p> 

      </div>
      `;
    popup.setLngLat(evt.lngLat).setHTML(descripcionHtml).addTo(map.current);

    map.current.on("mouseleave", "torandos_estado_layer", () => {
      map.current.getCanvas().style.cursor = "";
      popup.remove();
    });
  };

  useEffect(() => {
    if (map.current) return; // se inicializa el mapa una sola vez
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
    //creamos una instancia del plug-in mapbox-gl-draw
    const Draw = new MapboxDraw({
      controls: {
        point: false,
        uncombine_features: false,
        combine_features: false,
      },
    });

    //agregamos los controles de dibujo al mapa
    map.current.addControl(Draw, "top-right");

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    map.current.on("move", (evt) => {
      const { lng, lat } = evt.target;
      setLat(lat);
      setLng(lng);
      setZoom(evt.target.getZoom());
    });

    map.current.on("load", () => {
      map.current.addSource("tornados", {
        type: "geojson",
        data: null,
      });

      //carga la fuente de datos desde nuestro api
      map.current.addSource("tornados-por-estado-source", {
        type: "geojson",
        data: `${process.env.REACT_APP_URL_API}/tornados/estados`,
      });
      //aplica simbología a la fuente de datos
      map.current.addLayer({
        id: "tornados-por-estado-layer",
        type: "fill",
        source: "tornados-por-estado-source",
        paint: {
          "fill-color": [
            "step",
            ["get", "numtornados"],
            "#ff8a80",
            10,
            "#ff5252",
            100,
            "#ff1744",
            250,
            "#d50000",
            500,
            "#DD2C00",
          ],
          "fill-opacity": 0.5,
        },
      });
      map.current.addLayer(
        {
          id: "torandos_estado_layer",
          type: "line",
          source: "tornados",
          paint: {
            "line-color": "#263238",
            "line-dasharray": [10, 2],
            "line-width": [
              "step",
              ["get", "mag"],
              0,
              2,
              1,
              4,
              2,
              8,
              3,
              16,
              4,
              32,
              5,
            ],
          },
        },
        "tornados-por-estado-layer"
      );
      map.current.on("mouseenter", "torandos_estado_layer", (evt) => {
        console.log(evt);
        actualizarPopup(map, popup, evt);
      });
      //evento que captura nuevos dibujos
      map.current.on("draw.create", async (evt) => {
        let geom = evt.features[0]["geometry"];
        const result = await obtenerTornadosPorDibujo(geom);
        map.current.getSource("tornados").setData(result.content);
      });
    });
  });

  return (
    <Contenedor>
      <div className="seccion1">
        <Control
          setTornadosPorEstado={setTornadosPorEstado}
          onSetTornadosBounds={onSetTornadosBounds}
        ></Control>
      </div>
      <div>
        <MapContainer ref={mapContainer}></MapContainer>
      </div>
    </Contenedor>
  );
}

export default App;
