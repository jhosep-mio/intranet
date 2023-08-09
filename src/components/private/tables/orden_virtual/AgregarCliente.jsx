import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Global } from "../../../../helper/Global";
import Swal from "sweetalert2";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./../../../../styles/_especificos.scss";
import logo from "./../../../../assets/logos/logo.png";
import ListaClinica from "./ListaClinica";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import { LoadingSmall } from "../../shared/LoadingSmall";

const AgregarCliente = (props) => {
  const { cerrar } = props;
  //GENERAL
  const id_rol = 0;
  let token = localStorage.getItem("token");
  const [estado, setEstado] = useState(id_rol == 0 ? false : true);
  const [validarEdad, setValidarEdad] = useState(false);
  const [clinicas, setClinicas] = useState([]);
  const [search, setSearch] = useState("");

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  // PACIENTES
  const [rol, setRol] = useState(id_rol);
  const [nombres, setNombres] = useState("");
  const [apellido_p, setApellido_p] = useState("");
  const [apellido_m, setApellido_m] = useState("");
  const [fecha, setFecha] = useState("");
  const [fechaenviar, setFechaEnviar] = useState("");

  const [nombre_poderado, setNombre_poderado] = useState("");
  const [tipo_documento_apoderado, setTipo_documento_apoderado] = useState(0);
  const [documento_apoderado, setDocumento_apoderado] = useState("");

  const [
    tipo_documento_paciente_odontologo,
    setTipo_documento_paciente_odontologo,
  ] = useState(0);
  const [
    numero_documento_paciente_odontologo,
    setNumero_documento_paciente_odontologo,
  ] = useState("");
  const [celular, setCelular] = useState("");
  const [correo, setCorreo] = useState("");
  const [loading, setLoading] = useState(false)
  const [generoPaciente, setGeneroPaciente] = useState(0);
  const [embarazada, setEmbarazada] = useState(0);

  const [enfermedades, setEnfermedades] = useState("");
  const [discapacidades, setDiscapacidades] = useState("");
  const [paciente_especial, setPaciente_especial] = useState("");
  const [genero, setGenero] = useState(false);

  const navigate = useNavigate();

  const identificarCliente = (event) => {
    setRol(event.target.value);
    setEstado(event.target.value == 1 ? true : false);
    setGeneroPaciente(0);
    setGenero(false);
  };

  const indentificarGenero = (event) => {
    setGeneroPaciente(event.target.value);
    setGenero(event.target.value == 1 ? true : false);
  };

  const savePaciente = async (e) => {
    setLoading(true)
    e.preventDefault();
    if (fecha) {
      const data = new FormData();
      data.append("id_rol", rol);
      data.append("nombres", nombres);
      data.append("apellido_p", apellido_p);
      data.append("apellido_m", apellido_m);
      data.append("f_nacimiento", fecha);
      data.append("nombre_apoderado", nombre_poderado);
      data.append("tipo_documento_apoderado", tipo_documento_apoderado);
      data.append("documento_apoderado", documento_apoderado);
      data.append(
        "tipo_documento_paciente_odontologo",
        tipo_documento_paciente_odontologo
      );
      data.append(
        "numero_documento_paciente_odontologo",
        numero_documento_paciente_odontologo
      );
      data.append("celular", celular);
      data.append("correo", correo);
      data.append("genero", generoPaciente);
      data.append("embarazada", embarazada);
      data.append("enfermedades", enfermedades);
      data.append("discapacidades", discapacidades);
      data.append("paciente_especial", paciente_especial);

      try {
        let respuesta = await axios.post(`${Global.url}/savePaciente`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (respuesta.data.status == "success") {
            localStorage.removeItem("paciente");
            localStorage.setItem(
              "paciente",
              JSON.stringify(respuesta.data.paciente)
            );
            cerrar();
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Paciente Encontrado",
              showConfirmButton: false,
              timer: 1500,
            });
            setTimeout(() => {
              navigate("/admin/ordenVirtual/agregar");
            }, 1500);
        } else {
          Swal.fire("Error al agregar el registro", "", "error");
        }
      } catch (error) {
        if (
          error.request.response.includes(
            "El tipo de documento y numero de documento ya estan registrados para otro cliente"
          )
        ) {
          Swal.fire("Documento ya registrado", "", "error");
        } else if (
          error.request.response.includes(
            `Duplicate entry '${celular}' for key 'celular'`
          )
        ) {
          Swal.fire("Celular ya registrado", "", "error");
        } else if (
          error.request.response.includes(
            `Duplicate entry '${correo}' for key 'correo'`
          )
        ) {
          Swal.fire("Correo ya registrado", "", "error");
        } else if (
          error.request.response.includes("The nombres format is invalid")
        ) {
          Swal.fire("Nombre inválido", "", "error");
        } else if (
          error.request.response.includes("The apellido p format is invalid")
        ) {
          Swal.fire("Apellido paterno inválido", "", "error");
        } else if (
          error.request.response.includes("The apellido m format is invalid")
        ) {
          Swal.fire("Apellido materno inválido", "", "error");
        } else if (
          error.request.response.includes("The celular must be 9 digits")
        ) {
          Swal.fire("El celular debe tener 9 dígitos", "", "error");
        } else {
          Swal.fire("Error no encontrado", "", "error");
        }
      }
    } else {
      Swal.fire("Debe colocar la fecha de nacimiento", "", "warning");
    }
    setLoading(false)
  };

  const getClinicas = async () => {
    const request = await axios.get(`${Global.url}/allClinicas`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setClinicas(request.data);
  };

  const onSeachChange = ({ target }) => {
    setSearch(target.value);
  };

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
      const clini = clinicas;
      return clini.slice(0, 7);
    }

    const filter = clinicas.filter((cate) => {
      return quitarAcentos(cate.nombre.toLowerCase()).includes(
        quitarAcentos(search.toLowerCase())
      );
    });

    return filter.slice(0, 7);
  };

  useEffect(() => {
    getClinicas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getClinicas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  useEffect(() => {
    filterDate();
  }, [search]);

  const handleChange = (selectedDate) => {
    if (selectedDate === null) {
      // Si se ha borrado la fecha, realiza las acciones necesarias
      setFecha(null);
      setValidarEdad(false);
      return;
    }

    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const mon = selectedDate.getMonth().toString();

      // Verificar si el año tiene 4 dígitos
      if (year.toString().length > 4) {
        console.log("year:", year);

        Swal.fire("Fecha inválida", "", "warning");
        setValidarEdad(false);
        return;
      }

      const today = new Date();
      // Calcular diferencia en años
      const diffInYears = Math.floor(
        (today - selectedDate) / (365.25 * 24 * 60 * 60 * 1000)
      );

      // Verificar si es mayor de edad
      if (diffInYears < 18 && diffInYears >= 0) {
        setValidarEdad(true);
      } else {
        setValidarEdad(false);
      }

      setFecha(selectedDate);
    }
  };

  const minYear = 1900;
  const maxYear = new Date().getFullYear();

  return (
    <div className="container col-md-12 mt-0" style={{ padding: "0", minHeight: '250px'}}>
      {!loading ?
      <div className="card">
          <>
            <div className="card-header fw-bold">Agregar - Paciente:</div>

            <form
              className="p-4 needs-validation d-flex flex-column gap-3"
              onSubmit={savePaciente}
            >
              <div className="d-flex justify-content-center" style={{overflowY: 'scroll', maxHeight: '470px'}}>
                <div className="mb-3 col-md-11">
                  <div className="content_general mb-3 col-md-12">
                    <div className="mb-3 col-md-12 div_conten">
                      <label className="label_title">Nombres: </label>
                      <input
                        className="form-control form-control3"
                        autoFocus
                        required
                        value={nombres}
                        onChange={(e) => {
                          setNombres(e.target.value);
                        }}
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="content_general mb-3 col-md-12">
                    <div className="mb-3 col-md-6 div_conten2 ">
                      <label className="label_title col-md-5">
                        Apellido Paterno:{" "}
                      </label>
                      <input
                        className="form-control form-control3"
                        autoFocus
                        required
                        value={apellido_p}
                        onChange={(e) => {
                          setApellido_p(e.target.value);
                        }}
                        type="text"
                      />
                    </div>
                    <div className="mb-3 col-md-6 div_conten">
                      <label className="label_title col-md-5">
                        Apellido materno:{" "}
                      </label>
                      <input
                        className="form-control form-control3"
                        autoFocus
                        required
                        value={apellido_m}
                        onChange={(e) => {
                          setApellido_m(e.target.value);
                        }}
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="content_general mb-3 col-md-12">
                    <div className="mb-3 col-md-6 div_conten2 ">
                      <label className="label_title col-md-5">
                        Fecha de nacimiento:{" "}
                      </label>
                      <DatePicker
                        className="form-control form-control3"
                        selected={fecha}
                        value={fecha}
                        onChange={handleChange}
                        dateFormat="dd/MM/yyyy"
                        locale={es}
                        showYearDropdown
                        scrollableYearDropdown
                        minDate={new Date(minYear, 0, 1)}
                        maxDate={new Date(maxYear, 11, 31)}
                        yearDropdownItemNumber={100}
                        yearDropdownScrollable
                        isClearable={true}
                      />
                    </div>
                    <div className="mb-3 col-md-6 div_conten">
                      <label className="label_title col-md-5">Celular:</label>
                      <input
                        className="form-control form-control3"
                        autoFocus
                        required
                        value={celular}
                        onChange={(e) => {
                          setCelular(e.target.value);
                        }}
                        type="number"
                      />
                    </div>
                  </div>
                  {validarEdad && (
                    <div className="contenedor_apoderado_">
                      <label className="form-label titulos_labels">
                        INFORMACIÓN DEL APODERADO
                      </label>
                      <div className="content_general mb-3 col-md-12">
                        <div className="mb-3 col-md-12 div_conten2 ">
                          <label className="label_title col-md-5">
                            Nombres del apoderado:
                          </label>
                          <input
                            className="form-control form-control3"
                            required
                            value={nombre_poderado}
                            onChange={(e) => {
                              setNombre_poderado(e.target.value);
                            }}
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="content_general mb-3 col-md-12">
                        <div className="mb-3 col-md-6 div_conten2">
                          <label className="label_title col-md-5">
                            Tipo de documento:{" "}
                          </label>
                          <select
                            value={tipo_documento_apoderado}
                            type="text"
                            className="form-select2"
                            required
                            onChange={(e) => {
                              setTipo_documento_apoderado(e.target.value);
                            }}
                          >
                            <option value="0">DNI</option>
                            <option value="1">RUC</option>
                            <option value="2">Pasaporte</option>
                            <option value="3">Carnet de Extranjería</option>
                          </select>
                        </div>

                        <div className="mb-3 col-md-6 div_conten">
                          <label className="label_title col-md-5">
                            Número de documento:
                          </label>
                          <input
                            className="form-control form-control3"
                            required
                            value={documento_apoderado}
                            onChange={(e) => {
                              setDocumento_apoderado(e.target.value);
                            }}
                            type="text"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="content_general mb-3 col-md-12">
                    <div className="mb-3 col-md-6 div_conten2">
                      <label className="label_title col-md-5">
                        Tipo de documento:{" "}
                      </label>
                      <select
                        value={tipo_documento_paciente_odontologo}
                        type="text"
                        className="form-select2"
                        autoFocus
                        required
                        onChange={(e) => {
                          setTipo_documento_paciente_odontologo(e.target.value);
                        }}
                      >
                        <option value="0">DNI</option>
                        <option value="1">RUC</option>
                        <option value="2">Pasaporte</option>
                        <option value="3">Carnet de Extranjería</option>
                      </select>
                    </div>
                    <div className="mb-3 col-md-6 div_conten">
                      <label className="label_title col-md-5">
                        Número de documento:
                      </label>
                      <input
                        className="form-control form-control3"
                        autoFocus
                        required
                        value={numero_documento_paciente_odontologo}
                        onChange={(e) => {
                          setNumero_documento_paciente_odontologo(
                            e.target.value
                          );
                        }}
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="content_general mb-3 col-md-12">
                    <div className="mb-3 col-md-4 div_conten2">
                      <label className="label_title col-md-5">Correo:</label>
                      <input
                        className="form-control form-control3"
                        autoFocus
                        required
                        value={correo}
                        onChange={(e) => {
                          setCorreo(e.target.value);
                        }}
                        type="email"
                      />
                    </div>
                    <div className="mb-3 col-md-4 div_conten2">
                      <label className="label_title col-md-5">Género:</label>
                      <select
                        value={generoPaciente}
                        type="text"
                        className="form-select2"
                        autoFocus
                        required
                        onChange={indentificarGenero}
                      >
                        <option value="0">Hombre</option>
                        <option value="1">Mujer</option>
                      </select>
                    </div>
                    {genero ? (
                      <div className="mb-3 col-md-4 div_conten">
                        <label className="label_title col-md-5">
                          ¿Estás embarazada?:
                        </label>
                        <select
                          value={embarazada}
                          type="text"
                          className="form-select2"
                          autoFocus
                          required
                          onChange={(e) => {
                            setEmbarazada(e.target.value);
                          }}
                        >
                          <option value="0">No</option>
                          <option value="1">Si</option>
                        </select>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>

                  <label className="form-label titulos_labels">
                    ANTECENDETES MÉDICOS
                  </label>
                  <div className="content_general mb-3 col-md-12">
                    <div className="mb-3 col-md-4 div_conten2 div_conten3">
                      <label className="label_title col-md-5">
                        Enfermedades:{" "}
                      </label>
                      <textarea
                        value={enfermedades}
                        type="text"
                        className="form-control areas_textos"
                        cols="50"
                        onChange={(e) => {
                          setEnfermedades(e.target.value);
                        }}
                        placeholder="Escribe aqui ..."
                      ></textarea>
                    </div>
                    <div className="mb-3 col-md-4 div_conten2 div_conten3">
                      <label className="label_title col-md-5">
                        Discapacidades:{" "}
                      </label>
                      <textarea
                        value={discapacidades}
                        type="text"
                        className="form-control areas_textos"
                        cols="50"
                        onChange={(e) => {
                          setDiscapacidades(e.target.value);
                        }}
                        placeholder="Escribe aqui ..."
                      ></textarea>
                    </div>
                    <div className="mb-3 col-md-4 div_conten div_conten3">
                      <label className="label_title col-md-5">
                        Paciente especial:{" "}
                      </label>
                      <textarea
                        value={paciente_especial}
                        type="text"
                        className="form-control areas_textos"
                        cols="50"
                        onChange={(e) => {
                          setPaciente_especial(e.target.value);
                        }}
                        placeholder="Escribe aqui ..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-2 contentBtnRegistrar">
                {estado == false ? (
                  <input
                    type="submit"
                    className="btn btn-primary btnRegistrar"
                    value="Registrar"
                  />
                ) : (
                  ""
                )}
              </div>
            </form>
          </>
      </div>
      :<LoadingSmall/>}
    </div>
  );
};

export default AgregarCliente;
