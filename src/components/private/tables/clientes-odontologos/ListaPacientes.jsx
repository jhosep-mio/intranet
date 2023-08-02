import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Global } from "../../../../helper/Global";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Swal from "sweetalert2";
import { BsChevronDoubleLeft, BsChevronDoubleRight } from "react-icons/bs";
import { Paginacion } from "../../shared/Paginacion";
import { get } from "jquery";

const ListaPacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [paginaActual, setpaginaActual] = useState(1);

  const [cantidadRegistros] = useState(4);
  const [cargandoBusqueda, setCargandoBusqueda] = useState(0);
  const [activo, setActivo] = useState(0);

  const navigate = useNavigate();

  let token = localStorage.getItem("token");

  const cambiarActivo = (id) => {
    setActivo(id);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (!loading) {
        getAllPacientes();
      }
    }
  };

  const getAllPacientes = async () => {
    setLoading(true);
    const data = new FormData();
    data.append("buscar", search);
    const request = await axios.post(`${Global.url}/buscarPacientes`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setPacientes(request.data);
    setCargandoBusqueda(request.data.length);
    setLoading(false);
  };

  const indexOfLastPost = paginaActual * cantidadRegistros;
  const indexOfFirstPost = indexOfLastPost - cantidadRegistros;
  let totalPosts = pacientes.length;

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
    return pacientes.slice(indexOfFirstPost, indexOfLastPost);
  };

  const onSeachChange = ({ target }) => {
    setpaginaActual(1);
    setSearch(target.value);
  };

  const preguntar = (id) => {
    Swal.fire({
      title: `¿Estás seguro de eliminar al paciente N° ${id}?`,
      showDenyButton: true,
      confirmButtonText: "Eliminar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        deletePaciente(id);
      }
    });
  };

  const deletePaciente = async (id) => {
    try {
      const resultado = await axios.delete(
        `${Global.url}/deletePaciente/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(resultado.data.status);

      if (resultado.data.status == "success") {
        Swal.fire("Registro eliminado correctamente", "", "success");
        getAllPacientes();
        const ultimoRegistroEnPaginaActual = paginaActual * cantidadRegistros;
        if (ultimoRegistroEnPaginaActual > totalPosts && paginaActual > 1) {
          // Retroceder a la página anterior si el último registro de la página actual fue eliminado
          setpaginaActual(paginaActual - 1);
        }
      } else {
        Swal.fire("Error al eliminar el registro", "", "error");
      }
    } catch (error) {
        if ((error.request.response).includes('Integrity constraint violation')) {
            Swal.fire("El paciente está siendo usado en alguna orden virtual", "", "error");
        }else{
            Swal.fire("Error al eliminar el registro", "", "error");
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
            <Link type="submit" className="btn btn-primary mb-3" to="agregar/0">
              {" "}
              <FontAwesomeIcon icon={faPlus} /> Registrar
            </Link>
          </div>
          {/* <!--=== TABLA PRODUCTOS ===--> */}
          <div className="card">
            <div
              className="card-header text-center fs-5 fw-bolder"
              style={{ transition: "all 500ms" }}
            >
              Listado de Pacientes
            </div>
            <div className="content_top_filters">
              <div className="content_top_filters__buttons">
                <button
                  onClick={() => {
                    navigate("/admin/clientes");
                  }}
                  style={{
                    backgroundColor: "#41326D",
                    color: "white",
                  }}
                >
                  Pacientes
                </button>
                <button
                  onClick={() => {
                    navigate("/admin/clientes/odontologos");
                  }}
                  style={{
                    backgroundColor: "transparent",
                    color: "#41326D",
                  }}
                >
                  Odontólogos
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
                    loading == false && getAllPacientes();
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
            </div>
            <div className="p-4 table-responsive odon_pacientes">
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
                      Apellidos
                    </th>

                    <th scope="col" className="text-center">
                      N°Documento
                    </th>

                    <th scope="col" className="text-center">
                      Correo
                    </th>

                    <th scope="col" className="text-center">
                      Número
                    </th>

                    {/* <!-- 3 --> */}
                    <th scope="col" className="text-center">
                      Opciones
                    </th>
                  </tr>
                </thead>
                <tbody id="tableBody">
                  {loading == false ? (
                    filterDate().map((paciente) => (
                      <tr key={paciente.id}>
                        <td className="text-center">{paciente.id}</td>

                        <td className="text-center">{paciente.nombres}</td>

                        <td className="text-center">
                          {paciente.apellido_p} {paciente.apellido_m}
                        </td>

                        <td className="text-center">
                          {paciente.numero_documento_paciente_odontologo}
                        </td>

                        <td className="text-center">{paciente.correo}</td>

                        <td className="text-center">{paciente.celular}</td>

                        {/* <!-- 9. Opciones --> */}
                        <td className="text-center">
                          <Link
                            className="text-success"
                            to={`/admin/clientes/editar/paciente/${paciente.id}`}
                          >
                            <FontAwesomeIcon icon={faPencil} />
                          </Link>
                          <button
                            className="text-danger btnEliminar"
                            onClick={() => {
                              preguntar(paciente.id);
                            }}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
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

export default ListaPacientes;
