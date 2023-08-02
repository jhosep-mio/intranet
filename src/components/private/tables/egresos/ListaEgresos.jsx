import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Global } from "../../../../helper/Global";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Swal from "sweetalert2";
import { BsXCircle } from "react-icons/bs";
import { Paginacion } from "../../shared/Paginacion";

const ListaEgresos = () => {
  const [clinicas, setClinicas] = useState([]);
  const [itemPagination, setItemPagination] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [paginaActual, setpaginaActual] = useState(1);
  const [cantidadRegistros] = useState(4);
  const [cargandoBusqueda, setCargandoBusqueda] = useState(0);
  let token = localStorage.getItem("token");

  const getAllClinicas = async () => {
    setLoading(true);
    const data = new FormData();
    data.append("buscar", search);
    const request = await axios.post(`${Global.url}/buscarEgresos`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setpaginaActual(1);
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
    return clinicas.slice(indexOfFirstPost, indexOfLastPost);
  };

  const onSeachChange = ({ target }) => {
    setpaginaActual(1);
    setSearch(target.value);
  };

  const preguntar = (id) => {
    Swal.fire({
      title: `¿Estás seguro de eliminar el registro N° ${id}?`,
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
      const resultado = await axios.delete(`${Global.url}/deleteEgreso/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
      Swal.fire("Error al eliminar el registro", "", "error");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (!loading) {
        getAllClinicas();
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
            <Link type="submit" className="btn btn-primary mb-3" to="agregar">
              {" "}
              <FontAwesomeIcon icon={faPlus} /> Registrar
            </Link>
          </div>

          {/* <!--=== TABLA PRODUCTOS ===--> */}

          <div className="card">
            <div className="card-header text-center fs-5 fw-bolder">
              Listado de Egresos
            </div>
            <div className="p-4 table-responsive">
              <div id="productos_filter" className="dataTables_filter">
                <label>
                  <input
                    value={search}
                    onChange={onSeachChange}
                    type="search"
                    className="form-control form-control-sm"
                    placeholder=""
                    aria-controls="productos"
                    onKeyPress={handleKeyPress}
                  />
                </label>
                <button
                  style={{
                    marginLeft: "10px",
                    padding: "0 7px",
                    background: "#41326D",
                    color: "white",
                    border: "none",
                  }}
                  onClick={() => {
                    loading == false && getAllClinicas();
                  }}
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
                      Descripción
                    </th>

                    <th scope="col" className="text-center">
                      Cantidad
                    </th>

                    <th scope="col" className="text-center">
                      Total
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
                          {clinica.descripcion}
                        </td>

                        <td
                          className="text-truncate trucate_text"
                          style={{ textAlign: "center" }}
                        >
                          {clinica.cantidad}
                        </td>

                        <td
                          className="text-truncate trucate_text"
                          style={{ textAlign: "center" }}
                        >
                          {clinica.total}
                        </td>

                        {/* <!-- 9. Opciones --> */}
                        <td className="text-center">
                          <Link
                            className="text-success"
                            to={`/admin/egresos/editar/${clinica.id}`}
                          >
                            <FontAwesomeIcon icon={faPencil} />
                          </Link>
                          <button
                            className="text-danger btnEliminar"
                            onClick={() => {
                              preguntar(clinica.id);
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

export default ListaEgresos;
