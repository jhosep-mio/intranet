import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Global } from "../../../../helper/Global";
import Swal from "sweetalert2";
import logo from "./../../../../assets/logos/logo.png";
import { LoadingSmall } from "../../shared/LoadingSmall";

const EditarServicio = () => {
  let token = localStorage.getItem("token");

  const [nombre, setNombre] = useState("");
  const [impresion, setImpresion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [insumoUsb, setInsumoUsb] = useState(0);

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
        updateServicio();
      }
    });
  };

  const updateServicio = async () => {
    setLoading(true);
    const data = new FormData();
    data.append("nombre", nombre);
    data.append("impreso", impresion);
    data.append("insumoUSB", insumoUsb);
    data.append("_method", "PUT");

    try {
      let respuesta = await axios.post(
        `${Global.url}/updateServicio/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (respuesta.data.status == "success") {
        Swal.fire("Actualización Correcta", "", "success");
        navigate(`/admin/tipos-examen`);
      } else {
        Swal.fire("Error al realizar la edicion", "", "error");
      }
    } catch (error) {
      if (
        error.request.response.includes(
          `Duplicate entry '${nombre}' for key 'catservicios_nombre_unique'`
        )
      ) {
        Swal.fire("Nombre ya registrado", "", "error");
      } else if (error.request.response.includes("nombre")) {
        Swal.fire("Nombre inválido", "", "error");
      } else {
        console.log(error.request.response);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    getClinicaOne();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getClinicaOne = async () => {
    setLoading(true);
    const oneServicio = await axios.get(`${Global.url}/oneServicio/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setNombre(oneServicio.data.nombre);
    setImpresion(oneServicio.data.impreso);
    setInsumoUsb(oneServicio.data.insumoUSB);
    setLoading(false);
  };

  return (
    <div className="container col-md-10 mt-6">
      {!loading ? (
        <div className="card">
          <div className="card-header fw-bold">Editar Tipo de Exámen:</div>
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
                    <label className="label_title">Nombre: </label>
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
                    <label className="label_title col-md-5">
                      ¿Desea que aparezca la opcion de impresión?:{" "}
                    </label>
                    <select
                      value={impresion}
                      type="text"
                      className=" form-select2"
                      autoFocus
                      required
                      onChange={(e) => {
                        setImpresion(e.target.value);
                      }}
                    >
                      <option value="0">No</option>
                      <option value="1">Si</option>
                    </select>
                  </div>
                </div>
                {id == 1 && (
                  <div className="content_general mb-3 col-md-12">
                    <div className="mb-3 col-md-12 div_conten">
                      <label className="label_title col-md-5">
                        Insumos USB:{" "}
                      </label>
                      <input
                        className="form-control form-control3"
                        autoFocus
                        value={insumoUsb}
                        type="number"
                        step="0.01"
                        onChange={(e) => setInsumoUsb(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="d-flex gap-2 contentBtnRegistrar">
              <input type="hidden" name="oculto" value="1" />
              <Link
                to="/admin/tipos-examen"
                className="btn btn-danger btnCancelar"
              >
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

export default EditarServicio;
