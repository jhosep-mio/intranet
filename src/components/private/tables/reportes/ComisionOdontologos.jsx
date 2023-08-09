import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Global } from "../../../../helper/Global";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { RiFileExcel2Fill } from "react-icons/ri";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import Swal from "sweetalert2";
import { Paginacion } from "../../shared/Paginacion";

export const ComisionOdontologos = () => {
  const [clinicas, setClinicas] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [itemPagination, setItemPagination] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [paginaActual, setpaginaActual] = useState(1);
  const [cantidadRegistros] = useState(4);
  const [cargandoBusqueda, setCargandoBusqueda] = useState(0);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  let token = localStorage.getItem("token");

  useEffect(() => {
    const filter2 = clinicas.filter((cate) =>
      quitarAcentos(cate.odontologo.toLowerCase()).includes(
        quitarAcentos(search.toLowerCase())
      )
    );
    setCargandoBusqueda(filter2.length);
  }, [search]);

  useEffect(() => {
    getAllClinicas();
    getAllOrdenes();
  }, []);

  const getAllClinicas = async () => {
    setLoading(true);

    const request = await axios.get(`${Global.url}/reporteComisionesMes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setClinicas(request.data);
    setCargandoBusqueda(request.data.length);
  };

  const getAllOrdenes = async () => {
    const request = await axios.get(`${Global.url}/allOrdenesPerMes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(request);
    setOrdenes(request.data);
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
          `${Global.url}/reporteComisionesFechas`,
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
      const request = await axios.get(`${Global.url}/reporteComisiones`, {
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

  return (
    <div className="container mt-6 ms-5-auto">
      <div className="row justify-content-center">
        {/* TAMAÑO DE LA TABLA WIDTH  */}
        <div className="col-md-11">
          {/* <!--=== TABLA PRODUCTOS ===--> */}
          <div className="card">
            <div className="card-header text-center fs-5 fw-bolder">
              Reporte de comisiones a pagar por odontólogo.
            </div>
            <div className="p-4 table-responsive">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div className="content_excel">
                  <RiFileExcel2Fill style={{ color: "white" }} />
                  <ReactHTMLTableToExcel
                    id="table-xls-button"
                    className="download"
                    table="productos2"
                    filename="Reporte de comisión por odontólogo"
                    sheet="sheet1"
                    buttonText="Excel"
                  />
                </div>
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

              <Table
                id="productos"
                className="table align-middle table-hover display"
                style={{ marginTop: "20px" }}
              >
                <thead className="table-light">
                  <tr>
                    {/* <!-- 1 --> */}
                    <th scope="col" className="text-center">
                      Odontólogo
                    </th>
                    {/* <!-- 2 --> */}
                    <th scope="col" className="text-center">
                      ID ORDEN
                    </th>

                    <th scope="col" className="text-center">
                      Paciente
                    </th>

                    <th scope="col" className="text-center">
                      Fecha de creacion
                    </th>

                    <th scope="col" className="text-center">
                    comisión a pagar
                    </th>

                    <th scope="col" className="text-center">
                      Total a pagar
                    </th>
                  </tr>
                </thead>
                <tbody id="tableBody">
                  {loading == false ? (
                    clinicas.map((clinica) => {
                      let total_final = 0;
                      return (
                        <tr key={clinica.id}>
                          <td
                            className=""
                            style={{ textAlign: "center", maxWidth: "200px" }}
                          >
                            <ul style={{ listStyle: "none" }}>
                              {clinica.idsOrdenes.map((serv, indexserv) =>
                                ordenes
                                  .filter((orden) => orden.id == serv)
                                  .map((orden) => {
                                    console.log(serv);
                                    return (
                                      indexserv < 1 && (
                                        <li key={indexserv}>
                                          {orden.odontologo}{" "}
                                          {orden.odontologo_apellido_p}{" "}
                                          {orden.odontologo_apellido_m}{" "}
                                        </li>
                                      )
                                    );
                                    // setFechaCreacion(`${fecha_at.toLocaleTimeString()} - ${fecha_at.toLocaleDateString()}`)
                                  })
                              )}
                            </ul>
                          </td>

                          <td
                            className="text-center"
                            style={{ textAlign: "center", width: "200px" }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {clinica.idsOrdenes.map((serv, indexserv) => (
                                <li key={indexserv}> #ORDEN {serv}</li>
                              ))}
                            </ul>
                          </td>

                          <td
                            className="text-center"
                            style={{ textAlign: "center" }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {clinica.idsOrdenes.map((serv, indexserv) =>
                                ordenes
                                  .filter((orden) => orden.id == serv)
                                  .map((orden) => (
                                    <li key={indexserv} className="uncampo111">
                                      {orden.paciente}{" "}
                                      {orden.paciente_apellido_p}{" "}
                                      {orden.paciente_apellido_m}
                                    </li>
                                  ))
                              )}
                            </ul>
                          </td>

                          <td
                            className="text-center"
                            style={{ textAlign: "center" }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {clinica.idsOrdenes.map((serv, indexserv) =>
                                ordenes
                                  .filter((orden) => orden.id == serv)
                                  .map((orden) => {
                                    const fecha_at = new Date(orden.created_at);
                                    const options = {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    };
                                    const fechaFormateada =
                                      fecha_at.toLocaleDateString(
                                        undefined,
                                        options
                                      );
                                    return (
                                      <li key={indexserv}>{fechaFormateada}</li>
                                    );
                                    // setFechaCreacion(`${fecha_at.toLocaleTimeString()} - ${fecha_at.toLocaleDateString()}`)
                                  })
                              )}
                            </ul>
                          </td>

                          <td className="text-center">
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {clinica.idsOrdenes.map((serv, indexserv) =>
                                ordenes
                                  .filter((orden) => orden.id == serv)
                                  .map((orden) => {
                                    let total = 0;
                                    JSON.parse(orden.listaItems)
                                      .filter((lista) => lista.estado == true)
                                      .map((lista, indexLista) => {
                                        JSON.parse(orden.listaServicios)
                                          .filter(
                                            (servicios) =>
                                              servicios.id == lista.id_servicio
                                          )
                                          .forEach(
                                            (servicios, indexservicios) => {
                                              if (servicios.estado) {
                                                total =
                                                  total +
                                                  parseFloat(
                                                    lista.comision_impreso
                                                  );
                                              } else {
                                                total =
                                                  total +
                                                  parseFloat(
                                                    lista.comision_digital
                                                  );
                                              }
                                            }
                                          );
                                      });
                                    return <li>S./ {total.toFixed(2)}</li>;
                                  })
                              )}
                            </ul>
                          </td>

                          <td className="text-center">
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {clinica.idsOrdenes.map((serv, indexserv) => {
                                let total = 0;
                                ordenes
                                  .filter((orden) => orden.id == serv)
                                  .map((orden) => {
                                    JSON.parse(orden.listaItems)
                                      .filter((lista) => lista.estado == true)
                                      .map((lista, indexLista) => {
                                        JSON.parse(orden.listaServicios)
                                          .filter(
                                            (servicios) =>
                                              servicios.id == lista.id_servicio
                                          )
                                          .forEach(
                                            (servicios, indexservicios) => {
                                              if (servicios.estado) {
                                                total =
                                                  total +
                                                  parseFloat(
                                                    lista.comision_impreso
                                                  );
                                              } else {
                                                total =
                                                  total +
                                                  parseFloat(
                                                    lista.comision_digital
                                                  );
                                              }
                                            }
                                          );
                                      });
                                  });
                                total_final += total;
                              })}
                              {clinica.idsOrdenes.map((serv, indexserv) =>
                                ordenes
                                  .filter((orden) => orden.id == serv)
                                  .map((orden) => {
                                    return (
                                      indexserv < 1 && (
                                        <li key={indexserv}>
                                          S/.{total_final.toFixed(2)}{" "}
                                        </li>
                                      )
                                    );
                                    // setFechaCreacion(`${fecha_at.toLocaleTimeString()} - ${fecha_at.toLocaleDateString()}`)
                                  })
                              )}
                            </ul>
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
                style={{ marginTop: "20px", display: "none" }}
              >
                <thead className="table-light">
                  <tr>
                    {/* <!-- 1 --> */}
                    <th scope="col" className="text-center">
                      Odontólogo
                    </th>
                    {/* <!-- 2 --> */}
                    <th scope="col" className="text-center">
                      ID ORDEN
                    </th>

                    <th scope="col" className="text-center">
                      Paciente
                    </th>

                    <th scope="col" className="text-center">
                      Fecha de creacion
                    </th>

                    <th scope="col" className="text-center">
                    comisión a pagar
                    </th>

                    <th scope="col" className="text-center">
                      Total a pagar
                    </th>
                  </tr>
                </thead>
                <tbody id="tableBody">
                  {loading == false ? (
                    clinicas.map((clinica) => {
                      let total_final = 0;
                      return (
                        <tr key={clinica.id}>
                          <td
                            className="text-truncate trucate_text"
                            style={{ textAlign: "center" }}
                          >
                            <ul style={{ listStyle: "none" }}>
                              {clinica.idsOrdenes.map((serv, indexserv) =>
                                ordenes
                                  .filter((orden) => orden.id == serv)
                                  .map((orden) => {
                                    return indexserv < 1 ? (
                                      <li key={indexserv}>
                                        {clinica.odontologo}{" "}
                                      </li>
                                    ) : (
                                      <li key={indexserv}>-</li>
                                    );
                                    // setFechaCreacion(`${fecha_at.toLocaleTimeString()} - ${fecha_at.toLocaleDateString()}`)
                                  })
                              )}
                            </ul>
                          </td>

                          <td
                            className="text-center"
                            style={{ textAlign: "center" }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {clinica.idsOrdenes.map((serv, indexserv) => (
                                <li key={indexserv}> #ORDEN {serv}</li>
                              ))}
                            </ul>
                          </td>

                          <td
                            className="text-center"
                            style={{ textAlign: "center" }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {clinica.idsOrdenes.map((serv, indexserv) =>
                                ordenes
                                  .filter((orden) => orden.id == serv)
                                  .map((orden) => (
                                    <li key={indexserv}>
                                      {orden.paciente}{" "}
                                      {orden.paciente_apellido_p}{" "}
                                      {orden.paciente_apellido_m}
                                    </li>
                                  ))
                              )}
                            </ul>
                          </td>

                          <td
                            className="text-center"
                            style={{ textAlign: "center" }}
                          >
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {clinica.idsOrdenes.map((serv, indexserv) =>
                                ordenes
                                  .filter((orden) => orden.id == serv)
                                  .map((orden) => {
                                    const fecha_at = new Date(orden.created_at);
                                    const options = {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    };
                                    const fechaFormateada =
                                      fecha_at.toLocaleDateString(
                                        undefined,
                                        options
                                      );
                                    return (
                                      <li key={indexserv}>{fechaFormateada}</li>
                                    );
                                    // setFechaCreacion(`${fecha_at.toLocaleTimeString()} - ${fecha_at.toLocaleDateString()}`)
                                  })
                              )}
                            </ul>
                          </td>

                          <td className="text-center">
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {clinica.idsOrdenes.map((serv, indexserv) =>
                                ordenes
                                  .filter((orden) => orden.id == serv)
                                  .map((orden) => {
                                    let total = 0;
                                    JSON.parse(orden.listaItems)
                                      .filter((lista) => lista.estado == true)
                                      .map((lista, indexLista) => {
                                        JSON.parse(orden.listaServicios)
                                          .filter(
                                            (servicios) =>
                                              servicios.id == lista.id_servicio
                                          )
                                          .forEach(
                                            (servicios, indexservicios) => {
                                              if (servicios.estado) {
                                                total =
                                                  total +
                                                  parseFloat(
                                                    lista.comision_impreso
                                                  );
                                              } else {
                                                total =
                                                  total +
                                                  parseFloat(
                                                    lista.comision_digital
                                                  );
                                              }
                                            }
                                          );
                                      });
                                    return <li>{total.toFixed(2)}</li>;
                                  })
                              )}
                            </ul>
                          </td>

                          <td className="text-center">
                            <ul
                              className="reportes_clinicas"
                              style={{ listStyle: "none" }}
                            >
                              {clinica.idsOrdenes.map((serv, indexserv) => {
                                let total = 0;
                                ordenes
                                  .filter((orden) => orden.id == serv)
                                  .map((orden) => {
                                    JSON.parse(orden.listaItems)
                                      .filter((lista) => lista.estado == true)
                                      .map((lista, indexLista) => {
                                        JSON.parse(orden.listaServicios)
                                          .filter(
                                            (servicios) =>
                                              servicios.id == lista.id_servicio
                                          )
                                          .forEach(
                                            (servicios, indexservicios) => {
                                              if (servicios.estado) {
                                                total =
                                                  total +
                                                  parseFloat(
                                                    lista.comision_impreso
                                                  );
                                              } else {
                                                total =
                                                  total +
                                                  parseFloat(
                                                    lista.comision_digital
                                                  );
                                              }
                                            }
                                          );
                                      });
                                  });
                                total_final += total;
                              })}
                              {clinica.idsOrdenes.map((serv, indexserv) =>
                                ordenes
                                  .filter((orden) => orden.id == serv)
                                  .map((orden) => {
                                    return indexserv < 1 ? (
                                      <li key={indexserv}>
                                        {total_final.toFixed(2)}{" "}
                                      </li>
                                    ) : (
                                      <li key={indexserv}>-</li>
                                    );
                                    // setFechaCreacion(`${fecha_at.toLocaleTimeString()} - ${fecha_at.toLocaleDateString()}`)
                                  })
                              )}
                            </ul>
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
