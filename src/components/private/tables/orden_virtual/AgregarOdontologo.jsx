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
import AgregarClinica from "./AgregarClinica";

const AgregarCliente = (props) => {
  const { id_odon, nombreOdon, copOdon, emailOdon, cerrar, celOdon } = props;
  const id_rol = 1;
  let token = localStorage.getItem("token");
  const [estado, setEstado] = useState(id_rol == 0 ? false : true);
  const [validarEdad, setValidarEdad] = useState(false);
  const [search, setSearch] = useState("");
  const [nombre_clinica, setNombreClinica] = useState('')

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  
  const [show3, setShow3] = useState(false);
  const handleClose3 = () => setShow3(false);
  const handleShow3 = () => setShow3(true);

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
  const [generoPaciente, setGeneroPaciente] = useState(0);
  const [embarazada, setEmbarazada] = useState(0);

  const [enfermedades, setEnfermedades] = useState("");
  const [discapacidades, setDiscapacidades] = useState("");
  const [paciente_especial, setPaciente_especial] = useState("");
  const [genero, setGenero] = useState(false);
  const [loading, setLoading] = useState(false);

  // ODONTOLOGOS
  const [clinica, setClinica] = useState(0);
  const [cop, setCop] = useState("");
  const [c_bancaria, setC_bancaria] = useState("");
  const [cci, setCci] = useState("");
  const [nombre_banco, setNombre_banco] = useState("");

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

  const saveOdontologo = async (e) => {
    setLoading(true);
    e.preventDefault();
    e.stopPropagation();
    console.log("fecha");
    let token = localStorage.getItem("token");
    const data = new FormData();
    data.append("id_rol", 1);
    data.append("clinica", clinica);
    data.append("cop", cop);
    data.append("c_bancaria", c_bancaria);
    data.append("cci", cci);
    data.append("nombre_banco", nombre_banco);
    data.append("nombres", nombres);
    data.append("apellido_p", apellido_p);
    data.append("apellido_m", apellido_m);
    data.append("f_nacimiento", fecha);
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
    try {
      let respuesta = await axios.post(`${Global.url}/saveOdontologo3`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(respuesta)
      if (respuesta.data.status == "success") {
        id_odon(respuesta.data.odontologo.id),
          nombreOdon(
            `${respuesta.data.odontologo.nombres} ${respuesta.data.odontologo.apellido_p} ${respuesta.data.odontologo.apellido_m}`
          ),
          copOdon(respuesta.data.odontologo.cop),
          emailOdon(respuesta.data.odontologo.correo == null ? "" : respuesta.data.odontologo.correo),
          celOdon(respuesta.data.odontologo.celular == null ? "" : respuesta.data.odontologo.celular),
          Swal.fire("Agregado correctamente", "", "success");
            cerrar();
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
          `Duplicate entry '${cop}' for key 'odontologos_cop_unique'`
        )
      ) {
        Swal.fire("COP ya registrado", "", "error");
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
      } else if (error.request.response.includes("The celular must")) {
        Swal.fire("Celular inválido", "", "error");
      } else if (
        error.request.response.includes("The cop must be at least 10000")
      ) {
        Swal.fire("El cop debe ser mayor a 4 digitos", "", "error");
      } else if('The cop field is required'){
        Swal.fire(" El cop es requerido", "", "error");
      }else {
        Swal.fire("Error no encontrado", "", "error");
      }
      console.log(error);
    }
    setLoading(false);
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

  // const filterDate = () => {
  //   if (search.length == 0) {
  //     const clini = clinicas;
  //     return clini.slice(0, 7);
  //   }

  //   const filter = clinicas.filter((cate) => {
  //     return quitarAcentos(cate.nombre.toLowerCase()).includes(
  //       quitarAcentos(search.toLowerCase())
  //     );
  //   });

  //   return filter.slice(0, 7);
  // };


  // useEffect(() => {
  //   filterDate();
  // }, [search]);

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
    <div className="container col-md-12 mt-6" style={{ padding: "0", minHeight: '250px', minWidth: '700px'}}>
      {!loading ? (
        <div className="card">
          <>
            <div className="card-header fw-bold">Agregar - Odontólogo:</div>
            <form
              className="p-4 needs-validation d-flex flex-column gap-3"
              onSubmit={saveOdontologo}
            >
              <div className="d-flex justify-content-center">
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

                  <div
                    className="div_busqueda2 mb-3 col-md-12"
                    style={{ margin: "10px 0 5px 0" }}
                  >
                    <div className="mb-3 col-md-2 boton_agregar_clinica " style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                      <input
                        type="button"
                        className="btn btn-primary btnRegistrar"
                        value="Buscar clínica"
                        onClick={handleShow2}
                      />
                      <input
                        type="button"
                        className="btn btn-primary btnRegistrar"
                        value="Registrar clínica"
                        onClick={handleShow3}
                      />
                    </div>
                  </div>

                  <div className="content_general mb-3 col-md-12">
                    <div className="mb-3 col-md-6 div_conten2 ">
                      <label className="label_title col-md-5">Clínica: </label>
                          <input
                            className="form-control form-control3"
                            autoFocus
                            required
                            value={nombre_clinica != 'No tiene una clínica asignada' ? nombre_clinica : '' }
                            type="text"
                            disabled
                          />
                    </div>
                    <div className="mb-3 col-md-6 div_conten">
                      <label className="label_title col-md-5">COP: </label>
                      <input
                        className="form-control form-control3"
                        autoFocus
                        required
                        value={cop}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const regex = /^\d{0,10}$/; // Expresión regular para permitir solo 6 dígitos

                          if (regex.test(inputValue)) {
                            setCop(inputValue);
                          }
                        }}
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="content_general mb-3 col-md-12">
                    <div className="mb-3 col-md-6 div_conten2">
                      <label className="label_title col-md-5">
                        Cuenta de Banco:{" "}
                      </label>
                      <input
                        className="form-control form-control3"
                        autoFocus
                        value={c_bancaria}
                        onChange={(e) => {
                          setC_bancaria(e.target.value);
                        }}
                        type="text"
                      />
                    </div>
                    <div className="mb-3 col-md-6 div_conten">
                      <label className="label_title col-md-5">CCI: </label>
                      <input
                        className="form-control form-control3"
                        autoFocus
                        value={cci}
                        onChange={(e) => {
                          setCci(e.target.value);
                        }}
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="content_general mb-3 col-md-12">
                    <div className="mb-3 col-md-12 div_conten">
                      <label className="label_title col-md-5">
                        Nombre del Banco:{" "}
                      </label>
                      <input
                        className="form-control form-control3"
                        autoFocus
                        value={nombre_banco}
                        onChange={(e) => {
                          setNombre_banco(e.target.value);
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
                        value={celular}
                        onChange={(e) => {
                          setCelular(e.target.value);
                        }}
                        type="number"
                      />
                    </div>
                  </div>

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
                    <div className="mb-3 col-md-6 div_conten2">
                      <label className="label_title col-md-5">Correo:</label>
                      <input
                        className="form-control form-control3"
                        value={correo}
                        onChange={(e) => {
                          setCorreo(e.target.value);
                        }}
                        type="email"
                      />
                    </div>
                    <div className="mb-3 col-md-6 div_conten2">
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
                  </div>
                </div>
              </div>

              <div className="d-flex gap-2 contentBtnRegistrar">
                <input
                  type="submit"
                  className="btn btn-primary btnRegistrar"
                  value="Registrar"
                />
              </div>
            </form>

            <Modal
              show={show2}
              onHide={handleClose2}
              animation={false}
              className="buscarOdontologo"
            >
              <Modal.Body>
                <ListaClinica
                  cerrar={handleClose2}
                  id_clinica_click={setClinica}
                  setNombreClinica={setNombreClinica}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose2}>
                  Cerrar
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal
              show={show3}
              onHide={handleClose3}
              animation={false}
              className="buscarOdontologo"
            >
              <Modal.Body>
                <AgregarClinica
                 cerrar={handleClose3}
                 setClinica={setClinica}
                 setNombreClinica={setNombreClinica}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose3}>
                  Cerrar
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        </div>
      ) : (
        <LoadingSmall />
      )}
    </div>
  );
};

export default AgregarCliente;
