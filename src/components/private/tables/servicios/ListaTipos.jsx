import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Global } from "../../../../helper/Global";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Swal from "sweetalert2";
import { BsFillCheckSquareFill, BsFillXSquareFill } from "react-icons/bs";
import useAuth from "../../../../hooks/useAuth";
import { BsChevronDoubleLeft, BsChevronDoubleRight } from "react-icons/bs";
import { Paginacion } from "../../shared/Paginacion";

const ListaTipos = () => {
  let token = localStorage.getItem("token");
  const [itemServices, setitemServices] = useState([]);
  const [servicios, setservicios] = useState([]);
  const [insumo, setInsumo] = useState({});
  const [itemPagination, setItemPagination] = useState([]);
  const [itemPaginationOdonto, setItemPaginationOdonto] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [paginaActual, setpaginaActual] = useState(1);
  const [paginaActualOdonto, setPaginaActualOdonto] = useState(1);
  const [cantidadRegistros] = useState(4);
  const [cargandoBusqueda, setCargandoBusqueda] = useState(0);
  const [cargandoBusqueda2, setCargandoBusqueda2] = useState(0);
  const [activo, setActivo] = useState(0);
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getAllservicios();
    if (auth.id_rol != "99") {
      navigate("/admin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllservicios = async () => {
    setLoading(true);
    const request = await axios.get(`${Global.url}/allServicios`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setservicios(request.data);
    setCargandoBusqueda(request.data.length);
    setLoading(false);
  };

  const indexOfLastPost = paginaActual * cantidadRegistros;
  const indexOfFirstPost = indexOfLastPost - cantidadRegistros;
  let totalPosts = servicios.length;

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

  useEffect ( () =>{
    const filter2 = servicios.filter((item) => {
        return (
            quitarAcentos(item.nombre.toLowerCase()).includes(
              quitarAcentos(search.toLowerCase())
            ) || 
            item.id.toString().includes(search.toLowerCase())
        )
    });
    setCargandoBusqueda(filter2.length);
}, [search]);

  const filterDate = () => {
    if (search.length == 0) {
      let item = servicios.slice(indexOfFirstPost, indexOfLastPost);
      return item;
    }

    const filter = servicios.filter((item) => {
      return (
          quitarAcentos(item.nombre.toLowerCase()).includes(
            quitarAcentos(search.toLowerCase())
          ) || 
          item.id.toString().includes(search.toLowerCase())
      )
    });
    totalPosts= filter.length;
    return filter.slice(indexOfFirstPost, indexOfLastPost);
  };

  const handlePaginaAnterior = () => {
    if (paginaActual > 1) {
      setpaginaActual(paginaActual - 1);
    }
  };

  const handlePaginaSiguiente = () => {
    if (paginaActual < Math.ceil(totalPosts / cantidadRegistros)) {
      setpaginaActual(paginaActual + 1);
    }
  };

  const onSeachChange = ({ target }) => {
    setpaginaActual(1);
    setSearch(target.value);
  };

  const preguntar2 = (id) => {
    Swal.fire({
      title: `¿Estás seguro de eliminar el tipo de exámen N° ${id}?`,
      showDenyButton: true,
      confirmButtonText: "Eliminar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteServicio(id);
      }
    });
  };

  const deleteServicio = async (id) => {
    try {
      const resultado = await axios.delete(
        `${Global.url}/deleteServicio/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(resultado.data.status);

      if (resultado.data.status == "success") {
        Swal.fire("Registro eliminado correctamente", "", "success");
        getAllservicios();
        const ultimoRegistroEnPaginaActual = paginaActual * cantidadRegistros;
        if (
          ultimoRegistroEnPaginaActual > totalPostsOdonto &&
          paginaActual > 1
        ) {
          // Retroceder a la página anterior si el último registro de la página actual fue eliminado
          setPaginaActualOdonto(paginaActual - 1);
        }
      } else {
        Swal.fire("Error al eliminar el registro", "", "error");
      }
    } catch (error) {
      if (
        error.request.response.includes(
          "Integrity constraint violation"
        )
      ) {
        Swal.fire("Primero elimine los exámenes relacionados a este tipo de exámen", "", "warning");
      } else {
        Swal.fire("Error al eliminar el registro", "", "error");
        console.log(error);
      }
    }
  };

  return (
    <div className="container mt-6 ms-5-auto">
      <div className="row justify-content-center">
        {/* TAMAÑO DE LA TABLA WIDTH  */}
        <div className="col-md-11">
          <div className="d-grid">
            <input type="hidden" name="oculto" value="1" />
            <Link
              type="submit"
              className="btn btn-primary mb-3"
              to="agregar"
              style={{ width: "250px" }}
            >
              {" "}
              <FontAwesomeIcon icon={faPlus} /> Registrar Tipo de exámen
            </Link>
          </div>

          {/* <!--=== TABLA PRODUCTOS ===--> */}
          <div className="card">
            <div
              className="card-header text-center fs-5 fw-bolder"
              style={{ transition: "all 500ms" }}
            >
              Listado de Tipos de exámen
            </div>
            <div className="content_top_filters">
              <div className="content_top_filters__buttons">
                <button
                  onClick={() => navigate("/admin/examenes")}
                  style={{
                    backgroundColor: "transparent",
                    color: "#41326D",
                  }}
                >
                  Exámenes
                </button>
                <button
                  onClick={() => navigate("/admin/tipos-examen")}
                  style={{
                    backgroundColor: "#41326D",
                    color: "white",
                  }}
                >
                  Tipos de exámen
                </button>
                <button
                  onClick={() => navigate("/admin/carpetas")}
                  style={{
                    backgroundColor: "transparent",
                    color: "#41326D",
                  }}
                >
                  Insumo Carpeta
                </button>
              </div>
              <div id="productos_filter" className="dataTables_filter">
                <label>
                  Buscar:
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
            </div>

            <div className="p-4 table-responsive odon_itemServices">
              <Table
                id="productos"
                className="table align-middle table-hover display"
              >
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="text-center">
                      ID
                    </th>

                    <th scope="col" className="text-center">
                      Nombre
                    </th>

                    <th scope="col" className="text-center">
                      Impresión
                    </th>

                    {/* <!-- 3 --> */}
                    <th scope="col" className="text-center">
                      Opciones
                    </th>
                  </tr>
                </thead>
                <tbody id="tableBody">
                  {loading == false ? (
                    filterDate().map((servicio) => (
                      <tr key={servicio.id}>
                        <td className="text-center">{servicio.id}</td>

                        <td className="text-center">{servicio.nombre}</td>

                        <td className="text-center">
                          {servicio.impreso == 1 ? (
                            <BsFillCheckSquareFill className="icon_status_check" />
                          ) : (
                            <BsFillXSquareFill className="icon_status_no" />
                          )}
                        </td>

                        {/* <!-- 9. Opciones --> */}
                        <td className="text-center">
                          <Link
                            className="text-success"
                            to={`editar/${servicio.id}`}
                          >
                            <FontAwesomeIcon icon={faPencil} />
                          </Link>
                          {servicio.id == 1 ? (
                            ""
                          ) : (
                            <button
                              className="text-danger btnEliminar"
                              onClick={() => {
                                preguntar2(servicio.id);
                              }}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
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

export default ListaTipos;
