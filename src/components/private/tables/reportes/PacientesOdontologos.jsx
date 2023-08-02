import React, { useEffect, useState } from "react";
import { Global } from "../../../../helper/Global";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Swal from "sweetalert2";
import { Paginacion } from "../../shared/Paginacion";
import { RiFileExcel2Fill } from "react-icons/ri";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
export const PacientesOdontologos = () => {
  const [clinicas, setClinicas] = useState([]);
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
      quitarAcentos(cate.nombre.toLowerCase()).includes(
        quitarAcentos(search.toLowerCase())
      )
    );
    setCargandoBusqueda(filter2.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    getAllClinicas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllClinicas = async () => {
    setLoading(true);

    const request = await axios.get(`${Global.url}/reporteOdontologosMes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(request);
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
          `${Global.url}/reporteOdontologosFechas`,
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
      const request = await axios.get(`${Global.url}/reporteOdontologos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setpaginaActual(1);
      setClinicas(request.data);
      setCargandoBusqueda(request.data.length);
    }
    setLoading(false);
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
                justifyContent: "center",
                alignItems: "center",
                gap: '20px'
              }}
            >
              <div className="content_excel">
                <RiFileExcel2Fill />
                <ReactHTMLTableToExcel
                  id="table-xls-button"
                  className="download"
                  table="productos2"
                  filename="Reporte_pacientes_enviados_por_odontologos"
                  sheet="sheet1"
                  buttonText="Excel"
                />
              </div>
              Reporte sobre cantidad de pacientes enviados por Odontologos
            </div>
            <div className="p-4 table-responsive">
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

              <Table
                id="productos"
                className="table align-middle table-hover display"
              >
                <thead className="table-light">
                  <tr>
                    {/* <!-- 1 --> */}
                    <th scope="col" className="text-center">
                      Clinica
                    </th>
                    {/* <!-- 2 --> */}
                    <th scope="col" className="text-center">
                      Odontologo
                    </th>

                    <th scope="col" className="text-center">
                      Celular
                    </th>

                    <th scope="col" className="text-center">
                      Pacientes enviados
                    </th>

                    <th scope="col" className="text-center">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody id="tableBody">
                  {loading == false ? (
                    filterDate().map((clinica) => (
                      <tr key={clinica.id}>
                        <td
                          className="text-truncate trucate_text"
                          style={{ textAlign: "center" }}
                        >
                          {clinica.nombre}
                        </td>

                        <td
                          className="text-center"
                          style={{ textAlign: "center" }}
                        >
                          {clinica.odontologo} {clinica.apellido_p}{" "}
                          {clinica.apellido_m}
                        </td>

                        <td className="text-center">{clinica.celular}</td>

                        <td className="text-center">{clinica.ordenes_count}</td>

                        <td className="text-center">{clinica.mes_creacion}</td>
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

              <Table
                id="productos2"
                style={{display: 'none'}}
                className="table align-middle table-hover display"
              >
                <thead className="table-light">
                  <tr>
                    {/* <!-- 1 --> */}
                    <th scope="col" className="text-center">
                      Clinica
                    </th>
                    {/* <!-- 2 --> */}
                    <th scope="col" className="text-center">
                      Odontologo
                    </th>

                    <th scope="col" className="text-center">
                      Celular
                    </th>

                    <th scope="col" className="text-center">
                      Pacientes enviados
                    </th>

                    <th scope="col" className="text-center">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody id="tableBody">
                  {loading == false ? (
                    clinicas.map((clinica) => (
                      <tr key={clinica.id}>
                        <td
                          className="text-truncate trucate_text"
                          style={{ textAlign: "center" }}
                        >
                          {clinica.nombre}
                        </td>

                        <td
                          className="text-center"
                          style={{ textAlign: "center" }}
                        >
                          {clinica.odontologo} {clinica.apellido_p}{" "}
                          {clinica.apellido_m}
                        </td>

                        <td className="text-center">{clinica.celular}</td>

                        <td className="text-center">{clinica.ordenes_count}</td>

                        <td className="text-center">{clinica.mes_creacion}</td>
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
