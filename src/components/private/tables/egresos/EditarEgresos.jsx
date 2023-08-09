import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Global } from "../../../../helper/Global";
import Swal from "sweetalert2";
import logo from "./../../../../assets/logos/logo.png";

const EditarEgresos = () => {
  let token = localStorage.getItem("token");

  const [descripcion, setDescripcion] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [total, setTotal] = useState("");

  const [boton, setBoton] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();

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
    setLoading(true);
    const data = new FormData();
    data.append("descripcion", descripcion);
    data.append("cantidad", cantidad);
    data.append("total", total);
    data.append("_method", "PUT");

    try {
      let respuesta = await axios.post(
        `${Global.url}/upadateEgreso/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (respuesta.data.status == "success") {
        Swal.fire("Editado correctamente", "", "success");
        navigate("/admin/egresos");
      } else {
        Swal.fire("Error al editar la clínica", "", "error");
      }
    } catch (error) {
      console.log(error.request.response);
      Swal.fire("Error al editar la clínica", "", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    getClinicaOne();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getClinicaOne = async () => {
    const oneClinica = await axios.get(`${Global.url}/oneEgreso/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setDescripcion(oneClinica.data.descripcion);
    setCantidad(oneClinica.data.cantidad);
    setTotal(oneClinica.data.total);
    setLoading(false);
  };

  return (
    <div className="container col-md-10 mt-6">
      <div className="card">
        <div className="card-header fw-bold">Editar Egreso:</div>
        <div className="d-flex justify-content-between">
          <div className="mb-3 col-md-12 content_img">
            <img src={logo} alt="" />
          </div>
        </div>
        {loading == false ? (
          <form className="p-4 needs-validation" onSubmit={preguntar}>
            <div className="d-flex justify-content-center">
              <div className="mb-3 col-md-11">
                <div className="content_general mb-3 col-md-12">
                  <div className="mb-3 col-md-12 div_conten">
                    <label className="label_title">Descripción: </label>
                    <textarea
                      name=""
                      id=""
                      cols="0"
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
                value="Grabar"
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

export default EditarEgresos;
