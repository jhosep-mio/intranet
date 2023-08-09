import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Global } from "../../../../helper/Global";
import Swal from "sweetalert2";
import logo from "./../../../../assets/logos/logo.png";
import { LoadingSmall } from "../../shared/LoadingSmall";
import { getUsuarios } from "../../shared/getUsuarios";

const EditarClinica = () => {
  let token = localStorage.getItem("token");

  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [referencia, setReferencia] = useState("");
  const [telefono, setTelefono] = useState("");
  const [celular, setCelular] = useState("");
  const [usuarios, setUsuarios] = useState([])

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
    data.append("nombre", nombre);
    data.append("direccion", direccion);
    data.append("referencia", referencia);
    data.append("telefono", telefono);
    data.append("celular", celular == null ? "" : celular);
    data.append("_method", "PUT");

    try {
      let respuesta = await axios.post(
        `${Global.url}/updateClinica/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (respuesta.data.status == "success") {
        Swal.fire("Editado correctamente", "", "success");
        navigate("/admin/clinicas");
      } else {
        Swal.fire("Error al editar la clínica", "", "error");
      }
    } catch (error) {
      if (
        error.request.response.includes(
          `Duplicate entry '${telefono}' for key 'telefono'`
        )
      ) {
        Swal.fire("Teléfono ya registrado", "", "error");
      } else if (
        error.request.response.includes(
          `Duplicate entry '${celular}' for key 'celular'`
        )
      ) {
        Swal.fire("Celular ya registrado", "", "error");
      } else if (
        error.request.response.includes("The telefono format is invalid")
      ) {
        Swal.fire("Teléfono inválido", "", "error");
      } else if (error.request.response.includes("The celular must") || error.request.response.includes("The celular format is invalid") ) {
        Swal.fire("Celular inválido", "", "error");
      } else {
        Swal.fire("Error no encontrado", "", "error");
        console.log(error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    getUsuarios({setUsuarios})
    getClinicaOne();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getClinicaOne = async () => {
    const oneClinica = await axios.get(`${Global.url}/oneClinica/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setNombre(oneClinica.data.nombre);
    setDireccion(oneClinica.data.direccion);
    setReferencia(oneClinica.data.referencia);
    setTelefono(
      oneClinica.data.telefono == null ? "" : oneClinica.data.telefono
    );
    setCelular(oneClinica.data.celular);
    setLoading(false);
  };



  return (
    <div className="container col-md-10 mt-6">
      {!loading ? (
        <div className="card">
          <div className="card-header fw-bold">Editar Clínica:</div>
          <div className="d-flex justify-content-between">
            <div className="mb-3 col-md-12 content_img">
              <img src={logo} alt="" />
            </div>
          </div>
          <form className="p-4 needs-validation" onSubmit={preguntar}>
            <div className="d-flex justify-content-center">
              <div className="mb-3 col-md-11">
                <div className="content_general mb-3 col-md-12">
                  <div className="mb-3 col-md-12 div_conten">
                    <label className="label_title">Nombres: </label>
                    <input
                      className="form-control form-control3"
                      autoFocus
                      required
                      value={nombre}
                      type="text"
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </div>
                </div>

                <div className="content_general mb-3 col-md-12">
                  <div className="mb-3 col-md-12 div_conten">
                    <label className="label_title">Dirección: </label>
                    <input
                      className="form-control form-control3"
                      value={direccion}
                      type="text"
                      onChange={(e) => setDireccion(e.target.value)}
                    />
                  </div>
                </div>

                <div className="content_general mb-3 col-md-12">
                  <div className="mb-3 col-md-12 div_conten">
                    <label className="label_title">Referencia: </label>
                    <input
                      className="form-control form-control3"
                      autoFocus
                      value={referencia}
                      type="text"
                      onChange={(e) => setReferencia(e.target.value)}
                    />
                  </div>
                </div>

                <div className="content_general mb-3 col-md-12">
                  <div className="mb-3 col-md-6 div_conten2">
                    <label className="label_title">Télefono: </label>
                    <input
                      className="form-control form-control3"
                      autoFocus
                      value={telefono}
                      onChange={(e) => {
                        setTelefono(e.target.value);
                      }}
                      type="text"
                    />
                  </div>
                  <div className="mb-3 col-md-6 div_conten">
                    <label className="label_title">Celular: </label>
                    <input
                      className="form-control form-control3"
                      autoFocus
                      value={celular}
                      onChange={(e) => {
                        setCelular(e.target.value);
                      }}
                      type="text"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex gap-2 contentBtnRegistrar">
              <input type="hidden" name="oculto" value="1" />
              <Link to="/admin/clinicas" className="btn btn-danger btnCancelar">
                Cancelar
              </Link>
              <input
                type="submit"
                className="btn btn-primary btnRegistrar"
                value="Grabar"
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

export default EditarClinica;
