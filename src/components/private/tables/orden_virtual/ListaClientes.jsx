import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Global } from "../../../../helper/Global";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Swal from "sweetalert2";
import { Paginacion } from "../../shared/Paginacion";

const ListaOdontologos = (props) => {
  const { id_odon, nombreOdon, copOdon, emailOdon, cerrar, celOdon } = props;

  const [odontologos, setOdontologos] = useState([]);
  const [clinicas, setClinicas] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [paginaActualOdonto, setPaginaActualOdonto] = useState(1);

  const [cantidadRegistros] = useState(4);
  const [cargandoBusqueda2, setCargandoBusqueda2] = useState(0);
  const navigate = useNavigate();

  let token = localStorage.getItem("token");

  const getAllOdontologos = async () => {
    setLoading(true);
    const data = new FormData();
    data.append("buscar", search);
    const request = await axios.post(`${Global.url}/buscarOdontologo`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(request)
    setOdontologos(request.data);
    setCargandoBusqueda2(request.data.length);
    setLoading(false);
  };

  const indexOfLastPostOdonto = paginaActualOdonto * cantidadRegistros;
  const indexOfFirstPostOdonto = indexOfLastPostOdonto - cantidadRegistros;
  let totalPostsOdonto = odontologos.length;

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

  const filterDateOdontologos = () => {
    return odontologos.slice(indexOfFirstPostOdonto, indexOfLastPostOdonto);
  };

  const onSeachChange = ({ target }) => {
    setPaginaActualOdonto(1);
    setSearch(target.value);
  };

  const preguntar2 = (id) => {
    Swal.fire({
      title: `¿Estás seguro de eliminar al odontólogo N° ${id}?`,
      showDenyButton: true,
      confirmButtonText: "Eliminar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteOdontologo(id);
      }
    });
  };

  const deleteOdontologo = async (id) => {
    try {
      const resultado = await axios.delete(
        `${Global.url}/deleteOdontologo/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (resultado.data.status == "success") {
        Swal.fire("Registro eliminado correctamente", "", "success");
        getAllOdontologos();
        const ultimoRegistroEnPaginaActual = paginaActualOdonto * cantidadRegistros;
        if (ultimoRegistroEnPaginaActual > totalPostsOdonto && paginaActualOdonto > 1) {
          // Retroceder a la página anterior si el último registro de la página actual fue eliminado
          setPaginaActualOdonto(paginaActualOdonto - 1);
        }
      } else {
        Swal.fire("Error", "", "error");
      }
    } catch (error) {
        console.log(error)
        if ((error.request.response).includes('Integrity constraint violation')) {
            Swal.fire("El odontólogo está siendo usado en alguna orden virtual", "", "error");
        }else{
            Swal.fire("Error al eliminar el registro", "", "error");
        }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (!loading) {
        getAllOdontologos();
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
            <div
              className="card-header text-center fs-5 fw-bolder"
              style={{ transition: "all 500ms" }}
            >
              Listado de Odontólogos
            </div>
            <div className="content_top_filters">
              <div
                id="productos_filter"
                className="dataTables_filter"
                style={{ width: "100%" }}
              >
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
                    getAllOdontologos();
                  }}
                >
                  Buscar
                </button>
              </div>
            </div>

            <div className="p-4 table-responsive odon_pacientes">
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
                      COD
                    </th>

                    <th scope="col" className="text-center">
                      Nombre
                    </th>

                    <th scope="col" className="text-center">
                      Apellidos
                    </th>

                    <th scope="col" className="text-center">
                      N°Documento
                    </th>

                    <th scope="col" className="text-center">
                      Correo
                    </th>
                  </tr>
                </thead>
                <tbody id="tableBody">
                  {loading == false ? (
                    filterDateOdontologos().map((odontolo) => (
                      <tr
                        key={odontolo.id}
                        onClick={() => {
                          id_odon(odontolo.id),
                            nombreOdon(
                              `${
                                odontolo.nombres ==
                                "No tiene un odontólogo asignado"
                                  ? ""
                                  : odontolo.nombres
                              } ${odontolo.apellido_p} ${odontolo.apellido_m}`
                            ),
                            copOdon(odontolo.cop == 0 ? "" : odontolo.cop),
                            emailOdon(
                              odontolo.correo == null ? "" : odontolo.correo
                            ),
                            celOdon(
                              odontolo.celular == null ? "" : odontolo.celular
                            ),
                            cerrar();
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <td className="text-center">{odontolo.id}</td>
                        <td className="text-center">{odontolo.cop}</td>
                        <td className="text-center">{odontolo.nombres}</td>
                        <td className="text-center">
                          {odontolo.apellido_p} {odontolo.apellido_m}
                        </td>
                        <td className="text-center">
                          {odontolo.numero_documento_paciente_odontologo}
                        </td>
                        <td className="text-center">{odontolo.correo}</td>
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
                {cargandoBusqueda2} Registros
              </div>

              <div
                className="dataTables_paginate paging_simple_numbers"
                id="productos_paginate"
              >
                <Paginacion
                  totalPosts={totalPostsOdonto}
                  cantidadRegistros={cantidadRegistros}
                  paginaActual={paginaActualOdonto}
                  setpaginaActual={setPaginaActualOdonto}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListaOdontologos;
