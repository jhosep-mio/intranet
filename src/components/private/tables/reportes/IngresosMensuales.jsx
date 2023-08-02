import React, { Fragment, useEffect, useState } from "react";
import { Global } from "../../../../helper/Global";
import axios from "axios";
import Table from "react-bootstrap/Table";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { RiFileExcel2Fill } from "react-icons/ri";
import Swal from "sweetalert2";
import { Paginacion } from "../../shared/Paginacion";

export const IngresosMensuales = () => {
  let token = localStorage.getItem("token");
  const [clinicas, setClinicas] = useState([]);
  const [servicios, setservicios] = useState([]);
  const [itemPagination, setItemPagination] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [paginaActual, setpaginaActual] = useState(1);
  const [cantidadRegistros] = useState(4);
  const [cargandoBusqueda, setCargandoBusqueda] = useState(0);
  const [facturas, setFacturas] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  useEffect(() => {
    const filter2 = clinicas.filter((cate) =>
      quitarAcentos(cate.consulta.toLowerCase()).includes(
        quitarAcentos(search.toLowerCase())
      )
    );
    setCargandoBusqueda(filter2.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    getAllClinicas();
    getAllservicios();
    getFacturas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllClinicas = async () => {
    setLoading(true);

    const request = await axios.get(`${Global.url}/reproteIngresosMes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setClinicas(request.data);
    setCargandoBusqueda(request.data.length);
  };

  const getAllservicios = async () => {
    const request = await axios.get(`${Global.url}/allServicios`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setservicios(request.data);
  };

  const getFacturas = async () => {
    const request = await axios.get(`${Global.url}/allFacturas`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setFacturas(request.data);
    setLoading(false);
  };

  const indexOfLastPost = paginaActual * cantidadRegistros;
  const indexOfFirstPost = indexOfLastPost - cantidadRegistros;
  let totalPosts = clinicas.length;

  function quitarAcentos(cadena) {
    const acentos = {
      á: "a",
      é: "e",
      í: "i",
      ó: "o",
      ú: "u",
      Á: "A",
      É: "E",
      Í: "I",
      Ó: "O",
      Ú: "U",
    };
    return cadena
      .split("")
      .map((letra) => acentos[letra] || letra)
      .join("")
      .toString();
  }

  const filterDate = () => {
    if (search.length == 0) {
      let clinica = clinicas.slice(indexOfFirstPost, indexOfLastPost);
      return clinica;
    }

    const filter = clinicas.filter((cate) =>
      quitarAcentos(cate.nombre.toLowerCase()).includes(
        quitarAcentos(search.toLowerCase())
      )
    );
    totalPosts = filter.length;
    return filter.slice(indexOfFirstPost, indexOfLastPost);
  };

  const onSeachChange = ({ target }) => {
    setpaginaActual(1);
    setSearch(target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (fechaInicio && fechaFin) {
      setLoading(true);

      const data = new FormData();
      data.append("fechaInicio", fechaInicio);
      data.append("fechaFin", fechaFin);

      try {
        const oneOrden = await axios.post(
          `${Global.url}/reporteOrdenes`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setpaginaActual(1);
        setCargandoBusqueda(oneOrden.data.length);
        setClinicas(oneOrden.data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    } else if (fechaInicio || fechaFin) {
      Swal.fire("Debe colocar ambas fechas", "", "warning");
    } else {
      setLoading(true);
      const request = await axios.get(`${Global.url}/reporteIngresos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setpaginaActual(1);
      setClinicas(request.data);
      setCargandoBusqueda(request.data.length);
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDate().toString().padStart(2, "0");
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, "0");
    const anio = fechaObj.getFullYear();
    return `${dia}-${mes}-${anio}`;
  };

  return (
    <div className="container mt-6 ms-5-auto">
      <div className="row justify-content-center">
        {/* TAMAÑO DE LA TABLA WIDTH  */}
        <div className="col-md-11">
          {/* <!--=== TABLA PRODUCTOS ===--> */}
          <div className="card">
            <div
              className="card-header text-center fs-5 fw-bolder"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className="content_excel">
                <RiFileExcel2Fill />
                <ReactHTMLTableToExcel
                  id="table-xls-button"
                  className="download"
                  table="productos2"
                  filename="Reporte_ingreso_mensual"
                  sheet="sheet1"
                  buttonText="Excel"
                />
              </div>
              Reporte de ingresos mensuales
              <div id="productos_filter" className="fechas_ll">
                <div>
                  <label htmlFor="fechaInicio">Fecha de inicio:</label>
                  <input
                    type="date"
                    id="fechaInicio"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="fechaFin">Fecha de fin:</label>
                  <input
                    type="date"
                    id="fechaFin"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                  />
                </div>
                <button type="button" onClick={handleSubmit}>
                  Buscar
                </button>
              </div>
            </div>
            <div className="p-4 table-responsive">
              <Table
                id="productos"
                className="table align-middle table-hover display"
                style={{ width: "300vw", marginTop: "30px" }}
              >
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="text-center"></th>
                    <th scope="col" className="text-center"></th>
                    <th scope="col" className="text-center"></th>
                    <th scope="col" className="text-center"></th>
                    <th scope="col" className="text-center"></th>
                    <th scope="" className="text-center"></th>
                    <th scope="col" className="text-center"></th>
                    <th scope="col" className="text-center"></th>
                    <th
                      scope="col"
                      className="text-center"
                      colSpan={4}
                      style={{ background: "#4472C4", color: "white" }}
                    >
                      Insumo - Especialistas
                    </th>
                    <th
                      scope="col"
                      className="text-center"
                      colSpan={6}
                      style={{ background: "#ED7D31", color: "white" }}
                    >
                      Insumo - Material físico
                    </th>
                    <th
                      scope="col"
                      className="text-center"
                      colSpan={2}
                      style={{ background: "#A5A5A5", color: "white" }}
                    >
                      Insumo especial
                    </th>

                    <th scope="col" className="text-center"></th>
                    <th scope="col" className="text-center"></th>
                    <th scope="col" className="text-center"></th>
                    <th scope="col" className="text-center"></th>
                    <th scope="col" className="text-center"></th>
                  </tr>
                  <tr>
                    <th scope="col" className="text-center">
                      ID
                    </th>

                    <th scope="col" className="text-center" colSpan={2}>
                      Servicios Realizados
                    </th>

                    <th scope="col" className="text-center" colSpan={2}>
                      Examenes realizados
                    </th>

                    <th scope="col" className="text-center">
                      Tipo
                    </th>

                    <th scope="" className="text-center">
                      Costo publico
                    </th>

                    <th scope="col" className="text-center">
                      IGV
                    </th>

                    <th
                      scope="col"
                      className="text-center"
                      style={{ background: "#C0D0EB", color: "black" }}
                    >
                      Insumo1
                    </th>

                    <th
                      scope="col"
                      className="text-center"
                      style={{ background: "#C0D0EB", color: "black" }}
                    >
                      Insumo2
                    </th>

                    <th
                      scope="col"
                      className="text-center"
                      style={{ background: "#C0D0EB", color: "black" }}
                    >
                      Insumo3
                    </th>

                    <th
                      scope="col"
                      className="text-center"
                      style={{ background: "#C0D0EB", color: "black" }}
                    >
                      Insumo4
                    </th>

                    <th
                      scope="col"
                      className="text-center"
                      style={{ background: "#F9D3BA", color: "black" }}
                    >
                      Insumo1
                    </th>

                    <th
                      scope="col"
                      className="text-center"
                      style={{ background: "#F9D3BA", color: "black" }}
                    >
                      Insumo2
                    </th>

                    <th
                      scope="col"
                      className="text-center"
                      style={{ background: "#F9D3BA", color: "black" }}
                    >
                      Insumo3
                    </th>

                    <th
                      scope="col"
                      className="text-center"
                      style={{ background: "#F9D3BA", color: "black" }}
                    >
                      Insumo4
                    </th>

                    <th
                      scope="col"
                      className="text-center"
                      style={{ background: "#F9D3BA", color: "black" }}
                    >
                      Insumo5
                    </th>

                    <th
                      scope="col"
                      className="text-center"
                      style={{ background: "#F9D3BA", color: "black" }}
                    >
                      Insumo6
                    </th>

                    <th
                      scope="col"
                      className="text-center"
                      style={{ background: "#E1E1E1", color: "black" }}
                    >
                      Insumo Carpeta
                    </th>

                    <th
                      scope="col"
                      className="text-center"
                      style={{ background: "#E1E1E1", color: "black" }}
                    >
                      Insumo USB
                    </th>

                    <th scope="col" className="text-center">
                      Comision Digital
                    </th>

                    <th scope="col" className="text-center">
                      Comision Impreso
                    </th>

                    <th scope="col" className="text-center">
                      TOTAL COSTOS VARIABLES
                    </th>

                    <th scope="col" className="text-center">
                      UTILIDAD POR EXAMEN
                    </th>

                    <th scope="col" className="text-center">
                      UTILIDAD TOTAL
                    </th>

                    <th scope="col" className="text-center">
                      DOC. ELECTRONICO
                    </th>

                    <th scope="col" className="text-center">
                      FECHA
                    </th>
                  </tr>
                </thead>
                <tbody id="tableBody">
                  {loading == false ? (
                    filterDate().map((clinica) => {
                      return (
                        <tr key={clinica.id}>
                          <td
                            className="text-truncate trucate_text"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            #Orden {clinica.id}
                          </td>

                          <td
                            className="text-left"
                            style={{
                              width: "",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                            colSpan={2}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {servicios.map((serv, indexserv) =>
                                JSON.parse(clinica.impresionServicios).map(
                                  (elementos, indexElementos) =>
                                    elementos.estado == true &&
                                    serv.id == elementos.id_servicio ? (
                                      <li key={indexserv}>{serv.nombre}</li>
                                    ) : (
                                      ""
                                    )
                                )
                              )}
                            </ul>
                          </td>

                          <td
                            className="text-left"
                            style={{
                              width: "",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                            colSpan={2}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems).map(
                                (elementos, indexElementos) =>
                                  elementos.estado == true && (
                                    <li key={indexElementos}>
                                      {elementos.nombre}
                                    </li>
                                  )
                              )}
                            </ul>
                          </td>

                          <td className="text-left">
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems).map(
                                (elementos, indexElementos) =>
                                  elementos.estado == true &&
                                  JSON.parse(clinica.listaServicios).map(
                                    (lista, indexLista) =>
                                      lista.id == elementos.id_servicio && (
                                        <li key={indexLista}>
                                          {lista.estado == true
                                            ? "Impreso"
                                            : "Digital"}
                                        </li>
                                      )
                                  )
                              )}
                            </ul>
                          </td>

                          <td
                            className="text-left"
                            style={{
                              width: "",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems)
                                .filter((elementos) => elementos.estado == true)
                                .map((elementos, indexElementos) => {
                                  return (
                                    <li key={indexElementos}>
                                      <span> {elementos.precio}</span>
                                    </li>
                                  );
                                })}
                            </ul>
                          </td>

                          <td
                            className="text-left"
                            style={{
                              width: "",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems)
                                .filter((elementos) => elementos.estado == true)
                                .map((elementos, indexElementos) => {
                                  return (
                                    <li key={indexElementos}>
                                      <span>
                                        {" "}
                                        {(elementos.precio * 0.18).toFixed(2)}
                                      </span>
                                    </li>
                                  );
                                })}
                            </ul>
                          </td>

                          <td
                            className="text-left"
                            style={{
                              background: "#C0D0EB",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems)
                                .filter((elementos) => elementos.estado == true)
                                .map((elementos, indexElementos) => {
                                  return (
                                    <li key={indexElementos}>
                                      <span>
                                        {" "}
                                        {elementos.insumos1 > 0
                                          ? elementos.insumos1
                                          : "-"}
                                      </span>
                                    </li>
                                  );
                                })}
                            </ul>
                          </td>

                          <td
                            className="text-left"
                            style={{
                              background: "#C0D0EB",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems)
                                .filter((elementos) => elementos.estado == true)
                                .map((elementos, indexElementos) => {
                                  return (
                                    <li key={indexElementos}>
                                      <span>
                                        {" "}
                                        {elementos.insumos2 > 0
                                          ? elementos.insumos2
                                          : "-"}
                                      </span>
                                    </li>
                                  );
                                })}
                            </ul>
                          </td>

                          <td
                            className="text-left"
                            style={{
                              background: "#C0D0EB",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems)
                                .filter((elementos) => elementos.estado == true)
                                .map((elementos, indexElementos) => {
                                  return (
                                    <li key={indexElementos}>
                                      <span>
                                        {" "}
                                        {elementos.insumos3 > 0
                                          ? elementos.insumos3
                                          : "-"}
                                      </span>
                                    </li>
                                  );
                                })}
                            </ul>
                          </td>

                          <td
                            className="text-left"
                            style={{
                              background: "#C0D0EB",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems)
                                .filter((elementos) => elementos.estado == true)
                                .map((elementos, indexElementos) => {
                                  return (
                                    <li key={indexElementos}>
                                      <span>
                                        {" "}
                                        {elementos.insumos4 > 0
                                          ? elementos.insumos4
                                          : "-"}
                                      </span>
                                    </li>
                                  );
                                })}
                            </ul>
                          </td>

                          <td
                            className="text-left"
                            style={{
                              background: "#F9D3BA",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems).map(
                                (elementos, indexElementos) =>
                                  elementos.estado == true &&
                                  JSON.parse(clinica.listaServicios).map(
                                    (lista, indexLista) =>
                                      lista.id == elementos.id_servicio &&
                                      lista.estado == true ? (
                                        <li key={indexLista}>
                                          {elementos.insumosM1 > 0
                                            ? elementos.insumosM1
                                            : "-"}
                                        </li>
                                      ) : (
                                        lista.id == elementos.id_servicio &&
                                        lista.estado == false && (
                                          <li key={indexLista}>-</li>
                                        )
                                      )
                                  )
                              )}
                            </ul>
                          </td>

                          <td
                            className="text-left"
                            style={{
                              background: "#F9D3BA",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems).map(
                                (elementos, indexElementos) =>
                                  elementos.estado == true &&
                                  JSON.parse(clinica.listaServicios).map(
                                    (lista, indexLista) =>
                                      lista.id == elementos.id_servicio &&
                                      lista.estado == true ? (
                                        <li key={indexLista}>
                                          {elementos.insumosM2 > 0
                                            ? elementos.insumosM2
                                            : "-"}
                                        </li>
                                      ) : (
                                        lista.id == elementos.id_servicio &&
                                        lista.estado == false && (
                                          <li key={indexLista}>-</li>
                                        )
                                      )
                                  )
                              )}
                            </ul>
                          </td>

                          <td
                            className="text-left"
                            style={{
                              background: "#F9D3BA",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems).map(
                                (elementos, indexElementos) =>
                                  elementos.estado == true &&
                                  JSON.parse(clinica.listaServicios).map(
                                    (lista, indexLista) =>
                                      lista.id == elementos.id_servicio &&
                                      lista.estado == true ? (
                                        <li key={indexLista}>
                                          {elementos.insumosM3 > 0
                                            ? elementos.insumosM3
                                            : "-"}
                                        </li>
                                      ) : (
                                        lista.id == elementos.id_servicio &&
                                        lista.estado == false && (
                                          <li key={indexLista}>-</li>
                                        )
                                      )
                                  )
                              )}
                            </ul>
                          </td>

                          <td
                            className="text-left"
                            style={{
                              background: "#F9D3BA",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems).map(
                                (elementos, indexElementos) =>
                                  elementos.estado == true &&
                                  JSON.parse(clinica.listaServicios).map(
                                    (lista, indexLista) =>
                                      lista.id == elementos.id_servicio &&
                                      lista.estado == true ? (
                                        <li key={indexLista}>
                                          {elementos.insumosM4 > 0
                                            ? elementos.insumosM4
                                            : "-"}
                                        </li>
                                      ) : (
                                        lista.id == elementos.id_servicio &&
                                        lista.estado == false && (
                                          <li key={indexLista}>-</li>
                                        )
                                      )
                                  )
                              )}
                            </ul>
                          </td>

                          <td
                            className="text-left"
                            style={{
                              background: "#F9D3BA",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems).map(
                                (elementos, indexElementos) =>
                                  elementos.estado == true &&
                                  JSON.parse(clinica.listaServicios).map(
                                    (lista, indexLista) =>
                                      lista.id == elementos.id_servicio &&
                                      lista.estado == true ? (
                                        <li key={indexLista}>
                                          {elementos.insumosM5 > 0
                                            ? elementos.insumosM5
                                            : "-"}
                                        </li>
                                      ) : (
                                        lista.id == elementos.id_servicio &&
                                        lista.estado == false && (
                                          <li key={indexLista}>-</li>
                                        )
                                      )
                                  )
                              )}
                            </ul>
                          </td>

                          <td
                            className="text-left"
                            style={{
                              background: "#F9D3BA",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems).map(
                                (elementos, indexElementos) =>
                                  elementos.estado == true &&
                                  JSON.parse(clinica.listaServicios).map(
                                    (lista, indexLista) =>
                                      lista.id == elementos.id_servicio &&
                                      lista.estado == true ? (
                                        <li key={indexLista}>
                                          {elementos.insumosM6 > 0
                                            ? elementos.insumosM6
                                            : "-"}
                                        </li>
                                      ) : (
                                        lista.id == elementos.id_servicio &&
                                        lista.estado == false && (
                                          <li key={indexLista}>-</li>
                                        )
                                      )
                                  )
                              )}
                            </ul>
                          </td>

                          <td
                            className="text-center"
                            style={{
                              background: "#E1E1E1",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            {(() => {
                              const listaItems = JSON.parse(clinica.listaItems);
                              const listaServicios = JSON.parse(
                                clinica.listaServicios
                              );
                              const resultados = [];

                              for (let i = 0; i < listaItems.length; i++) {
                                const elementos = listaItems[i];

                                if (elementos.estado == true) {
                                  const servicioEncontrado =
                                    listaServicios.find(
                                      (lista) =>
                                        lista.id == elementos.id_servicio &&
                                        lista.estado == true
                                    );
                                  if (servicioEncontrado) {
                                    resultados.push(
                                      listaItems[0].insumoCarpeta
                                    );
                                    break; // Detener el bucle después de encontrar el primer resultado
                                  }
                                }
                              }
                              return (
                                <ul
                                  className="reportes_clinicas"
                                  style={{ listStyle: "none" }}
                                >
                                  {JSON.parse(clinica.listaItems)
                                    .filter(
                                      (elementos) => elementos.estado == true
                                    )
                                    .map(
                                      (elementos, indexElementos) =>
                                        indexElementos < 1 && (
                                          <li key={indexElementos}>
                                            {resultados}
                                          </li>
                                        )
                                    )}
                                </ul>
                              );
                            })()}
                          </td>

                          <td
                            className="text-left"
                            style={{
                              background: "#E1E1E1",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaServicios).map(
                                (lista, indexLista) => {
                                  const elementosFiltrados = JSON.parse(
                                    clinica.listaItems
                                  ).filter(
                                    (elementos) =>
                                      elementos.estado &&
                                      elementos.id_servicio == lista.id
                                  );
                                  if (elementosFiltrados.length > 0) {
                                    const elemento = elementosFiltrados[0];
                                    return (
                                      <li key={indexLista}>
                                        {elemento.insumoUSB > 0
                                          ? elemento.insumoUSB
                                          : null}
                                      </li>
                                    );
                                  }
                                  return null;
                                }
                              )}
                            </ul>
                          </td>

                          <td
                            className="text-left"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems).map(
                                (elementos, indexElementos) =>
                                  elementos.estado == true &&
                                  JSON.parse(clinica.listaServicios)
                                    .filter(
                                      (lista) =>
                                        lista.id == elementos.id_servicio
                                    )
                                    .map((lista, indexLista) => {
                                      let comision = "";
                                      if (lista.estado == true) {
                                        comision = "-";
                                      } else {
                                        comision = elementos.comision_digital;
                                      }
                                      return (
                                        <li key={indexLista}>{comision}</li>
                                      );
                                      // lista.id == elementos.id_servicio && lista.estado == true ?
                                      //     <li key={indexLista}>{elementos.comision_digital > 0 ? elementos.comision_digital : "-"}</li>
                                      // :lista.id == elementos.id_servicio && lista.estado == false &&
                                      // <li key={indexLista}>-</li>
                                    })
                              )}
                            </ul>
                          </td>

                          <td
                            className="text-left"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems).map(
                                (elementos, indexElementos) =>
                                  elementos.estado == true &&
                                  JSON.parse(clinica.listaServicios)
                                    .filter(
                                      (lista) =>
                                        lista.id == elementos.id_servicio
                                    )
                                    .map((lista, indexLista) => {
                                      let comision = "";
                                      if (lista.estado == true) {
                                        comision = elementos.comision_impreso;
                                      } else {
                                        comision = "-";
                                      }
                                      return (
                                        <li key={indexLista}>{comision}</li>
                                      );
                                      // lista.id == elementos.id_servicio && lista.estado == true ?
                                      //     <li key={indexLista}>{elementos.comision_digital > 0 ? elementos.comision_digital : "-"}</li>
                                      // :lista.id == elementos.id_servicio && lista.estado == false &&
                                      // <li key={indexLista}>-</li>
                                    })
                              )}
                            </ul>
                          </td>

                          {/* TOTALES */}
                          <td
                            className="text-left"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems)
                                .filter((elementos) => elementos.estado == true)
                                .map((elementos, indexElementos) => {
                                  const igv = (elementos.precio * 0.18).toFixed(
                                    2
                                  );
                                  const precio = elementos.precio;
                                  const insumos1 = elementos.insumos1;
                                  const insumos2 = elementos.insumos2;
                                  const insumos3 = elementos.insumos3;
                                  const insumos4 = elementos.insumos4;
                                  let insumosM1 = 0;
                                  let insumosM2 = 0;
                                  let insumosM3 = 0;
                                  let insumosM4 = 0;
                                  let insumosM5 = 0;
                                  let insumosM6 = 0;
                                  let insumoUSB = 0;
                                  let insumoCarpeta = 0;
                                  let comision_digital = 0;
                                  let comision_impreso = 0;
                                  JSON.parse(clinica.listaServicios).map(
                                    (lista, indexLista) => {
                                      if (lista.id == elementos.id_servicio) {
                                        if (
                                          precio == elementos.precio_digital
                                        ) {
                                          insumosM1 = elementos.insumosM1;
                                          insumosM2 = elementos.insumosM2;
                                          insumosM3 = elementos.insumosM3;
                                          insumosM4 = elementos.insumosM4;
                                          insumosM5 = elementos.insumosM5;
                                          insumosM6 = elementos.insumosM6;
                                          comision_digital =
                                            elementos.comision_digital;
                                        } else if (
                                          precio == elementos.precio_impresion
                                        ) {
                                          comision_impreso =
                                            elementos.comision_impreso;
                                        }
                                      }
                                      // if(lista.id == elementos.id_servicio && lista.id == 1){
                                      //     insumoUSB = elementos.insumoUSB;
                                      // }
                                    }
                                  );

                                  const total = (
                                    parseFloat(igv > 0 ? igv : 0) +
                                    parseFloat(insumos1 > 0 ? insumos1 : 0) +
                                    parseFloat(insumos2 > 0 ? insumos2 : 0) +
                                    parseFloat(insumos3 > 0 ? insumos3 : 0) +
                                    parseFloat(insumos4 > 0 ? insumos4 : 0) +
                                    parseFloat(insumosM1 > 0 ? insumosM1 : 0) +
                                    parseFloat(insumosM2 > 0 ? insumosM2 : 0) +
                                    parseFloat(insumosM3 > 0 ? insumosM3 : 0) +
                                    parseFloat(insumosM4 > 0 ? insumosM4 : 0) +
                                    parseFloat(insumosM5 > 0 ? insumosM5 : 0) +
                                    parseFloat(insumosM6 > 0 ? insumosM6 : 0) +
                                    parseFloat(insumoUSB > 0 ? insumoUSB : 0) +
                                    parseFloat(
                                      insumoCarpeta > 0 ? insumoCarpeta : 0
                                    ) +
                                    parseFloat(
                                      comision_digital > 0
                                        ? comision_digital
                                        : 0
                                    ) +
                                    parseFloat(
                                      comision_impreso > 0
                                        ? comision_impreso
                                        : 0
                                    )
                                  ).toFixed(2);
                                  return (
                                    <li key={indexElementos}>
                                      <span> {total}</span>
                                    </li>
                                  );
                                })}
                            </ul>
                          </td>

                          <td
                            className="text+ left"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems)
                                .filter((elementos) => elementos.estado == true)
                                .map((elementos, indexElementos) => {
                                  const igv = (elementos.precio * 0.18).toFixed(
                                    2
                                  );
                                  const precio = elementos.precio;
                                  const insumos1 = elementos.insumos1;
                                  const insumos2 = elementos.insumos2;
                                  const insumos3 = elementos.insumos3;
                                  const insumos4 = elementos.insumos4;
                                  let insumosM1 = 0;
                                  let insumosM2 = 0;
                                  let insumosM3 = 0;
                                  let insumosM4 = 0;
                                  let insumosM5 = 0;
                                  let insumosM6 = 0;
                                  let insumoUSB = 0;
                                  let insumoCarpeta = 0;
                                  let comision_digital = 0;
                                  let comision_impreso = 0;

                                  JSON.parse(clinica.listaServicios).map(
                                    (lista, indexLista) => {
                                      if (lista.id == elementos.id_servicio) {
                                        if (
                                          precio == elementos.precio_digital
                                        ) {
                                          insumosM1 = elementos.insumosM1;
                                          insumosM2 = elementos.insumosM2;
                                          insumosM3 = elementos.insumosM3;
                                          insumosM4 = elementos.insumosM4;
                                          insumosM5 = elementos.insumosM5;
                                          insumosM6 = elementos.insumosM6;
                                          comision_digital =
                                            elementos.comision_digital;
                                        } else if (
                                          precio == elementos.precio_impresion
                                        ) {
                                          comision_impreso =
                                            elementos.comision_impreso;
                                        }
                                      }
                                      // if(lista.id == elementos.id_servicio && lista.id == 1){
                                      //     insumoUSB = elementos.insumoUSB;
                                      // }
                                    }
                                  );

                                  const total =
                                    precio -
                                    (
                                      parseFloat(igv > 0 ? igv : 0) +
                                      parseFloat(insumos1 > 0 ? insumos1 : 0) +
                                      parseFloat(insumos2 > 0 ? insumos2 : 0) +
                                      parseFloat(insumos3 > 0 ? insumos3 : 0) +
                                      parseFloat(insumos4 > 0 ? insumos4 : 0) +
                                      parseFloat(
                                        insumosM1 > 0 ? insumosM1 : 0
                                      ) +
                                      parseFloat(
                                        insumosM2 > 0 ? insumosM2 : 0
                                      ) +
                                      parseFloat(
                                        insumosM3 > 0 ? insumosM3 : 0
                                      ) +
                                      parseFloat(
                                        insumosM4 > 0 ? insumosM4 : 0
                                      ) +
                                      parseFloat(
                                        insumosM5 > 0 ? insumosM5 : 0
                                      ) +
                                      parseFloat(
                                        insumosM6 > 0 ? insumosM6 : 0
                                      ) +
                                      parseFloat(
                                        insumoUSB > 0 ? insumoUSB : 0
                                      ) +
                                      parseFloat(
                                        insumoCarpeta > 0 ? insumoCarpeta : 0
                                      ) +
                                      parseFloat(
                                        comision_digital > 0
                                          ? comision_digital
                                          : 0
                                      ) +
                                      parseFloat(
                                        comision_impreso > 0
                                          ? comision_impreso
                                          : 0
                                      )
                                    ).toFixed(2);

                                  return (
                                    <li key={indexElementos}>
                                      <span> {total.toFixed(2)}</span>
                                    </li>
                                  );
                                })}
                            </ul>
                          </td>

                          <td
                            className="text_center"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            {(() => {
                              let total_final = 0;
                              const listaItems = JSON.parse(clinica.listaItems);
                              let insumoCarpetaFINAL =
                                listaItems[0].insumoCarpeta;
                              let insumoCarpeta = 0;
                              let insumoUSB = 0;
                              JSON.parse(clinica.listaItems)
                                .filter((elementos) => elementos.estado == true)
                                .forEach((elementos, indexElementos) => {
                                  const igv = (elementos.precio * 0.18).toFixed(
                                    2
                                  );
                                  const precio = elementos.precio;
                                  const insumos1 = elementos.insumos1;
                                  const insumos2 = elementos.insumos2;
                                  const insumos3 = elementos.insumos3;
                                  const insumos4 = elementos.insumos4;
                                  let insumosM1 = 0;
                                  let insumosM2 = 0;
                                  let insumosM3 = 0;
                                  let insumosM4 = 0;
                                  let insumosM5 = 0;
                                  let insumosM6 = 0;
                                  let comision_digital = 0;
                                  let comision_impreso = 0;

                                  JSON.parse(clinica.listaServicios).map(
                                    (lista, indexLista) => {
                                      if (lista.id == elementos.id_servicio) {
                                        if (
                                          precio == elementos.precio_digital
                                        ) {
                                          insumosM1 = elementos.insumosM1;
                                          insumosM2 = elementos.insumosM2;
                                          insumosM3 = elementos.insumosM3;
                                          insumosM4 = elementos.insumosM4;
                                          insumosM5 = elementos.insumosM5;
                                          insumosM6 = elementos.insumosM6;
                                          comision_digital =
                                            elementos.comision_digital;
                                        } else if (
                                          precio == elementos.precio_impresion
                                        ) {
                                          comision_impreso =
                                            elementos.comision_impreso;
                                          insumoCarpeta = insumoCarpetaFINAL;
                                        }
                                      }
                                    }
                                  );

                                  const servicios = JSON.parse(
                                    clinica.listaServicios
                                  );
                                  const items = JSON.parse(clinica.listaItems);

                                  const serviciosConInsumoUSB =
                                    servicios.filter((servicio) => {
                                      const elementosFiltrados = items.filter(
                                        (elemento) =>
                                          elemento.estado &&
                                          elemento.id_servicio === servicio.id
                                      );

                                      return elementosFiltrados.some(
                                        (elemento) => elemento.insumoUSB > 0
                                      );
                                    });

                                  const totalInsumoUSB =
                                    serviciosConInsumoUSB.reduce(
                                      (total, servicio) => {
                                        const insumoUSB = items.find(
                                          (elemento) =>
                                            elemento.estado &&
                                            elemento.id_servicio ===
                                              servicio.id &&
                                            elemento.insumoUSB > 0
                                        );

                                        return (
                                          total +
                                          parseFloat(insumoUSB.insumoUSB)
                                        );
                                      },
                                      0
                                    );

                                  const total =
                                    precio -
                                    (
                                      parseFloat(igv > 0 ? igv : 0) +
                                      parseFloat(insumos1 > 0 ? insumos1 : 0) +
                                      parseFloat(insumos2 > 0 ? insumos2 : 0) +
                                      parseFloat(insumos3 > 0 ? insumos3 : 0) +
                                      parseFloat(insumos4 > 0 ? insumos4 : 0) +
                                      parseFloat(
                                        insumosM1 > 0 ? insumosM1 : 0
                                      ) +
                                      parseFloat(
                                        insumosM2 > 0 ? insumosM2 : 0
                                      ) +
                                      parseFloat(
                                        insumosM3 > 0 ? insumosM3 : 0
                                      ) +
                                      parseFloat(
                                        insumosM4 > 0 ? insumosM4 : 0
                                      ) +
                                      parseFloat(
                                        insumosM5 > 0 ? insumosM5 : 0
                                      ) +
                                      parseFloat(
                                        insumosM6 > 0 ? insumosM6 : 0
                                      ) +
                                      parseFloat(
                                        comision_digital > 0
                                          ? comision_digital
                                          : 0
                                      ) +
                                      parseFloat(
                                        comision_impreso > 0
                                          ? comision_impreso
                                          : 0
                                      )
                                    ).toFixed(2);
                                  total_final = total_final + parseFloat(total);
                                  insumoUSB = totalInsumoUSB;
                                });

                              return (
                                <ul
                                  className="reportes_clinicas"
                                  style={{ listStyle: "none" }}
                                >
                                  <li>CRP : {insumoCarpeta}</li>
                                  <li>USB: {insumoUSB}</li>
                                  <li>
                                    {(
                                      total_final -
                                      (insumoUSB + insumoCarpeta)
                                    ).toFixed(2)}
                                  </li>
                                </ul>
                              );
                            })()}
                          </td>

                          <td
                            className="text_center"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            {facturas.reduceRight((ultimoId, factura) => {
                              if (factura.id_orden === clinica.id) {
                                return factura.id_documento;
                              }
                              return ultimoId;
                            }, null) !== null ? (
                              <p>
                                {facturas.reduceRight((ultimoId, factura) => {
                                  if (factura.id_orden === clinica.id) {
                                    return factura.id_documento;
                                  }
                                  return ultimoId;
                                }, null)}
                              </p>
                            ) : null}
                          </td>
                          <td
                            className="text_center"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            {formatearFecha(clinica.created_at)}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr colSpan="6" align="center" rowSpan="5">
                      <td colSpan="6">
                        <div className="dot-spinner">
                          <div className="dot-spinner__dot"></div>
                          <div className="dot-spinner__dot"></div>
                          <div className="dot-spinner__dot"></div>
                          <div className="dot-spinner__dot"></div>
                          <div className="dot-spinner__dot"></div>
                          <div className="dot-spinner__dot"></div>
                          <div className="dot-spinner__dot"></div>
                          <div className="dot-spinner__dot"></div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              <Table
                id="productos2"
                className="table align-middle table-hover display"
                style={{ display: "none" }}
              >
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="text-center"></th>
                    <th scope="col" className="text-center"></th>
                    <th scope="col" className="text-center"></th>
                    <th scope="col" className="text-center"></th>
                    <th scope="col" className="text-center"></th>
                    <th scope="" className="text-center"></th>
                    <th scope="col" className="text-center"></th>
                    <th scope="col" className="text-center"></th>
                    <th
                      scope="col"
                      className="text-center"
                      colSpan={4}
                      style={{ background: "#4472C4", color: "white" }}
                    >
                      Insumo - Especialistas
                    </th>
                    <th
                      scope="col"
                      className="text-center"
                      colSpan={6}
                      style={{ background: "#ED7D31", color: "white" }}
                    >
                      Insumo - Material físico
                    </th>
                    <th
                      scope="col"
                      className="text-center"
                      colSpan={2}
                      style={{ background: "#A5A5A5", color: "white" }}
                    >
                      Insumo especial
                    </th>

                    <th scope="col" className="text-center"></th>
                    <th scope="col" className="text-center"></th>
                    <th scope="col" className="text-center"></th>
                    <th scope="col" className="text-center"></th>
                    <th scope="col" className="text-center"></th>
                  </tr>
                  <tr>
                    <th scope="col" className="text-center">
                      ID
                    </th>

                    <th scope="col" className="text-center" colSpan={2}>
                      Servicios Realizados
                    </th>

                    <th scope="col" className="text-center" colSpan={2}>
                      Examenes realizados
                    </th>

                    <th scope="col" className="text-center">
                      Tipo
                    </th>

                    <th scope="" className="text-center">
                      Costo publico
                    </th>

                    <th scope="col" className="text-center">
                      IGV
                    </th>

                    <th
                      scope="col"
                      className="text-center"
                      style={{ background: "#C0D0EB", color: "black" }}
                    >
                      Insumo1
                    </th>

                    <th
                      scope="col"
                      className="text-center"
                      style={{ background: "#C0D0EB", color: "black" }}
                    >
                      Insumo2
                    </th>

                    <th
                      scope="col"
                      className="text-center"
                      style={{ background: "#C0D0EB", color: "black" }}
                    >
                      Insumo3
                    </th>

                    <th
                      scope="col"
                      className="text-center"
                      style={{ background: "#C0D0EB", color: "black" }}
                    >
                      Insumo4
                    </th>

                    <th
                      scope="col"
                      className="text-center"
                      style={{ background: "#F9D3BA", color: "black" }}
                    >
                      Insumo1
                    </th>

                    <th
                      scope="col"
                      className="text-center"
                      style={{ background: "#F9D3BA", color: "black" }}
                    >
                      Insumo2
                    </th>

                    <th
                      scope="col"
                      className="text-center"
                      style={{ background: "#F9D3BA", color: "black" }}
                    >
                      Insumo3
                    </th>

                    <th
                      scope="col"
                      className="text-center"
                      style={{ background: "#F9D3BA", color: "black" }}
                    >
                      Insumo4
                    </th>

                    <th
                      scope="col"
                      className="text-center"
                      style={{ background: "#F9D3BA", color: "black" }}
                    >
                      Insumo5
                    </th>

                    <th
                      scope="col"
                      className="text-center"
                      style={{ background: "#F9D3BA", color: "black" }}
                    >
                      Insumo6
                    </th>

                    <th
                      scope="col"
                      className="text-center"
                      style={{ background: "#E1E1E1", color: "black" }}
                    >
                      Insumo Carpeta
                    </th>

                    <th
                      scope="col"
                      className="text-center"
                      style={{ background: "#E1E1E1", color: "black" }}
                    >
                      Insumo USB
                    </th>

                    <th scope="col" className="text-center">
                      Comision Digital
                    </th>

                    <th scope="col" className="text-center">
                      Comision Impreso
                    </th>

                    <th scope="col" className="text-center">
                      TOTAL COSTOS VARIABLES
                    </th>

                    <th scope="col" className="text-center">
                      UTILIDAD POR EXAMEN
                    </th>

                    <th scope="col" className="text-center">
                      UTILIDAD TOTAL
                    </th>

                    <th scope="col" className="text-center">
                      DOC. ELECTRONICO
                    </th>

                    <th scope="col" className="text-center">
                      FECHA
                    </th>
                  </tr>
                </thead>
                <tbody id="tableBody">
                  {loading == false ? (
                    clinicas.map((clinica) => {
                      return (
                        <tr key={clinica.id}>
                          <td
                            className="text-truncate trucate_text"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            #Orden {clinica.id}
                          </td>

                          <td
                            className="text-left"
                            style={{
                              width: "",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                            colSpan={2}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {servicios.map((serv, indexserv) =>
                                JSON.parse(clinica.impresionServicios).map(
                                  (elementos, indexElementos) =>
                                    elementos.estado == true &&
                                    serv.id == elementos.id_servicio ? (
                                      <li key={indexserv}>{serv.nombre}</li>
                                    ) : (
                                      ""
                                    )
                                )
                              )}
                            </ul>
                          </td>

                          <td
                            className="text-left"
                            style={{
                              width: "",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                            colSpan={2}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems).map(
                                (elementos, indexElementos) =>
                                  elementos.estado == true && (
                                    <li key={indexElementos}>
                                      {elementos.nombre}
                                    </li>
                                  )
                              )}
                            </ul>
                          </td>

                          <td className="text-left">
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems).map(
                                (elementos, indexElementos) =>
                                  elementos.estado == true &&
                                  JSON.parse(clinica.listaServicios).map(
                                    (lista, indexLista) =>
                                      lista.id == elementos.id_servicio && (
                                        <li key={indexLista}>
                                          {lista.estado == true
                                            ? "Impreso"
                                            : "Digital"}
                                        </li>
                                      )
                                  )
                              )}
                            </ul>
                          </td>

                          <td
                            className="text-left"
                            style={{
                              width: "",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems)
                                .filter((elementos) => elementos.estado == true)
                                .map((elementos, indexElementos) => {
                                  return (
                                    <li key={indexElementos}>
                                      <span> {elementos.precio}</span>
                                    </li>
                                  );
                                })}
                            </ul>
                          </td>

                          <td
                            className="text-left"
                            style={{
                              width: "",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems)
                                .filter((elementos) => elementos.estado == true)
                                .map((elementos, indexElementos) => {
                                  return (
                                    <li key={indexElementos}>
                                      <span>
                                        {" "}
                                        {(elementos.precio * 0.18).toFixed(2)}
                                      </span>
                                    </li>
                                  );
                                })}
                            </ul>
                          </td>

                          <td
                            className="text-left"
                            style={{
                              background: "#C0D0EB",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems)
                                .filter((elementos) => elementos.estado == true)
                                .map((elementos, indexElementos) => {
                                  return (
                                    <li key={indexElementos}>
                                      <span>
                                        {" "}
                                        {elementos.insumos1 > 0
                                          ? elementos.insumos1
                                          : "-"}
                                      </span>
                                    </li>
                                  );
                                })}
                            </ul>
                          </td>

                          <td
                            className="text-left"
                            style={{
                              background: "#C0D0EB",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems)
                                .filter((elementos) => elementos.estado == true)
                                .map((elementos, indexElementos) => {
                                  return (
                                    <li key={indexElementos}>
                                      <span>
                                        {" "}
                                        {elementos.insumos2 > 0
                                          ? elementos.insumos2
                                          : "-"}
                                      </span>
                                    </li>
                                  );
                                })}
                            </ul>
                          </td>

                          <td
                            className="text-left"
                            style={{
                              background: "#C0D0EB",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems)
                                .filter((elementos) => elementos.estado == true)
                                .map((elementos, indexElementos) => {
                                  return (
                                    <li key={indexElementos}>
                                      <span>
                                        {" "}
                                        {elementos.insumos3 > 0
                                          ? elementos.insumos3
                                          : "-"}
                                      </span>
                                    </li>
                                  );
                                })}
                            </ul>
                          </td>

                          <td
                            className="text-left"
                            style={{
                              background: "#C0D0EB",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems)
                                .filter((elementos) => elementos.estado == true)
                                .map((elementos, indexElementos) => {
                                  return (
                                    <li key={indexElementos}>
                                      <span>
                                        {" "}
                                        {elementos.insumos4 > 0
                                          ? elementos.insumos4
                                          : "-"}
                                      </span>
                                    </li>
                                  );
                                })}
                            </ul>
                          </td>

                          <td
                            className="text-left"
                            style={{
                              background: "#F9D3BA",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems).map(
                                (elementos, indexElementos) =>
                                  elementos.estado == true &&
                                  JSON.parse(clinica.listaServicios).map(
                                    (lista, indexLista) =>
                                      lista.id == elementos.id_servicio &&
                                      lista.estado == true ? (
                                        <li key={indexLista}>
                                          {elementos.insumosM1 > 0
                                            ? elementos.insumosM1
                                            : "-"}
                                        </li>
                                      ) : (
                                        lista.id == elementos.id_servicio &&
                                        lista.estado == false && (
                                          <li key={indexLista}>-</li>
                                        )
                                      )
                                  )
                              )}
                            </ul>
                          </td>

                          <td
                            className="text-left"
                            style={{
                              background: "#F9D3BA",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems).map(
                                (elementos, indexElementos) =>
                                  elementos.estado == true &&
                                  JSON.parse(clinica.listaServicios).map(
                                    (lista, indexLista) =>
                                      lista.id == elementos.id_servicio &&
                                      lista.estado == true ? (
                                        <li key={indexLista}>
                                          {elementos.insumosM2 > 0
                                            ? elementos.insumosM2
                                            : "-"}
                                        </li>
                                      ) : (
                                        lista.id == elementos.id_servicio &&
                                        lista.estado == false && (
                                          <li key={indexLista}>-</li>
                                        )
                                      )
                                  )
                              )}
                            </ul>
                          </td>

                          <td
                            className="text-left"
                            style={{
                              background: "#F9D3BA",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems).map(
                                (elementos, indexElementos) =>
                                  elementos.estado == true &&
                                  JSON.parse(clinica.listaServicios).map(
                                    (lista, indexLista) =>
                                      lista.id == elementos.id_servicio &&
                                      lista.estado == true ? (
                                        <li key={indexLista}>
                                          {elementos.insumosM3 > 0
                                            ? elementos.insumosM3
                                            : "-"}
                                        </li>
                                      ) : (
                                        lista.id == elementos.id_servicio &&
                                        lista.estado == false && (
                                          <li key={indexLista}>-</li>
                                        )
                                      )
                                  )
                              )}
                            </ul>
                          </td>

                          <td
                            className="text-left"
                            style={{
                              background: "#F9D3BA",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems).map(
                                (elementos, indexElementos) =>
                                  elementos.estado == true &&
                                  JSON.parse(clinica.listaServicios).map(
                                    (lista, indexLista) =>
                                      lista.id == elementos.id_servicio &&
                                      lista.estado == true ? (
                                        <li key={indexLista}>
                                          {elementos.insumosM4 > 0
                                            ? elementos.insumosM4
                                            : "-"}
                                        </li>
                                      ) : (
                                        lista.id == elementos.id_servicio &&
                                        lista.estado == false && (
                                          <li key={indexLista}>-</li>
                                        )
                                      )
                                  )
                              )}
                            </ul>
                          </td>

                          <td
                            className="text-left"
                            style={{
                              background: "#F9D3BA",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems).map(
                                (elementos, indexElementos) =>
                                  elementos.estado == true &&
                                  JSON.parse(clinica.listaServicios).map(
                                    (lista, indexLista) =>
                                      lista.id == elementos.id_servicio &&
                                      lista.estado == true ? (
                                        <li key={indexLista}>
                                          {elementos.insumosM5 > 0
                                            ? elementos.insumosM5
                                            : "-"}
                                        </li>
                                      ) : (
                                        lista.id == elementos.id_servicio &&
                                        lista.estado == false && (
                                          <li key={indexLista}>-</li>
                                        )
                                      )
                                  )
                              )}
                            </ul>
                          </td>

                          <td
                            className="text-left"
                            style={{
                              background: "#F9D3BA",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems).map(
                                (elementos, indexElementos) =>
                                  elementos.estado == true &&
                                  JSON.parse(clinica.listaServicios).map(
                                    (lista, indexLista) =>
                                      lista.id == elementos.id_servicio &&
                                      lista.estado == true ? (
                                        <li key={indexLista}>
                                          {elementos.insumosM6 > 0
                                            ? elementos.insumosM6
                                            : "-"}
                                        </li>
                                      ) : (
                                        lista.id == elementos.id_servicio &&
                                        lista.estado == false && (
                                          <li key={indexLista}>-</li>
                                        )
                                      )
                                  )
                              )}
                            </ul>
                          </td>

                          <td
                            className="text-center"
                            style={{
                              background: "#E1E1E1",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            {(() => {
                              const listaItems = JSON.parse(clinica.listaItems);
                              const listaServicios = JSON.parse(
                                clinica.listaServicios
                              );
                              const resultados = [];

                              for (let i = 0; i < listaItems.length; i++) {
                                const elementos = listaItems[i];

                                if (elementos.estado == true) {
                                  const servicioEncontrado =
                                    listaServicios.find(
                                      (lista) =>
                                        lista.id == elementos.id_servicio &&
                                        lista.estado == true
                                    );
                                  if (servicioEncontrado) {
                                    resultados.push(
                                      listaItems[0].insumoCarpeta
                                    );
                                    break; // Detener el bucle después de encontrar el primer resultado
                                  }
                                }
                              }
                              return (
                                <ul
                                  className="reportes_clinicas"
                                  style={{ listStyle: "none" }}
                                >
                                  {JSON.parse(clinica.listaItems)
                                    .filter(
                                      (elementos) => elementos.estado == true
                                    )
                                    .map(
                                      (elementos, indexElementos) =>
                                        indexElementos < 1 && (
                                          <li key={indexElementos}>
                                            {resultados}
                                          </li>
                                        )
                                    )}
                                </ul>
                              );
                            })()}
                          </td>

                          <td
                            className="text-left"
                            style={{
                              background: "#E1E1E1",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaServicios).map(
                                (lista, indexLista) => {
                                  const elementosFiltrados = JSON.parse(
                                    clinica.listaItems
                                  ).filter(
                                    (elementos) =>
                                      elementos.estado &&
                                      elementos.id_servicio == lista.id
                                  );
                                  if (elementosFiltrados.length > 0) {
                                    const elemento = elementosFiltrados[0];
                                    return (
                                      <li key={indexLista}>
                                        {elemento.insumoUSB > 0
                                          ? elemento.insumoUSB
                                          : null}
                                      </li>
                                    );
                                  }
                                  return null;
                                }
                              )}
                            </ul>
                          </td>

                          <td
                            className="text-left"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems).map(
                                (elementos, indexElementos) =>
                                  elementos.estado == true &&
                                  JSON.parse(clinica.listaServicios)
                                    .filter(
                                      (lista) =>
                                        lista.id == elementos.id_servicio
                                    )
                                    .map((lista, indexLista) => {
                                      let comision = "";
                                      if (lista.estado == true) {
                                        comision = "-";
                                      } else {
                                        comision = elementos.comision_digital;
                                      }
                                      return (
                                        <li key={indexLista}>{comision}</li>
                                      );
                                      // lista.id == elementos.id_servicio && lista.estado == true ?
                                      //     <li key={indexLista}>{elementos.comision_digital > 0 ? elementos.comision_digital : "-"}</li>
                                      // :lista.id == elementos.id_servicio && lista.estado == false &&
                                      // <li key={indexLista}>-</li>
                                    })
                              )}
                            </ul>
                          </td>

                          <td
                            className="text-left"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems).map(
                                (elementos, indexElementos) =>
                                  elementos.estado == true &&
                                  JSON.parse(clinica.listaServicios)
                                    .filter(
                                      (lista) =>
                                        lista.id == elementos.id_servicio
                                    )
                                    .map((lista, indexLista) => {
                                      let comision = "";
                                      if (lista.estado == true) {
                                        comision = elementos.comision_impreso;
                                      } else {
                                        comision = "-";
                                      }
                                      return (
                                        <li key={indexLista}>{comision}</li>
                                      );
                                      // lista.id == elementos.id_servicio && lista.estado == true ?
                                      //     <li key={indexLista}>{elementos.comision_digital > 0 ? elementos.comision_digital : "-"}</li>
                                      // :lista.id == elementos.id_servicio && lista.estado == false &&
                                      // <li key={indexLista}>-</li>
                                    })
                              )}
                            </ul>
                          </td>

                          {/* TOTALES */}
                          <td
                            className="text-left"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems)
                                .filter((elementos) => elementos.estado == true)
                                .map((elementos, indexElementos) => {
                                  const igv = (elementos.precio * 0.18).toFixed(
                                    2
                                  );
                                  const precio = elementos.precio;
                                  const insumos1 = elementos.insumos1;
                                  const insumos2 = elementos.insumos2;
                                  const insumos3 = elementos.insumos3;
                                  const insumos4 = elementos.insumos4;
                                  let insumosM1 = 0;
                                  let insumosM2 = 0;
                                  let insumosM3 = 0;
                                  let insumosM4 = 0;
                                  let insumosM5 = 0;
                                  let insumosM6 = 0;
                                  let insumoUSB = 0;
                                  let insumoCarpeta = 0;
                                  let comision_digital = 0;
                                  let comision_impreso = 0;
                                  JSON.parse(clinica.listaServicios).map(
                                    (lista, indexLista) => {
                                      if (lista.id == elementos.id_servicio) {
                                        if (
                                          precio == elementos.precio_digital
                                        ) {
                                          insumosM1 = elementos.insumosM1;
                                          insumosM2 = elementos.insumosM2;
                                          insumosM3 = elementos.insumosM3;
                                          insumosM4 = elementos.insumosM4;
                                          insumosM5 = elementos.insumosM5;
                                          insumosM6 = elementos.insumosM6;
                                          comision_digital =
                                            elementos.comision_digital;
                                        } else if (
                                          precio == elementos.precio_impresion
                                        ) {
                                          comision_impreso =
                                            elementos.comision_impreso;
                                        }
                                      }
                                      // if(lista.id == elementos.id_servicio && lista.id == 1){
                                      //     insumoUSB = elementos.insumoUSB;
                                      // }
                                    }
                                  );

                                  const total = (
                                    parseFloat(igv > 0 ? igv : 0) +
                                    parseFloat(insumos1 > 0 ? insumos1 : 0) +
                                    parseFloat(insumos2 > 0 ? insumos2 : 0) +
                                    parseFloat(insumos3 > 0 ? insumos3 : 0) +
                                    parseFloat(insumos4 > 0 ? insumos4 : 0) +
                                    parseFloat(insumosM1 > 0 ? insumosM1 : 0) +
                                    parseFloat(insumosM2 > 0 ? insumosM2 : 0) +
                                    parseFloat(insumosM3 > 0 ? insumosM3 : 0) +
                                    parseFloat(insumosM4 > 0 ? insumosM4 : 0) +
                                    parseFloat(insumosM5 > 0 ? insumosM5 : 0) +
                                    parseFloat(insumosM6 > 0 ? insumosM6 : 0) +
                                    parseFloat(insumoUSB > 0 ? insumoUSB : 0) +
                                    parseFloat(
                                      insumoCarpeta > 0 ? insumoCarpeta : 0
                                    ) +
                                    parseFloat(
                                      comision_digital > 0
                                        ? comision_digital
                                        : 0
                                    ) +
                                    parseFloat(
                                      comision_impreso > 0
                                        ? comision_impreso
                                        : 0
                                    )
                                  ).toFixed(2);
                                  return (
                                    <li key={indexElementos}>
                                      <span> {total}</span>
                                    </li>
                                  );
                                })}
                            </ul>
                          </td>

                          <td
                            className="text+ left"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {JSON.parse(clinica.listaItems)
                                .filter((elementos) => elementos.estado == true)
                                .map((elementos, indexElementos) => {
                                  const igv = (elementos.precio * 0.18).toFixed(
                                    2
                                  );
                                  const precio = elementos.precio;
                                  const insumos1 = elementos.insumos1;
                                  const insumos2 = elementos.insumos2;
                                  const insumos3 = elementos.insumos3;
                                  const insumos4 = elementos.insumos4;
                                  let insumosM1 = 0;
                                  let insumosM2 = 0;
                                  let insumosM3 = 0;
                                  let insumosM4 = 0;
                                  let insumosM5 = 0;
                                  let insumosM6 = 0;
                                  let insumoUSB = 0;
                                  let insumoCarpeta = 0;
                                  let comision_digital = 0;
                                  let comision_impreso = 0;

                                  JSON.parse(clinica.listaServicios).map(
                                    (lista, indexLista) => {
                                      if (lista.id == elementos.id_servicio) {
                                        if (
                                          precio == elementos.precio_digital
                                        ) {
                                          insumosM1 = elementos.insumosM1;
                                          insumosM2 = elementos.insumosM2;
                                          insumosM3 = elementos.insumosM3;
                                          insumosM4 = elementos.insumosM4;
                                          insumosM5 = elementos.insumosM5;
                                          insumosM6 = elementos.insumosM6;
                                          comision_digital =
                                            elementos.comision_digital;
                                        } else if (
                                          precio == elementos.precio_impresion
                                        ) {
                                          comision_impreso =
                                            elementos.comision_impreso;
                                        }
                                      }
                                      // if(lista.id == elementos.id_servicio && lista.id == 1){
                                      //     insumoUSB = elementos.insumoUSB;
                                      // }
                                    }
                                  );

                                  const total =
                                    precio -
                                    (
                                      parseFloat(igv > 0 ? igv : 0) +
                                      parseFloat(insumos1 > 0 ? insumos1 : 0) +
                                      parseFloat(insumos2 > 0 ? insumos2 : 0) +
                                      parseFloat(insumos3 > 0 ? insumos3 : 0) +
                                      parseFloat(insumos4 > 0 ? insumos4 : 0) +
                                      parseFloat(
                                        insumosM1 > 0 ? insumosM1 : 0
                                      ) +
                                      parseFloat(
                                        insumosM2 > 0 ? insumosM2 : 0
                                      ) +
                                      parseFloat(
                                        insumosM3 > 0 ? insumosM3 : 0
                                      ) +
                                      parseFloat(
                                        insumosM4 > 0 ? insumosM4 : 0
                                      ) +
                                      parseFloat(
                                        insumosM5 > 0 ? insumosM5 : 0
                                      ) +
                                      parseFloat(
                                        insumosM6 > 0 ? insumosM6 : 0
                                      ) +
                                      parseFloat(
                                        insumoUSB > 0 ? insumoUSB : 0
                                      ) +
                                      parseFloat(
                                        insumoCarpeta > 0 ? insumoCarpeta : 0
                                      ) +
                                      parseFloat(
                                        comision_digital > 0
                                          ? comision_digital
                                          : 0
                                      ) +
                                      parseFloat(
                                        comision_impreso > 0
                                          ? comision_impreso
                                          : 0
                                      )
                                    ).toFixed(2);

                                  return (
                                    <li key={indexElementos}>
                                      <span> {total.toFixed(2)}</span>
                                    </li>
                                  );
                                })}
                            </ul>
                          </td>

                          <td
                            className="text_center"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            {(() => {
                              let total_final = 0;
                              const listaItems = JSON.parse(clinica.listaItems);
                              let insumoCarpetaFINAL =
                                listaItems[0].insumoCarpeta;
                              let insumoCarpeta = 0;
                              let insumoUSB = 0;
                              JSON.parse(clinica.listaItems)
                                .filter((elementos) => elementos.estado == true)
                                .forEach((elementos, indexElementos) => {
                                  const igv = (elementos.precio * 0.18).toFixed(
                                    2
                                  );
                                  const precio = elementos.precio;
                                  const insumos1 = elementos.insumos1;
                                  const insumos2 = elementos.insumos2;
                                  const insumos3 = elementos.insumos3;
                                  const insumos4 = elementos.insumos4;
                                  let insumosM1 = 0;
                                  let insumosM2 = 0;
                                  let insumosM3 = 0;
                                  let insumosM4 = 0;
                                  let insumosM5 = 0;
                                  let insumosM6 = 0;
                                  let comision_digital = 0;
                                  let comision_impreso = 0;

                                  JSON.parse(clinica.listaServicios).map(
                                    (lista, indexLista) => {
                                      if (lista.id == elementos.id_servicio) {
                                        if (
                                          precio == elementos.precio_digital
                                        ) {
                                          insumosM1 = elementos.insumosM1;
                                          insumosM2 = elementos.insumosM2;
                                          insumosM3 = elementos.insumosM3;
                                          insumosM4 = elementos.insumosM4;
                                          insumosM5 = elementos.insumosM5;
                                          insumosM6 = elementos.insumosM6;
                                          comision_digital =
                                            elementos.comision_digital;
                                        } else if (
                                          precio == elementos.precio_impresion
                                        ) {
                                          comision_impreso =
                                            elementos.comision_impreso;
                                          insumoCarpeta = insumoCarpetaFINAL;
                                        }
                                      }
                                    }
                                  );

                                  const servicios = JSON.parse(
                                    clinica.listaServicios
                                  );
                                  const items = JSON.parse(clinica.listaItems);

                                  const serviciosConInsumoUSB =
                                    servicios.filter((servicio) => {
                                      const elementosFiltrados = items.filter(
                                        (elemento) =>
                                          elemento.estado &&
                                          elemento.id_servicio === servicio.id
                                      );

                                      return elementosFiltrados.some(
                                        (elemento) => elemento.insumoUSB > 0
                                      );
                                    });

                                  const totalInsumoUSB =
                                    serviciosConInsumoUSB.reduce(
                                      (total, servicio) => {
                                        const insumoUSB = items.find(
                                          (elemento) =>
                                            elemento.estado &&
                                            elemento.id_servicio ===
                                              servicio.id &&
                                            elemento.insumoUSB > 0
                                        );

                                        return (
                                          total +
                                          parseFloat(insumoUSB.insumoUSB)
                                        );
                                      },
                                      0
                                    );

                                  const total =
                                    precio -
                                    (
                                      parseFloat(igv > 0 ? igv : 0) +
                                      parseFloat(insumos1 > 0 ? insumos1 : 0) +
                                      parseFloat(insumos2 > 0 ? insumos2 : 0) +
                                      parseFloat(insumos3 > 0 ? insumos3 : 0) +
                                      parseFloat(insumos4 > 0 ? insumos4 : 0) +
                                      parseFloat(
                                        insumosM1 > 0 ? insumosM1 : 0
                                      ) +
                                      parseFloat(
                                        insumosM2 > 0 ? insumosM2 : 0
                                      ) +
                                      parseFloat(
                                        insumosM3 > 0 ? insumosM3 : 0
                                      ) +
                                      parseFloat(
                                        insumosM4 > 0 ? insumosM4 : 0
                                      ) +
                                      parseFloat(
                                        insumosM5 > 0 ? insumosM5 : 0
                                      ) +
                                      parseFloat(
                                        insumosM6 > 0 ? insumosM6 : 0
                                      ) +
                                      parseFloat(
                                        comision_digital > 0
                                          ? comision_digital
                                          : 0
                                      ) +
                                      parseFloat(
                                        comision_impreso > 0
                                          ? comision_impreso
                                          : 0
                                      )
                                    ).toFixed(2);
                                  total_final = total_final + parseFloat(total);
                                  insumoUSB = totalInsumoUSB;
                                });

                              return (
                                <ul
                                  className="reportes_clinicas"
                                  style={{ listStyle: "none" }}
                                >
                                  <li>
                                    {(
                                      total_final -
                                      (insumoUSB + insumoCarpeta)
                                    ).toFixed(2)}
                                  </li>
                                </ul>
                              );
                            })()}
                          </td>

                          <td
                            className="text_center"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            {facturas.reduceRight((ultimoId, factura) => {
                              if (factura.id_orden === clinica.id) {
                                return factura.id_documento;
                              }
                              return ultimoId;
                            }, null) !== null ? (
                              <p>
                                {facturas.reduceRight((ultimoId, factura) => {
                                  if (factura.id_orden === clinica.id) {
                                    return factura.id_documento;
                                  }
                                  return ultimoId;
                                }, null)}
                              </p>
                            ) : null}
                          </td>

                          <td
                            className="text_center"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            {formatearFecha(clinica.created_at)}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr colSpan="6" align="center" rowSpan="5">
                      <td colSpan="6">
                        <div className="dot-spinner">
                          <div className="dot-spinner__dot"></div>
                          <div className="dot-spinner__dot"></div>
                          <div className="dot-spinner__dot"></div>
                          <div className="dot-spinner__dot"></div>
                          <div className="dot-spinner__dot"></div>
                          <div className="dot-spinner__dot"></div>
                          <div className="dot-spinner__dot"></div>
                          <div className="dot-spinner__dot"></div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              <div
                className="dataTables_info"
                id="productos_info"
                role="status"
                aria-live="polite"
              >
                {cargandoBusqueda} Registros
              </div>

              <div
                className="dataTables_paginate paging_simple_numbers"
                id="productos_paginate"
              >
                <Paginacion
                  totalPosts={totalPosts}
                  cantidadRegistros={cantidadRegistros}
                  paginaActual={paginaActual}
                  setpaginaActual={setpaginaActual}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
