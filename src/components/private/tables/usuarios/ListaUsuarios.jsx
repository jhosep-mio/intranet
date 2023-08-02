import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Global } from "../../../../helper/Global";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Swal from "sweetalert2";
import { BsXCircle } from "react-icons/bs";
import useAuth from "../../../../hooks/useAuth";
import { Paginacion } from "../../shared/Paginacion";

const ListaUsuarios = () => {
  const { auth } = useAuth();
  const [clinicas, setClinicas] = useState([]);
  const [itemPagination, setItemPagination] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [paginaActual, setpaginaActual] = useState(1);
  const [cantidadRegistros] = useState(4);
  const [cargandoBusqueda, setCargandoBusqueda] = useState(0);
  let token = localStorage.getItem("token");

  useEffect(() => {
    const filter = clinicas.filter((item) => {
        return (
          quitarAcentos(item.name.toLowerCase()).includes(
            quitarAcentos(search.toLowerCase())
          ) ||
          quitarAcentos(
            (item.id_rol == 99 ? "Administrador" : "Recepción").toLowerCase()
          ).includes(quitarAcentos(search.toLowerCase())) ||
          quitarAcentos(item.email.toLowerCase()).includes(
            quitarAcentos(search.toLowerCase())
          ) ||
          item.id.toString().includes(search.toLowerCase())
        );
      });
    setCargandoBusqueda(filter.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    getAllClinicas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllClinicas = async () => {
    setLoading(true);

    const request = await axios.get(`${Global.url}/getUsuarios`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setClinicas(request.data);
    setCargandoBusqueda(request.data.length);
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
      let item = clinicas.slice(indexOfFirstPost, indexOfLastPost);
      return item;
    }

    const filter = clinicas.filter((item) => {
      return (
        quitarAcentos(item.name.toLowerCase()).includes(
          quitarAcentos(search.toLowerCase())
        ) ||
        quitarAcentos(
          (item.id_rol == 99 ? "Administrador" : "Recepción").toLowerCase()
        ).includes(quitarAcentos(search.toLowerCase())) ||
        quitarAcentos(item.email.toLowerCase()).includes(
          quitarAcentos(search.toLowerCase())
        ) ||
        item.id.toString().includes(search.toLowerCase())
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
      title: `¿Estás seguro de eliminar al usuario N° ${id}?`,
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
        `${Global.url}/destroyUser/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (resultado.data.status == "success") {
        Swal.fire("Registro eliminado correctamente", "", "success");
        getAllClinicas();
        setTimeout(() => {
          const ultimoRegistroEnPaginaActual = paginaActual * cantidadRegistros;
          if (ultimoRegistroEnPaginaActual > totalPosts && paginaActual > 1) {
            // Retroceder a la página anterior si el último registro de la página actual fue eliminado
            setpaginaActual(paginaActual - 1);
          }
        }, 1000);
      } else {
        Swal.fire("Error al eliminar el registro", "", "error");
      }
    } catch (error) {
      console.log(error)
      Swal.fire("Error al eliminar el registro", "", "error");
    }
  };

  return (
    <div className="container mt-6 ms-5-auto">
      <div className="row justify-content-center">
        {/* TAMAÑO DE LA TABLA WIDTH  */}
        <div className="col-md-11">
          <div className="d-grid">
            <input type="hidden" name="oculto" value="1" />
            <Link type="submit" className="btn btn-primary mb-3" to="agregar">
              {" "}
              <FontAwesomeIcon icon={faPlus} /> Registrar
            </Link>
          </div>

          {/* <!--=== TABLA PRODUCTOS ===--> */}

          <div className="card">
            <div className="card-header text-center fs-5 fw-bolder">
              Listado de Usuarios
            </div>
            <div className="p-4 table-responsive">
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
                      Rol
                    </th>

                    <th scope="col" className="text-center">
                      Nombre
                    </th>

                    <th scope="col" className="text-center">
                      Email
                    </th>
                    {/* <!-- 3 --> */}
                    <th scope="col" className="text-center">
                      Opciones
                    </th>
                  </tr>
                </thead>
                <tbody id="tableBody">
                  {loading == false ? (
                    filterDate().map((clinica) => (
                      <tr key={clinica.id}>
                        <td className="text-center">{clinica.id}</td>
                        <td
                          className="text-truncate trucate_text"
                          style={{ textAlign: "center" }}
                        >
                          {clinica.id_rol == 99 ? "Administrador" : "Recepción"}
                        </td>
                        <td
                          className="text-truncate trucate_text"
                          style={{ textAlign: "center" }}
                        >
                          {clinica.name}
                        </td>

                        <td className="text-center">{clinica.email}</td>

                        {/* <!-- 9. Opciones --> */}
                        {auth.id != 1 && clinica.id != 1 && (
                          <td className="text-center">
                            <Link
                              className="text-success"
                              to={`/admin/usuarioss/editar/${clinica.id}`}
                            >
                              <FontAwesomeIcon icon={faPencil} />
                            </Link>
                          </td>
                        )}
                        {auth.id == 1 && (
                          <td className="text-center">
                            <Link
                              className="text-success"
                              to={`/admin/usuarioss/editar/${clinica.id}`}
                            >
                              <FontAwesomeIcon icon={faPencil} />
                            </Link>
                            {clinica.id != 1 && (
                              <button
                                className="text-danger btnEliminar"
                                onClick={() => {
                                  preguntar(clinica.id);
                                }}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            )}
                          </td>
                        )}
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

export default ListaUsuarios;
