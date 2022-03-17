import React, { useState } from "react";
import styled from "styled-components";
import useDataEstados from "../customHooks/useDataEstados";
import bbox from "@turf/bbox";
import { obtenerTornadosPorEstadoId } from "../fetch";

const Contenedor = styled.div`
  padding: 0 2em 0;
  h1 {
    text-align: center;
  }
`;
const NumFeatures = styled.div`
  border-top: 1px solid white;
  margin: 20px auto;
  text-align: center;
  span {
    font-size: 3em;
  }
`;

const Control = ({ setTornadosPorEstado, onSetTornadosBounds }) => {
  const [numFeatures, setNumFeatures] = useState("N/A");
  const data = useDataEstados();

  const onSelectState = async (estadoId) => {
    try {
      let result = await obtenerTornadosPorEstadoId(estadoId);
      setTornadosPorEstado(result.content);
      setNumFeatures(result.rowCount);
      const bounds = bbox(result.content);
      const latLngBoundslike = [
        [bounds[0], bounds[1]],
        [bounds[2], bounds[3]],
      ];
      onSetTornadosBounds(latLngBoundslike);
    } catch (error) {}
  };

  return (
    <Contenedor>
      <h1>Actividad de Tornados 2012-2015</h1>
      <p>
        Recopilación de actividades de tornados efectuada por National Weather
        Service, Storm Prediction Center (SPC)
      </p>
      <p>
        <b>
          Haz clic en un estado en el mapa para resumir detalles o selecciona de
          la lista.
        </b>
      </p>
      <div>
        <label htmlFor="estado">Seleccionar un Estado</label>
        <select
          name="estado"
          id="estado"
          onChange={(evt) => onSelectState(evt.target.value)}
        >
          <option value="#">--</option>
          {data.content.map((estado) => {
            return (
              <option key={estado.id} value={estado.id}>
                {estado.name}
              </option>
            );
          })}
        </select>
      </div>
      <NumFeatures>
        <h3>Cantidad de Tornados Registrados</h3>
        <span>{numFeatures}</span>
      </NumFeatures>
    </Contenedor>
  );
};

export default Control;