import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Global } from "../../../../helper/Global";
import Swal from "sweetalert2";
import logo from "./../../../../assets/logos/logo.png";

const AgregarEgresos = () => {
  const [descripcion, setDescripcion] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [total, setTotal] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const saveClinica = async (e) => {
    setLoading(true);
    e.preventDefault();
    let token = localStorage.getItem("token");

    const data = new FormData();
    data.append("descripcion", descripcion);
    data.append("cantidad", cantidad);
    data.append("total", total);

    try {
      let respuesta = await axios.post(`${Global.url}/saveEgresos`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (respuesta.data.status == "success") {
        Swal.fire("Agregado correctamente", "", "success");
        navigate("/admin/egresos");
      } else {
        Swal.fire("Error al agregar el registro", "", "error");
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error al agregar el registro", "", "error");
    }
    setLoading(false);
  };

  return (
    <div className="container col-md-8 mt-6">
      <div className="card">
        <div className="card-header fw-bold">Agregar Egreso:</div>
        {!loading ? (
          <form className="p-4 needs-validation" onSubmit={saveClinica}>
            <div className="d-flex justify-content-between">
              <div className="mb-3 col-md-12 content_img">
                <img src={logo} alt="" />
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <div className="mb-3 col-md-11">
                <div className="content_general mb-3 col-md-12">
                  <div className="mb-3 col-md-12 div_conten">
                    <label className="label_title">Descripción: </label>
                    <textarea
                      name=""
                      id=""
                      cols="1"
                      rows="1"
                      className="form-control3"
                      autoFocus
                      required
                      style={{ width: "100%" }}
                      value={descripcion}
                      type="text"
                      onChange={(e) => setDescripcion(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                <div className="content_general mb-3 col-md-12">
                  <div className="mb-3 col-md-6 div_conten2">
                    <label className="label_title">Cantidad: </label>
                    <input
                      className="form-control form-control3"
                      autoFocus
                      required
                      value={cantidad}
                      type="number"
                      onChange={(e) => setCantidad(e.target.value)}
                    />
                  </div>
                  <div className="mb-3 col-md-6 div_conten">
                    <label className="label_title">Total: </label>
                    <input
                      className="form-control form-control3"
                      autoFocus
                      value={total}
                      required
                      type="number"
                      step="0.01"
                      onChange={(e) => setTotal(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex gap-2 contentBtnRegistrar">
              <input type="hidden" name="oculto" value="1" />
              <Link to="/admin/egresos" className="btn btn-danger btnCancelar">
                Cancelar
              </Link>
              <input
                type="submit"
                className="btn btn-primary btnRegistrar"
                value="Registrar"
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

export default AgregarEgresos;
