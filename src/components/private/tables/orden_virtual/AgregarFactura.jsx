import React, { useState } from "react";
import axios from "axios";
import { Global } from "../../../../helper/Global";
import Swal from "sweetalert2";
import logo from "./../../../../assets/logos/logo.png";
import { LoadingSmall } from "../../shared/LoadingSmall";
import useAuth from "../../../../hooks/useAuth";

const AgregarFactura = (props) => {
  const {auth} = useAuth();
  const { id_orden, cerrar, setEstadoG } = props;
  const [tipo_documento, setTipoDocumento] = useState("");
  const [id_documento, setId_documento] = useState("");
  const [loading, setLoading] = useState(false);
  let token = localStorage.getItem("token");

  const upadteModificador = async () => {
    const data = new FormData();

    data.append('id_modificacion', auth.id);
    data.append('_method', 'PUT');

    const resultado = await axios.post(`${Global.url}/updateNewToModifcate/${id_orden}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(resultado)
}

  const saveClinica = async (e) => {
    setLoading(true);
    e.preventDefault();
    let token = localStorage.getItem("token");

    const data = new FormData();
    data.append("id_orden", id_orden);
    data.append("tipo_documento", tipo_documento);
    data.append("id_documento", id_documento);

    try {
      let respuesta = await axios.post(`${Global.url}/saveFactura`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (respuesta.data.status == "success") {
        const data2 = new FormData();
        data2.append("estado", 1);
        data2.append("_method", "PUT");
        try {
          let respuesta2 = await axios.post(
            `${Global.url}/updateOrdenFactura/${id_orden}`,
            data2,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (respuesta2.data.status == "success") {
            setTipoDocumento("");
            setId_documento("");
            upadteModificador()
            setEstadoG(1);
            cerrar();
            Swal.fire("Agregado Correctamente", "", "success");
          } else {
            Swal.fire("Error al agregar el registro", "", "error");
          }
        } catch (error) {
          console.log(error);
          Swal.fire("Error al agregar el registro", "", "error");
        }
      } else {
        Swal.fire("Error al agregar el registro", "", "error");
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
        Swal.fire("Error al agregar el registro", "", "error");
      }
    }
    setLoading(false);
  };

  return (
    <div className="container col-md-12 mt-6" style={{ padding:'0', minHeight: "250px" }}>
      {!loading ? (
        <div className="card">
          <div className="card-header fw-bold">
            Registrar Documento electrónico:
          </div>
          <form className="p-4 needs-validation" style={{ minHeight: "250px" }}>
            <div className="d-flex justify-content-between">
              <div className="mb-3 col-md-12 content_img">
                <img src={logo} alt="" />
              </div>
            </div>

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
                    <option value="">Seleccionar</option>
                    <option value="0">Factura electrónica</option>
                    <option value="1">Boleta electrónica</option>
                  </select>
                </div>

                <div className="content_general mb-3 col-md-12">
                  <div className="mb-3 col-md-12 div_conten">
                    <label className="label_title col-md-4">
                      ID DOCUMENTO:{" "}
                    </label>
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
            </div>
            <div className="d-flex gap-2 contentBtnRegistrar">
              <input type="hidden" name="oculto" value="1" />
              <input
                type="button"
                className="btn btn-primary btnRegistrar"
                value="Registrar"
                onClick={saveClinica}
              />
            </div>
          </form>
        </div>
      ) : (
        <LoadingSmall />
      )}
    </div>
  );
};

export default AgregarFactura;
