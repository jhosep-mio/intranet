import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Global } from "../../../../helper/Global";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { Paginacion } from "../../shared/Paginacion";
import { BsXCircle } from "react-icons/bs";

const ListaClinica = (props) => {
  const { id_clinica_click, cerrar } = props;

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
    const request = await axios.post(`${Global.url}/buscarClinica`, data, {
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

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // Realizar la búsqueda aquí
      if (!loading) {
        getAllClinicas();
      }
    }
  };

  return (
    <div className="container mt-6 ms-5-auto" style={{ padding: "0" }}>
      <div className="row justify-content-center">
        {/* TAMAÑO DE LA TABLA WIDTH  */}
        <div className="col-md-12" style={{ padding: "0" }}>
          {/* <!--=== TABLA PRODUCTOS ===--> */}
          <div className="card">
            <div className="card-header text-center fs-5 fw-bolder">
              Listado de Clínicas
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
                    <th scope="col" className="text-left">
                      Nombre
                    </th>

                    <th scope="col" className="text-left">
                      Dirección
                    </th>

                    <th scope="col" className="text-center">
                      Teléfono
                    </th>

                    <th scope="col" className="text-center">
                      Celular
                    </th>
                  </tr>
                </thead>
                <tbody id="tableBody">
                  {loading == false ? (
                    filterDate().map((clinica) => (
                        <tr
                        key={clinica.id}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          id_clinica_click(clinica.id), cerrar();
                        }}
                      >
                        <td className="text-center">{clinica.id}</td>

                        <td className="text-truncate trucate_text">
                          {clinica.nombre}
                        </td>

                        <td className="text-truncate trucate_text">
                          {clinica.direccion}
                        </td>

                        <td className="text-center">{clinica.telefono}</td>

                        <td className="text-center">{clinica.celular}</td>

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

export default ListaClinica;
