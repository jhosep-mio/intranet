import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Global } from "../../../../helper/Global";
import Swal from "sweetalert2";
import logo from "./../../../../assets/logos/logo.png";
import Button from "react-bootstrap/Button";

const EditarFactura = (props) => {
  let token = localStorage.getItem("token");

  const { id_orden, id_factura, getLista, cerrar } = props;
  const [tipo_documento, setTipoDocumento] = useState("");
  const [id_documento, setId_documento] = useState("");

  const [boton, setBoton] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const preguntar = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "¿Seguro que deseas editar el registro?",
      showDenyButton: true,
      confirmButtonText: "Editar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        updateClinica();
      }
    });
  };

  const updateClinica = async () => {
    setLoading(true)
    const data = new FormData();
    data.append("id_orden", id_orden);
    data.append("tipo_documento", tipo_documento);
    data.append("id_documento", id_documento);
    data.append("_method", "PUT");

    try {
      let respuesta = await axios.post(
        `${Global.url}/updateFactura/${id_factura}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (respuesta.data.status == "success") {
        Swal.fire("Editado correctamente", "", "success");
        getLista();
        cerrar();
      } else {
        Swal.fire("Error", "", "error");
      }
    } catch (error) {
        if (
            error.request.response.includes("The tipo documento field is required")
          ) {
            Swal.fire("Debe seleccionar un tipo de documento", "", "error");
          } else if (
            error.request.response.includes("The id documento field is required")
          ) {
            Swal.fire("El id de documento es requerido", "", "error");
          } else {
            Swal.fire("Error al actualizar el registro", "", "error");
          }
    }
    setLoading(false)
  };

  useEffect(() => {
    getClinicaOne();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getClinicaOne = async () => {
    const oneClinica = await axios.get(
      `${Global.url}/oneFactura/${id_factura}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setTipoDocumento(oneClinica.data.tipo_documento);
    setId_documento(oneClinica.data.id_documento);
    setLoading(false);
  };

  return (
    <div
      className="container col-md-12 mt-6"
      style={{ minHeight: "550px", display: "flex", alignItems: "center" }}
    >
      <div className="card">
        <div className="card-header fw-bold">Editar documento electrónico:</div>
        <div className="d-flex justify-content-between">
          <div className="mb-3 col-md-12 content_img">
            <img src={logo} alt="" />
          </div>
        </div>
        {loading == false ? (
          <form className="p-4 needs-validation">
            <div className="d-flex justify-content-center">
              <div className="mb-3 col-md-11">
                <div className="content_general mb-3 col-md-12">
                  <label className="label_title col-md-5">
                    Tipo de documento:{" "}
                  </label>
                  <select
                    value={tipo_documento}
                    type="text"
                    className="form-select2"
                    style={{ paddingLeft: "20px" }}
                    autoFocus
                    required
                    onChange={(e) => {
                      setTipoDocumento(e.target.value);
                    }}
                  >
                    {tipo_documento == 1 || tipo_documento == 0 ? (
                      <>
                        <option value="0">Factura electrónica</option>
                        <option value="1">Boleta electrónica</option>
                      </>
                    ) : (
                      <option value="2">Nota de crédito</option>
                    )}
                  </select>
                </div>

                <div className="content_general mb-3 col-md-12">
                  <label className="label_title col-md-4">ID DOCUMENTO: </label>
                  <input
                    className="form-control form-control3"
                    autoFocus
                    required
                    value={id_documento}
                    type="text"
                    onChange={(e) => setId_documento(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="d-flex gap-2 contentBtnRegistrar">
              <input type="hidden" name="oculto" value="1" />
              <Link
                className="btn btn-danger btnCancelar"
                onClick={() => {
                  cerrar();
                }}
              >
                Cancelar
              </Link>
              <input
                type="submit"
                className="btn btn-primary btnRegistrar"
                value="Grabar"
                onClick={preguntar}
              />
            </div>
          </form>
        ) : (
          <div className="dot-spinner dot-spinner4">
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
      </div>
    </div>
  );
};

export default EditarFactura;
