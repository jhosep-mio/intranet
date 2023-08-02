import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Global } from "../../../../helper/Global";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Swal from "sweetalert2";
import useAuth from "../../../../hooks/useAuth";
import { Paginacion } from "../../shared/Paginacion";

const ListaServicios = () => {
  let token = localStorage.getItem("token");
  const [itemServices, setitemServices] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [paginaActual, setpaginaActual] = useState(1);
  const [cantidadRegistros] = useState(4);
  const [cargandoBusqueda, setCargandoBusqueda] = useState(0);
  const [activo, setActivo] = useState(0);
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getAllitemServices();
    if (auth.id_rol != "99") {
      navigate("/admin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllitemServices = async () => {
    setLoading(true);
    const data = new FormData();
    data.append("buscar", search);
    const request = await axios.post(`${Global.url}/buscarItems`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setpaginaActual(1);
    setitemServices(request.data);
    setCargandoBusqueda(request.data.length);
    setLoading(false);
  };

  const indexOfLastPost = paginaActual * cantidadRegistros;
  const indexOfFirstPost = indexOfLastPost - cantidadRegistros;
  let totalPosts = itemServices.length;

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

  const onSeachChange = ({ target }) => {
    setpaginaActual(1);
    setSearch(target.value);
  };

  const preguntar = (id) => {
    Swal.fire({
      title: `¿Estás seguro de eliminar el exámen N° ${id}?`,
      showDenyButton: true,
      confirmButtonText: "Eliminar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteitem(id);
      }
    });
  };

  const deleteitem = async (id) => {
    try {
      const resultado = await axios.delete(`${Global.url}/deleteItem/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(resultado);

      if (resultado.data.status === "success") {
        Swal.fire("Registro eliminado correctamente", "", "success");
        getAllitemServices();
        const ultimoRegistroEnPaginaActual = paginaActual * cantidadRegistros;
        if (ultimoRegistroEnPaginaActual > totalPosts && paginaActual > 1) {
          // Retroceder a la página anterior si el último registro de la página actual fue eliminado
          setpaginaActual(paginaActual - 1);
        }
      } else if (resultado.data.message) {
        Swal.fire(
          "El exámen esta siendo usado en alguna orden virtual",
          "",
          "error"
        );
      } else {
        Swal.fire("Error al eliminar el registro", "", "error");
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error al eliminar el registro", "", "error");
    }
  };

  useEffect(() => {
    const filter = itemServices.filter((item) => {
      return (
        quitarAcentos(item.nombre.toLowerCase()).includes(
          quitarAcentos(search.toLowerCase())
        ) || item.id.toString().includes(search.toLowerCase())
      );
    });

    setCargandoBusqueda(filter.length);
  }, [search]);

  const filterDate = () => {
    if (search.length == 0) {
      let item = itemServices.slice(indexOfFirstPost, indexOfLastPost);
      return item;
    }

    const filter = itemServices.filter((item) => {
      return (
        quitarAcentos(item.nombre.toLowerCase()).includes(
          quitarAcentos(search.toLowerCase())
        ) || quitarAcentos(item.servicio.toLowerCase()).includes(
          quitarAcentos(search.toLowerCase())
        ) || item.id.toString().includes(search.toLowerCase())
        || item.precio_impresion.toString().includes(search.toLowerCase())
        || item.precio_digital.toString().includes(search.toLowerCase())
      );
    });
    totalPosts= filter.length;
    return filter.slice(indexOfFirstPost, indexOfLastPost);
  };

  return (
    <div className="container mt-6 ms-5-auto" style={{ paddingBottom: "20px" }}>
      <div className="row justify-content-center">
        {/* TAMAÑO DE LA TABLA WIDTH  */}
        <div className="col-md-11">
          <div className="d-grid">
            <input type="hidden" name="oculto" value="1" />
            <Link
              type="submit"
              className="btn btn-primary mb-3"
              to="agregar"
              style={{ width: "200px" }}
            >
              {" "}
              <FontAwesomeIcon icon={faPlus} /> Registrar Exámen
            </Link>
          </div>
          {/* <!--=== TABLA PRODUCTOS ===--> */}
          <div className="card">
            <div
              className="card-header text-center fs-5 fw-bolder"
              style={{ transition: "all 500ms" }}
            >
              Listado de Exámenes
            </div>
            <div className="content_top_filters">
              <div className="content_top_filters__buttons">
                <button
                  onClick={() => navigate("/admin/examenes")}
                  style={{
                    backgroundColor: "#41326D",
                    color: "white",
                  }}
                >
                  Exámenes
                </button>
                <button
                  onClick={() => navigate("/admin/tipos-examen")}
                  style={{
                    backgroundColor: "transparent",
                    color: "#41326D",
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
                    {/* <!-- 1 --> */}
                    <th scope="col" className="text-center">
                      ID
                    </th>
                    {/* <!-- 2 --> */}
                    <th scope="col" className="text-center">
                      Nombre
                    </th>

                    <th scope="col" className="text-center">
                      Servicio
                    </th>

                    <th scope="col" className="text-center">
                      Precio Impresión
                    </th>

                    <th scope="col" className="text-center">
                      Precio Digital
                    </th>

                    {/* <!-- 3 --> */}
                    <th scope="col" className="text-center">
                      Opciones
                    </th>
                  </tr>
                </thead>
                <tbody id="tableBody">
                  {loading == false ? (
                    filterDate().map((item) => (
                      <tr key={item.id}>
                        <td className="text-center">{item.id}</td>

                        <td
                          className="text-truncate"
                          style={{ maxWidth: "200px" }}
                        >
                          {item.nombre}
                        </td>

                        <td className="text-center">{item.servicio}</td>

                        <td className="text-center">{item.precio_impresion}</td>

                        <td className="text-center">{item.precio_digital}</td>

                        {/* <!-- 9. Opciones --> */}
                        <td className="text-center">
                          <Link
                            className="text-success"
                            to={`editar/${item.id}`}
                          >
                            <FontAwesomeIcon icon={faPencil} />
                          </Link>
                          <button
                            className="text-danger btnEliminar"
                            onClick={() => {
                              preguntar(item.id);
                            }}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
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

export default ListaServicios;
