import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Global } from "../../../../helper/Global";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Swal from "sweetalert2";
import { BsCloudUploadFill } from "react-icons/bs";
import { Paginacion } from "../../shared/Paginacion";

const ListaOrdenVirtual = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [itemPagination, setItemPagination] = useState([]);
  const [servicios, setservicios] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [paginaActual, setpaginaActual] = useState(1);
  const [cantidadRegistros] = useState(4);
  const [cargandoBusqueda, setCargandoBusqueda] = useState(0);
  const [selected, setSelected] = useState(0)
  let token = localStorage.getItem("token");

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  useEffect(() => {
    getAllUsuarios(), getAllservicios(), getOrdenesDay();
  }, []);

  const getAllOrdenes = async () => {
    const data = new FormData();
    data.append("buscar", search);
    const request = await axios.post(`${Global.url}/buscarOrdenes`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setpaginaActual(1);
    setOrdenes(request.data);
    setCargandoBusqueda(request.data.length);
    setLoading(false);
  };

  const getOrdenesDay = async () => {
    const data = new FormData();
    const request = await axios.get(`${Global.url}/allOrdenVirtuales`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setpaginaActual(1);
    setOrdenes(request.data);
    setCargandoBusqueda(request.data.length);
    setLoading(false);
  };

  const getAllUsuarios = async () => {
    setLoading(true);
    const request = await axios.get(`${Global.url}/getUsuarios`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUsuarios(request.data);
  };

  const indexOfLastPost = paginaActual * cantidadRegistros;
  const indexOfFirstPost = indexOfLastPost - cantidadRegistros;
  let totalPosts = ordenes.length;

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

  useEffect(() => {
    const filter = ordenes.filter((item) => {
      const fullNamePaciente =
        item.paciente +
        " " +
        item.paciente_apellido_p +
        " " +
        item.paciente_apellido_m;
      const fullNameLowerCasePaciente = quitarAcentos(
        fullNamePaciente.toLowerCase()
      );

      const fullNameOdontologo =
        item.odontologo +
        " " +
        item.odontologo_apellido_p +
        " " +
        item.odontologo_apellido_m;
      const fullNameLowerCaseOdontologo = quitarAcentos(
        fullNameOdontologo.toLowerCase()
      );

      const searchLowerCase = quitarAcentos(search.toLowerCase());
      const searchWords = searchLowerCase.split(" ");

      // Verificar si todas las palabras de búsqueda coinciden con alguna parte del nombre completo del paciente
      const isMatchedPaciente = searchWords.every((word) => {
        return fullNameLowerCasePaciente.includes(word);
      });

      // Verificar si todas las palabras de búsqueda coinciden con alguna parte del nombre completo del odontólogo
      const isMatchedOdontologo = searchWords.every((word) => {
        return fullNameLowerCaseOdontologo.includes(word);
      });

      return (
        isMatchedPaciente ||
        isMatchedOdontologo ||
        item.id.toString().includes(searchLowerCase)
      );
    });
    setCargandoBusqueda(filter.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const filterDate = () => {
    if (search.length == 0) {
      let item = ordenes.slice(indexOfFirstPost, indexOfLastPost);
      return item;
    }

    const filter = ordenes.filter((item) => {
      const fullNamePaciente =
        item.paciente +
        " " +
        item.paciente_apellido_p +
        " " +
        item.paciente_apellido_m;
      const fullNameLowerCasePaciente = quitarAcentos(
        fullNamePaciente.toLowerCase()
      );

      const fullNameOdontologo =
        item.odontologo +
        " " +
        item.odontologo_apellido_p +
        " " +
        item.odontologo_apellido_m;
      const fullNameLowerCaseOdontologo = quitarAcentos(
        fullNameOdontologo.toLowerCase()
      );

      const searchLowerCase = quitarAcentos(search.toLowerCase());
      const searchWords = searchLowerCase.split(" ");

      // Verificar si todas las palabras de búsqueda coinciden con alguna parte del nombre completo del paciente
      const isMatchedPaciente = searchWords.every((word) => {
        return fullNameLowerCasePaciente.includes(word);
      });

      // Verificar si todas las palabras de búsqueda coinciden con alguna parte del nombre completo del odontólogo
      const isMatchedOdontologo = searchWords.every((word) => {
        return fullNameLowerCaseOdontologo.includes(word);
      });

      return (
        isMatchedPaciente ||
        isMatchedOdontologo ||
        item.id.toString().includes(searchLowerCase)
      );
    });

    return filter.slice(indexOfFirstPost, indexOfLastPost);
  };

  const onSeachChange = ({ target }) => {
    setpaginaActual(1);
    setSearch(target.value);
  };

  const preguntar = (id) => {
    Swal.fire({
      title: `¿Estás seguro de eliminar la orden N° ${id}?`,
      showDenyButton: true,
      confirmButtonText: "Eliminar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteClinica(id);
      }
    });
  };

  const deleteClinica = async (id) => {
    try {
      const resultado = await axios.delete(
        `${Global.url}/deleteOrdenVirtual/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (resultado.data.status === "success") {
        Swal.fire("Registro eliminado correctamente", "", "success");
        // Filtrar las órdenes para quitar la orden eliminada del estado local
        setOrdenes(ordenes.filter((orden) => orden.id !== id));
        const ultimoRegistroEnPaginaActual = paginaActual * cantidadRegistros;
        if (ultimoRegistroEnPaginaActual > totalPosts && paginaActual > 1) {
          // Retroceder a la página anterior si el último registro de la página actual fue eliminado
          setpaginaActual(paginaActual - 1);
        }

        const filter = (ordenes.filter((orden) => orden.id !== id)).filter((item) => {
          const fullNamePaciente =
            item.paciente +
            " " +
            item.paciente_apellido_p +
            " " +
            item.paciente_apellido_m;
          const fullNameLowerCasePaciente = quitarAcentos(
            fullNamePaciente.toLowerCase()
          );
    
          const fullNameOdontologo =
            item.odontologo +
            " " +
            item.odontologo_apellido_p +
            " " +
            item.odontologo_apellido_m;
          const fullNameLowerCaseOdontologo = quitarAcentos(
            fullNameOdontologo.toLowerCase()
          );
    
          const searchLowerCase = quitarAcentos(search.toLowerCase());
          const searchWords = searchLowerCase.split(" ");
    
          // Verificar si todas las palabras de búsqueda coinciden con alguna parte del nombre completo del paciente
          const isMatchedPaciente = searchWords.every((word) => {
            return fullNameLowerCasePaciente.includes(word);
          });
    
          // Verificar si todas las palabras de búsqueda coinciden con alguna parte del nombre completo del odontólogo
          const isMatchedOdontologo = searchWords.every((word) => {
            return fullNameLowerCaseOdontologo.includes(word);
          });
    
          return (
            isMatchedPaciente ||
            isMatchedOdontologo ||
            item.id.toString().includes(searchLowerCase)
          );
        });
        setCargandoBusqueda(filter.length);



      } else {
        Swal.fire("Error al eliminar el registro", "", "error");
      }
    } catch (error) {
      console.log(error.request.response);
      if (error.request.response.includes("Integrity constraint violation")) {
        Swal.fire(
          "La orden virtual contiene archivos relacionados",
          "",
          "error"
        );
      } else {
        Swal.fire("Error al eliminar el registro", "", "error");
      }
    }
  };
  
  const getAllservicios = async () => {
    const request = await axios.get(`${Global.url}/allServicios`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setservicios(request.data);
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    if (fechaInicio && fechaFin) {
      e.preventDefault();
      const data = new FormData();
      data.append("fechaInicio", fechaInicio);
      data.append("fechaFin", fechaFin);
      try {
        const request = await axios.post(`${Global.url}/reporteOrdenes`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setpaginaActual(1);
        setOrdenes(request.data);
        setCargandoBusqueda(request.data.length);
        getAllservicios();
        getAllUsuarios();
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    } else {
      setSearch("");
      getAllOrdenes();
    }
  };

  const getCreados = async (estado) => {
    setLoading(true);
    if (fechaInicio && fechaFin) {
      const data = new FormData();
      data.append("estado", estado);
      data.append("fechaInicio", fechaInicio);
      data.append("fechaFin", fechaFin);
      const request = await axios.post(`${Global.url}/getCreados`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setpaginaActual(1);
      setOrdenes(request.data);

      const filter = request.data.filter((item) => {
        const fullNamePaciente =
          item.paciente +
          " " +
          item.paciente_apellido_p +
          " " +
          item.paciente_apellido_m;
        const fullNameLowerCasePaciente = quitarAcentos(
          fullNamePaciente.toLowerCase()
        );

        const fullNameOdontologo =
          item.odontologo +
          " " +
          item.odontologo_apellido_p +
          " " +
          item.odontologo_apellido_m;
        const fullNameLowerCaseOdontologo = quitarAcentos(
          fullNameOdontologo.toLowerCase()
        );

        const searchLowerCase = quitarAcentos(search.toLowerCase());
        const searchWords = searchLowerCase.split(" ");

        // Verificar si todas las palabras de búsqueda coinciden con alguna parte del nombre completo del paciente
        const isMatchedPaciente = searchWords.every((word) => {
          return fullNameLowerCasePaciente.includes(word);
        });

        // Verificar si todas las palabras de búsqueda coinciden con alguna parte del nombre completo del odontólogo
        const isMatchedOdontologo = searchWords.every((word) => {
          return fullNameLowerCaseOdontologo.includes(word);
        });

        return (
          isMatchedPaciente ||
          isMatchedOdontologo ||
          item.id.toString().includes(searchLowerCase)
        );
      });
      setCargandoBusqueda(filter.length);
      setLoading(false);
    } else {
      const data = new FormData();
      data.append("estado", estado);
      const request = await axios.post(`${Global.url}/buscarCreaados`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setpaginaActual(1);
      setOrdenes(request.data);

      const filter = request.data.filter((item) => {
        const fullNamePaciente =
          item.paciente +
          " " +
          item.paciente_apellido_p +
          " " +
          item.paciente_apellido_m;
        const fullNameLowerCasePaciente = quitarAcentos(
          fullNamePaciente.toLowerCase()
        );

        const fullNameOdontologo =
          item.odontologo +
          " " +
          item.odontologo_apellido_p +
          " " +
          item.odontologo_apellido_m;
        const fullNameLowerCaseOdontologo = quitarAcentos(
          fullNameOdontologo.toLowerCase()
        );

        const searchLowerCase = quitarAcentos(search.toLowerCase());
        const searchWords = searchLowerCase.split(" ");

        // Verificar si todas las palabras de búsqueda coinciden con alguna parte del nombre completo del paciente
        const isMatchedPaciente = searchWords.every((word) => {
          return fullNameLowerCasePaciente.includes(word);
        });

        // Verificar si todas las palabras de búsqueda coinciden con alguna parte del nombre completo del odontólogo
        const isMatchedOdontologo = searchWords.every((word) => {
          return fullNameLowerCaseOdontologo.includes(word);
        });

        return (
          isMatchedPaciente ||
          isMatchedOdontologo ||
          item.id.toString().includes(searchLowerCase)
        );
      });
      setCargandoBusqueda(filter.length);
      setLoading(false);
    }
  };

  return (
    <div className="container mt-6 ms-5-auto">
      <div className="row justify-content-center">
        {/* TAMAÑO DE LA TABLA WIDTH  */}
        <div className="col-md-11">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div className="d-grid">
              <input type="hidden" name="oculto" value="1" />
              <Link type="submit" className="btn btn-primary mb-3" to="validar">
                {" "}
                <FontAwesomeIcon icon={faPlus} /> Registrar
              </Link>
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
              <button
                style={{
                  padding: "5px 7px",
                  background: "#41326D",
                  color: "white",
                  border: "none",
                }}
                onClick={handleSubmit}
              >
                {loading == false ? (
                  "Buscar"
                ) : (
                  <div className="dot-spinner00">
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* <!--=== TABLA PRODUCTOS ===--> */}
          <div className="card">
            <div className="card-header text-center fs-5 fw-bolder">
              Listado de Órdenes Virtuales
            </div>
            <div
              className="p-4 table-responsive"
              style={{ position: "relative" }}
            >
              <ul className="lista_estados">
                <li
                  className={`${selected == 1 ? 'saltandoactivo' : ''}`}
                  style={ selected == 1 ? {color: "white", background: "rgb(191, 191, 31)", boxShadow: '3px 5px 4px rgba(0, 0, 0, 1.3)'} : { color: "white", background: "rgb(191, 191, 31)"}}
                  onClick={() => {getCreados(0); setSelected(1)}}
                >
                  Creados
                </li>
                <li
                  className={`${selected == 2 ? 'saltandoactivo' : ''}`}
                  style={selected == 2 ? {color: "white", background: "green", boxShadow: '3px 5px 4px rgba(0, 0, 0, 1.3)'} : { color: "white", background: "green" }}
                  onClick={() => {getCreados(1); setSelected(2)}}
                >
                  Pagados
                </li>
                <li
                  className={`${selected == 3 ? 'saltandoactivo' : ''}`}
                  style={selected == 3 ? {color: "white", background: "#01C2D4", boxShadow: '3px 5px 4px rgba(0, 0, 0, 1.3)'} : { color: "white", background: "#01C2D4" }}
                  onClick={() => {getCreados(3); setSelected(3)}}
                >
                  Pagados sin documento
                </li>

                <li
                  className={`${selected == 4 ? 'saltandoactivo' : ''}`}
                  style={selected == 4 ? {color: "white", background: "#D23741", boxShadow: '3px 5px 4px rgba(0, 0, 0, 1.3)'} : { color: "white", background: "#D23741" }}
                  onClick={() => {getCreados(2); setSelected(4)}}
                >
                  Realizados
                </li>
              </ul>

              <div id="productos_filter" className="dataTables_filter">
                <label>
                  <input
                    value={search}
                    onChange={onSeachChange}
                    type="search"
                    className="form-control form-control-sm"
                    placeholder=""
                    aria-controls="productos"
                  />
                </label>
              </div>

              <Table
                id="productos"
                className="table align-middle table-hover display"
                style={{ width: "100vw" }}
              >
                <thead className="table-light">
                  <tr>
                    {/* <!-- 1 --> */}
                    <th scope="col" className="text-center">
                      Opciones
                    </th>

                    <th scope="col" className="text-center">
                      ID
                    </th>

                    <th scope="col" className="text-center">
                      Estado
                    </th>

                    <th scope="col" className="text-center">
                      Paciente
                    </th>

                    <th scope="col" className="text-center">
                      Odontólogo
                    </th>

                    <th scope="col" className="text-center">
                      Tp. Estudio
                    </th>

                    <th scope="col" className="text-center">
                      Datos de Creación
                    </th>

                    <th scope="col" className="text-center">
                      Datos de Modificación
                    </th>

                    {/* <!-- 2 --> */}

                    {/* <!-- 3 --> */}
                  </tr>
                </thead>
                <tbody id="tableBody">
                  {loading == false ? (
                    filterDate().map((orden) => (
                      <tr key={orden.id}>
                        <td className="text-center">
                          {orden.estado == 2 ? (
                            <Link
                              className="text-success"
                              to={`/admin/archivosEstudio/${orden.id}`}
                              style={{ marginRight: "10px" }}
                            >
                              <BsCloudUploadFill style={{ fontSize: "20px" }} />
                            </Link>
                          ) : (
                            ""
                          )}
                          <Link
                            className="text-success"
                            to={`/admin/ordenVirtual/editar/${orden.id}`}
                          >
                            <FontAwesomeIcon icon={faPencil} />
                          </Link>
                          <button
                            className="text-danger btnEliminar"
                            onClick={() => {
                              preguntar(orden.id);
                            }}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>

                        <td className="text-center">{orden.id}</td>

                        <td className="text-center">
                          {orden.estado == 0 ? (
                            <input
                              style={{ background: "rgb(191, 191, 31)" }}
                              className="button_estado"
                              type="text"
                              value="Creado"
                              disabled
                            />
                          ) : orden.estado == 1 ? (
                            <input
                              style={{ background: "green" }}
                              className="button_estado"
                              type="text"
                              value="Pagado con documento electrónico"
                              disabled
                            />
                          ) : orden.estado == 2 ? (
                            <input
                              style={{ background: "#D23741" }}
                              className="button_estado"
                              type="text"
                              value="Exámen Realizado"
                              disabled
                            />
                          ) : orden.estado == 3 ? (
                            <input
                              style={{ background: "#01C2D4" }}
                              className="button_estado"
                              type="text"
                              value="Pagado sin documento electrónico"
                              disabled
                            />
                          ) : (
                            ""
                          )}
                        </td>

                        <td
                          className="text-center"
                          style={{ maxWidth: "100px" }}
                        >
                          {orden.paciente} {orden.paciente_apellido_p}{" "}
                          {orden.paciente_apellido_m}
                        </td>

                        <td
                          className="text-center"
                          style={{ maxWidth: "100px" }}
                        >
                          {orden.odontologo == "No tiene un odontólogo asignado"
                            ? ""
                            : orden.odontologo}{" "}
                          {orden.odontologo_apellido_p}{" "}
                          {orden.odontologo_apellido_m}
                        </td>

                        <td className="text-left" style={{ maxWidth: "200px" }}>
                          {servicios.map((serv, indexserv) =>
                            JSON.parse(orden.impresionServicios).map(
                              (elementos, indexElementos) =>
                                elementos.estado == true &&
                                serv.id == elementos.id_servicio ? (
                                  <li key={indexserv}>{serv.nombre}</li>
                                ) : (
                                  ""
                                )
                            )
                          )}
                        </td>

                        <td
                          className="text-center"
                          style={{ maxWidth: "100px" }}
                        >
                          {usuarios.map(
                            (user) =>
                              user.id == orden.id_creacion && (
                                <>
                                  <span>{user.name}</span>
                                  <br />
                                  <br />
                                </>
                              )
                          )}
                          {new Date(orden.created_at).toLocaleDateString()}
                          <br />
                          {new Date(orden.created_at).toLocaleTimeString()}
                        </td>

                        <td
                          className="text-center"
                          style={{ maxWidth: "100px" }}
                        >
                          {usuarios.map(
                            (user) =>
                              user.id == orden.id_modificacion && (
                                <>
                                  <span>{user.name}</span>
                                  <br />
                                  <br />
                                </>
                              )
                          )}
                          {new Date(orden.updated_at).toLocaleDateString()}
                          <br />
                          {new Date(orden.updated_at).toLocaleTimeString()}
                        </td>

                        {/* <!-- 9. Opciones --> */}
                      </tr>
                    ))
                  ) : (
                    <tr colSpan="7" align="center" rowSpan="7">
                      <td colSpan="7">
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

export default ListaOrdenVirtual;
