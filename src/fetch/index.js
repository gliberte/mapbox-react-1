export const obtenerListEstados = async () => {
  const res = await fetch(
    `${process.env.REACT_APP_URL_API}/tornados/listEstados`
  );
  const data = res.json();
  return data;
};

export const obtenerTornadosPorEstadoId = async (estadoId) => {
  console.log(estadoId);
  const res = await fetch(
    `${process.env.REACT_APP_URL_API}/tornados/${estadoId}`
  );
  const data = res.json();
  return data;
};

export const obtenerTornadosPorDibujo = async (geom) => {
  const res = await fetch(`${process.env.REACT_APP_URL_API}/tornados/select`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(geom),
  });
  const data = await res.json();
  return data;
};
