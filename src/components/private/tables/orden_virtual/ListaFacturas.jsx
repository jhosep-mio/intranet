import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Global } from "../../../../helper/Global";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Swal from "sweetalert2";
import { BsCloudUploadFill } from "react-icons/bs";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import EditarFactura from "./EditarFactura";
import { Paginacion } from "../../shared/Paginacion";

const ListaFacturas = (props) => {
  const { id_orden, cerrar } = props;

  const [ordenes, setOrdenes] = useState([]);
  const [itemPagination, setItemPagination] = useState([]);
  const [servicios, setservicios] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [paginaActual, setpaginaActual] = useState(1);
  const [cantidadRegistros] = useState(3);
  const [cargandoBusqueda, setCargandoBusqueda] = useState(0);
  const [orden_id, setOrden_id] = useState("");

  const [show6, setShow6] = useState(false);
  const handleClose6 = () => setShow6(false);
  const handleShow6 = () => setShow6(true);

  let token = localStorage.getItem("token");

  useEffect(() => {
    const filter2 = ordenes.filter((odo) => {
      return (
        quitarAcentos(
          `${odo.paciente} ${odo.paciente_apellido_p} ${odo.paciente_apellido_m}`.toLowerCase()
        ).includes(quitarAcentos(search.toLowerCase())) ||
        quitarAcentos(
          `${odo.odontologo} ${odo.odontologo_apellido_p} ${odo.odontologo_apellido_m}`.toLowerCase()
        ).includes(quitarAcentos(search.toLowerCase())) ||
        quitarAcentos(new Date(odo.created_at).toLocaleDateString()).includes(
          quitarAcentos(search.toLowerCase())
        ) ||
        quitarAcentos(
          odo.estado == 0
            ? "creado"
            : odo.estado == 1
            ? "pendiente"
            : odo.estado == 2
            ? "Realizado"
            : ""
        ).includes(quitarAcentos(search.toLowerCase())) ||
        odo.copOdontologo.toString().includes(search)
      );
    });

    setCargandoBusqueda(filter2.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    getAllOrdenes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllOrdenes = async () => {
    setLoading(true);

    const request = await axios.get(`${Global.url}/allFacturasID/${id_orden}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setOrdenes(request.data);
    setCargandoBusqueda(request.data.length);
    setLoading(false);
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

  const filterDate = () => {
    if (search.length == 0) {
      let orden = ordenes.slice(indexOfFirstPost, indexOfLastPost);
      return orden;
    }

    const filter = ordenes.filter((odo) => {
      return (
        quitarAcentos(
          `${odo.paciente} ${odo.paciente_apellido_p} ${odo.paciente_apellido_m}`.toLowerCase()
        ).includes(quitarAcentos(search.toLowerCase())) ||
        quitarAcentos(
          `${odo.odontologo} ${odo.odontologo_apellido_p} ${odo.odontologo_apellido_m}`.toLowerCase()
        ).includes(quitarAcentos(search.toLowerCase())) ||
        quitarAcentos(new Date(odo.created_at).toLocaleDateString()).includes(
          quitarAcentos(search.toLowerCase())
        ) ||
        quitarAcentos(
          odo.estado == 0
            ? "creado"
            : odo.estado == 1
            ? "pendiente"
            : odo.estado == 2
            ? "realizado"
            : ""
        ).includes(quitarAcentos(search.toLowerCase())) ||
        odo.copOdontologo.toString().includes(search)
      );
    });
    totalPosts = filter.length;
    return filter.slice(indexOfFirstPost, indexOfLastPost);
  };

  const abrirModalSHow = (ordenid) => {
    setOrden_id(ordenid);
    setShow6(true);
  };


  return (
    <div className="container mt-12 ms-5-auto" style={{ padding: "0" }}>
      <div className="row justify-content-center">
        {/* TAMAÑO DE LA TABLA WIDTH  */}
        <div className="col-md-12" style={{ padding: "0" }}>
          {/* <!--=== TABLA PRODUCTOS ===--> */}
          <div className="card">
            <div className="card-header text-center fs-5 fw-bolder">
              Listado de Facturas
            </div>
            <div className="p-4 table-responsive">
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
                      Tipo de documento
                    </th>

                    <th scope="col" className="text-center">
                      ID documento electrónico
                    </th>

                    <th scope="col" className="text-center">
                      Opciones
                    </th>
                  </tr>
                </thead>
                <tbody id="tableBody">
                  {loading == false ? (
                    filterDate().map((orden) =>
                      id_orden == orden.id_orden ? (
                        <tr key={orden.id}>
                          <td className="text-center">{orden.estado}</td>

                          <td
                            className="text-center"
                            style={{ maxWidth: "100px" }}
                          >
                            {orden.tipo_documento == 0
                              ? "Factura electrónica"
                              : orden.tipo_documento == 1
                              ? "Boleta electrónica"
                              : orden.tipo_documento == 2
                              ? "Nota de credito electrónica"
                              : ""}
                          </td>
                          <td className="text-center">{orden.id_documento}</td>
                          {/* <!-- 9. Opciones --> */}
                          <td className="text-center">
                            <Link
                              className="text-success"
                              onClick={() => {
                                abrirModalSHow(orden.id);
                              }}
                            >
                              <FontAwesomeIcon icon={faPencil} />
                            </Link>
                          </td>
                        </tr>
                      ) : (
                        ""
                      )
                    )
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
                  <Modal
                    show={show6}
                    onHide={handleClose6}
                    animation={false}
                    className="buscarOdontologo"
                  >
                    <Modal.Body>
                      <EditarFactura
                        cerrar={handleClose6}
                        id_orden={id_orden}
                        id_factura={orden_id}
                        getLista={getAllOrdenes}
                      />
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleClose6}>
                        Cerrar
                      </Button>
                    </Modal.Footer>
                  </Modal>
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

export default ListaFacturas;
