import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Global } from "../../../../helper/Global";
import Swal from "sweetalert2";
import logo from "./../../../../assets/logos/logo.png";
import Button from "react-bootstrap/Button";
import {
  BsEyeFill,
  BsFileZipFill,
  BsFillTrashFill,
  BsFillTrash2Fill,
  BsDatabaseFillDown,
} from "react-icons/bs";
import { RiDeleteBin6Fill, RiWhatsappFill } from "react-icons/ri";
import ModalSeperado from "./ModalSeperado";
import Accordion from "react-bootstrap/Accordion";
import Modal from "react-bootstrap/Modal";
import EditarOrdenVirtual from "./EditarOrdenVirtual";
import ModalInformes from "./ModalInformes";
import { IoMdNotifications } from "react-icons/io";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/grid";
import "swiper/css";
import "swiper/css/pagination";
import { Grid, Pagination } from "swiper";

const ArchivosEstudio = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingeyes, setLoadingeyes] = useState(false);
  let token = localStorage.getItem("token");
  const [idOrden, setIdOrden] = useState(0);
  const [servicios, setservicios] = useState([]);
  const [idPaciente, setIdPaciente] = useState(0);
  const [nombres, setNombres] = useState("");
  const [idOdontologo, setIdOdontologo] = useState(0);
  const [impresionCheck, setImpresionCheck] = useState([]);
  const [elementos, setElementos] = useState([]);
  const [id_servicio, setId_servicio] = useState("");
  const [id_item, setIdItem] = useState("");
  const [fechaCreacion, setFechaCreacion] = useState("");
  const [edad, setEdad] = useState(0);
  const [dni, setDni] = useState(0);
  const [email, setEmail] = useState("");

  const [celularpaciente, setCelularPaciente] = useState("");
  const [celularDoctor, setCelularDoctor] = useState("");
  const [activeKeys, setActiveKeys] = useState(["1", "2"]);
  const [email_odontologo, setEmail_odontologo] = useState("");
  const [user_odontologo, setUser_odontologo] = useState("");
  const [passOdontologo, setPassOdontologo] = useState("");

  const [fecha, setFecha] = useState(0);
  const [varon, setVaron] = useState(false);
  const [mujer, setMujer] = useState(false);
  const [show, setShow] = useState(false);
  const [images, setImages] = useState([]);
  const [odontologo, setOdontologo] = useState("");
  const [nombredoctor, setNombreDoctor] = useState("");
  const [boton, setBoton] = useState(false);
  const [url, setUrl] = useState("");
  const [list, setlistafinal] = useState([]);
  const [idServicio, setIdServicio] = useState(0);
  const [descargas, setDescargas] = useState([]);
  const [loadingDowload, setLoadingDowload] = useState(false);
  const [loadingInformes, setLoadingInformes] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [informes, setInformes] = useState([]);
  const [loadingCorreo, setLoadingCorreo] = useState(false);
  const [fecha_at, setFechaAt] = useState("");
  const [show4, setShow4] = useState(false);

  const handleClose4 = () => setShow4(false);
  const handleShow4 = () => setShow4(true);

  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  const handleClose = (e) => {
    setShow(false);
    getImages();
  };

  const handleClose3 = (e) => {
    setShow3(false);
    getInformes();
  };

  const handleShow = (e) => {
    const id = e.target.id;
    const name = e.target.name;
    setIdItem(name);
    setId_servicio(id);
    setShow(true);
  };

  const handleShow3 = (e) => {
    const id = e.target.id;
    const name = e.target.name;
    setIdItem(name);
    setId_servicio(id);
    setShow3(true);
  };

  // const handleShow = () => setShow(true);

  const navigate = useNavigate();

  function calcularEdad(fecha_nacimiento) {
    let hoy = new Date();
    let cumpleanos = new Date(fecha_nacimiento);
    let edad = hoy.getFullYear() - cumpleanos.getFullYear();
    let m = hoy.getMonth() - cumpleanos.getMonth();
    if (m < 0 || (m == 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
    }
    return edad;
  }

  const getImages = async () => {
    const request = await axios.get(`${Global.url}/verImagenes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setImages(request.data);

    request.data.map((img) =>
      img.id_orden == id
        ? setDescargas([
            ...descargas,
            `${Global.urlImages}/imagenes/${img.archivo}`,
          ])
        : ""
    );
  };

  const getOneOrden = async () => {
    setLoading(true);
    const oneOrden = await axios.get(`${Global.url}/oneOrdenVirtual/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setIdPaciente(oneOrden.data.verOrden.id_paciente);
    setIdOdontologo(oneOrden.data.verOrden.id_odontologo);
    setIdOrden(oneOrden.data.verOrden.id);

    const fecha_at = new Date(oneOrden.data.verOrden.created_at);

    setFechaCreacion(
      `${fecha_at.toLocaleDateString()}  -  ${fecha_at.toLocaleTimeString()}`
    );

    const fechaObjeto = new Date(fecha_at);
    const year = fechaObjeto.getFullYear().toString().padStart(4, "0");
    const month = (fechaObjeto.getMonth() + 1).toString().padStart(2, "0");
    const day = fechaObjeto.getDate().toString().padStart(2, "0");
    const fechaFormateada = `${year}-${month}-${day}`;
    setFechaAt(fechaFormateada);

    setElementos(JSON.parse(oneOrden.data.verOrden.impresionServicios));
    setIdServicio(JSON.parse(oneOrden.data.verOrden.impresionServicios)[0]);

    const onePaciente = await axios.get(
      `${Global.url}/onePaciente/${oneOrden.data.verOrden.id_paciente}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    1;

    setNombres(
      `${onePaciente.data.nombres} ${onePaciente.data.apellido_p} ${onePaciente.data.apellido_m}`
    );
    setEdad(calcularEdad(onePaciente.data.f_nacimiento));
    setDni(onePaciente.data.numero_documento_paciente_odontologo);
    setEmail(onePaciente.data.correo);
    setCelularPaciente(onePaciente.data.celular);

    const fecha_date = new Date(onePaciente.data.f_nacimiento);
    setFecha(fecha_date.toLocaleDateString());

    if (onePaciente.data.genero == 0) {
      setVaron(true);
    } else if (onePaciente.data.genero == 1) {
      setMujer(true);
    }

    const request = await axios.get(`${Global.url}/allServicios`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setservicios(request.data);

    const oneOdontologo = await axios.get(
      `${Global.url}/oneOdontologo/${oneOrden.data.verOrden.id_odontologo}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setOdontologo(
      `${oneOdontologo.data.nombres} ${oneOdontologo.data.apellido_p} ${oneOdontologo.data.apellido_m}`
    );
    setIdOdontologo(oneOdontologo.data.id);

    setUser_odontologo(oneOdontologo.data.correo);
    setPassOdontologo(oneOdontologo.data.cop);
    setEmail_odontologo(oneOdontologo.data.correo);
    setCelularDoctor(oneOdontologo.data.celular);

    setLoading(false);
  };

  const preguntar = (id, archivos) => {
    Swal.fire({
      title: `¿Estás seguro de eliminar la imagen "${archivos}"?`,
      showDenyButton: true,
      confirmButtonText: "Eliminar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteImages(id);
      }
    });
  };

  const deleteImages = async (id) => {
    try {
      const resultado = await axios.delete(
        `${Global.url}/deleteArchivos/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (resultado.data.status == "success") {
        Swal.fire("Se eliminó correctamente", "", "success");
        getImages();
        getInformes();
      } else if (resultado.data.status == "error_busqueda") {
        Swal.fire("Error al buscar", "", "error");
      } else if (resultado.data.status == "nose") {
        Swal.fire(resultado.data.message, "", "nose");
      } else {
        Swal.fire("Errorr", "", "error");
      }
    } catch (error) {
      console.log(error.request.response);
      Swal.fire("Error al eliminar el registro", "", "error");
    }
  };

  const descargarImagenes = async () => {
    setLoadingDowload(true);
    await axios({
      method: "get",
      url: `${Global.url}/dowloads/${id}`,
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${nombres}_${fecha_at}_${id}.zip`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        Swal.fire("Error al descargar el archivo ZIP", "", "error");
      });
    setLoadingDowload(false);
  };

  const handleModalClick = (event) => {
    event.stopPropagation(); // Detiene la propagación del evento de clic
  };

  const preguntarDescarga = () => {
    const existeImagen = images.some((image) => image.id_orden == id);
    const existeinforme = informes.some((image) => image.id_orden == id);
    if (existeImagen || existeinforme) {
      Swal.fire({
        title: `¿Estás seguro de descargar todos los archivos`,
        showDenyButton: true,
        confirmButtonText: "Descargar",
        denyButtonText: `Cancelar`,
      }).then((result) => {
        if (result.isConfirmed) {
          descargarImagenes();
        }
      });
    } else {
      Swal.fire("No hay archivos que descargar", "", "error");
    }
  };

  const removeAllimgs = async () => {
    setLoadingDowload(true);
    try {
      const resultado = await axios.get(`${Global.url}/destroyAll/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (resultado.data.status == "success") {
        Swal.fire("Se eliminó correctamente", "", "success");
        getImages();
        getInformes();
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error al eliminar todo los archivos", "", "error");
    }
    setLoadingDowload(false);
  };

  const preguntarRemove = () => {
    Swal.fire({
      title: `¿Estás seguro de eliminar todos los archivos?`,
      showDenyButton: true,
      confirmButtonText: "Eliminar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: `Estos archivos no se podrán recuperar`,
          showDenyButton: true,
          confirmButtonText: "Estoy de acuerdo",
          denyButtonText: `Cancelar`,
        }).then((result) => {
          if (result.isConfirmed) {
            removeAllimgs();
          }
        });
      }
    });
  };

  const getInformes = async () => {
    const request = await axios.get(`${Global.url}/verInformes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setInformes(request.data);

    // request.data.map((infor)=>(
    //     infor.id_orden == id ?
    //         setDescargas([...descargas, `${Global.urlImages}/imagenes/${img.archivo}`])
    //     : ""
    // ));
  };

  const preguntarInformes = (id, archivos) => {
    Swal.fire({
      title: `¿Estás seguro de eliminar el informe "${archivos}"?`,
      showDenyButton: true,
      confirmButtonText: "Eliminar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteInforme(id);
      }
    });
  };

  const deleteInforme = async (id) => {
    try {
      const resultado = await axios.delete(
        `${Global.url}/deleteInformes/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (resultado.data.status == "success") {
        Swal.fire("Se eliminó correctamente", "", "success");
        getInformes();
      }
    } catch (error) {
      console.log(error.request.response);
      Swal.fire("Error al eliminar el registro", "", "error");
    }
  };

  const enviarCorreo = async () => {
    setLoadingCorreo(true);
    const data = new FormData();
    data.append("name", nombres);
    data.append("nameDoctor", odontologo);
    data.append("user", email);
    data.append("pass", dni);
    data.append("email", email);

    data.append("user_odontologo", user_odontologo);
    data.append("pass_odontologo", passOdontologo);
    data.append("email_odontologo", email_odontologo);

    try {
      let respuesta = await axios.post(`${Global.url}/enviarCorreo`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (respuesta.data.status == "success") {
      } else {
        // Swal.fire("Error al enviar el correo", "", "error");
      }
    } catch (error) {
      console.log(error);
      //   Swal.fire("Error al enviar el correo", "", "error");
    }

    setLoadingCorreo(false);
  };

  const enviocorreoquestion = () => {
    const existeImagen = images.some((image) => image.id_orden == id);
    const existeinforme = informes.some((image) => image.id_orden == id);
    if (existeImagen || existeinforme) {
      Swal.fire({
        title: `Este correo será enviado al paciente y odontólogo`,
        showDenyButton: true,
        confirmButtonText: "Continuar",
        denyButtonText: `Cancelar`,
      }).then((result) => {
        if (result.isConfirmed) {
          enviarCorreo();
          Swal.fire(
            "El correo será enviado a",
            `Paciente -${
              email != null ? email : "No tiene correo"
            } \n\n y Doctor: ${
              email_odontologo != null ? email_odontologo : "No tiene correo"
            }`,
            "success"
          );
        }
      });
    } else {
      Swal.fire(
        "Se deben subir los resultados para enviar la notificación",
        "",
        "error"
      );
    }
  };

  const whatsappPaciente = () => {
    const existeImagen = images.some((image) => image.id_orden == id);
    const existeinforme = informes.some((image) => image.id_orden == id);
    if (existeImagen || existeinforme) {
      const telefono = celularpaciente;
      if (telefono) {
        const mensaje = `Estimado(a) Sr(a). ${nombres},\n\nEn Radiología Dental Avanzada nos complace informarle que sus resultados ya están disponibles. Le invitamos a acceder a nuestro sistema utilizando el siguiente link: https://sistema.afg.com.pe/ \n\nLe recordamos que sus credenciales son:\n\nUsuario: ${email}\nContraseña: ${dni}\n\n¡Gracias por elegirnos!`;
        const url = `https://api.whatsapp.com/send?phone=${telefono}&text=${encodeURIComponent(
          mensaje
        )}`;
        window.open(url);
      } else {
        Swal.fire("El Paciente no tiene un celular registrado", "", "warning");
      }
    } else {
      Swal.fire(
        "Se deben subir los resultados para enviar la notificación",
        "",
        "error"
      );
    }
  };

  const whatsappDoctor = () => {
    const existeImagen = images.some((image) => image.id_orden == id);
    const existeinforme = informes.some((image) => image.id_orden == id);
    if (existeImagen || existeinforme) {
      const telefono = celularDoctor;
      if (user_odontologo != null) {
        if (telefono) {
          const mensaje = `Estimado(a) Dr(a). ${odontologo},\n\nEn Radiología Dental Avanzada nos complace informarle que los resultados de su paciente ${nombres} ya están disponibles. Le invitamos a acceder a nuestro sistema utilizando el siguiente link: https://sistema.afg.com.pe/ \n\nLe recordamos que sus credenciales son:\n\nUsuario: ${user_odontologo}\nContraseña: ${passOdontologo}\n\n¡Gracias por elegirnos!`;
          const url = `https://api.whatsapp.com/send?phone=${telefono}&text=${encodeURIComponent(
            mensaje
          )}`;
          window.open(url);
        } else {
          Swal.fire(
            "El odontólogo no tiene un celular registrado",
            "",
            "warning"
          );
        }
      } else {
        Swal.fire(
          "El odontólogo no tiene correo electrónico, y se necesita porque será su usuario para el ingreso en el sistema de resultados en línea, por ende, no se le puede enviar la	 alerta por WhatsApp",
          "",
          "warning"
        );
      }
    } else {
      Swal.fire(
        "Se deben subir los resultados para enviar la notificación",
        "",
        "error"
      );
    }
  };

  function formatFileName(fileName) {
    const prefixIndex = fileName.indexOf("_");
    if (prefixIndex !== -1) {
      return fileName.substring(prefixIndex + 1);
    }
    return fileName;
  }

  useEffect(() => {
    getOneOrden();
    getImages();
    getInformes();
    // descargarImagenes();
  }, []);

  return (
    <div className="container col-md-11 mt-6">
      <div className="card">
        <div className="card-header fw-bold">
          {loadingDowload ? (
            <div className="card-header-content" style={{ width: "50px" }}>
              <div className="dot-spinner dot-spinner10">
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
              </div>
            </div>
          ) : (
            <div className="card-header-content">
              <BsDatabaseFillDown
                style={{ color: "white", fontSize: "27px" }}
                title="Descargar todos los archivos"
                onClick={() => {
                  preguntarDescarga();
                }}
              />
              <BsFillTrash2Fill
                style={{ color: "white", fontSize: "27px" }}
                title="Borrar todos los archivos"
                onClick={() => {
                  preguntarRemove();
                }}
              />
            </div>
          )}
          Subir Registros de estudio:
        </div>
        {loading == false ? (
          <form className="p-4 needs-validation form_general">
            <div className="d-flex justify-content-between">
              <div
                className="mb-3 col-md-12 content_img"
                style={{ position: "relative" }}
              >
                <img src={logo} alt="" />
              </div>
              {loadingeyes ? (
                <div
                  style={{
                    background: "transparent",
                    border: "none",
                    width: "fit-content",
                    height: "fit-content",
                    marginRight: "50px",
                    position: "absolute",
                    right: "0px",
                  }}
                >
                  <div className="dot-spinner dot-spinner001">
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                  </div>
                </div>
              ) : (
                <div className="eyes_content">
                  <BsEyeFill onClick={handleShow2} />
                </div>
              )}
              <div
                className="eyes_content2"
                style={{ display: "flex", alignItems: "center" }}
              >
                {loadingCorreo ? (
                  <div className="dot-spinner dot-spinner002">
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                  </div>
                ) : (
                  <IoMdNotifications
                    onClick={(e) => {
                      e.preventDefault, enviocorreoquestion();
                    }}
                  />
                )}
                <RiWhatsappFill
                  style={{ fontSize: "40px", marginLeft: "10px" }}
                  onClick={() => {
                    setShow4(true);
                  }}
                />
                <Modal
                  show={show4}
                  onHide={handleClose4}
                  className="modal-content_btn"
                  onClick={() => {
                    setShow4(false);
                  }}
                >
                  <Modal.Body>
                    <div className="button_wsp">
                      <button
                        type="button "
                        class="btn-close button_wsp-btn"
                        aria-label="Close"
                      ></button>
                      <div
                        className="button_wsp-button"
                        onClick={(e) => {
                          e.preventDefault(), whatsappPaciente();
                        }}
                      >
                        Paciente:
                        <RiWhatsappFill
                          style={{ fontSize: "40px", marginLeft: "10px" }}
                        />
                      </div>
                      <div
                        className="button_wsp-button"
                        onClick={(e) => {
                          e.preventDefault(), whatsappDoctor();
                        }}
                      >
                        Odontólogo:
                        <RiWhatsappFill
                          style={{ fontSize: "40px", marginLeft: "10px" }}
                        />
                      </div>
                    </div>
                  </Modal.Body>
                </Modal>
              </div>
            </div>

            <Modal
              show={show2}
              onHide={handleClose2}
              animation={false}
              className="modal_vista_ordenes"
            >
              <Modal.Body>
                <button
                  type="button"
                  class="btn-close"
                  aria-label="Close"
                  onClick={handleClose2}
                ></button>
                <EditarOrdenVirtual
                  setLoadingeyes={setLoadingeyes}
                  loadingeyes={loadingeyes}
                />
              </Modal.Body>
            </Modal>

            <div
              className="d-flex  justify-content-between"
              style={{ paddingTop: "30px" }}
            >
              <div className="mb-3 col-md-3" style={{ paddingRight: "20px" }}>
                <label className="form-label">N° Orden: </label>
                <input
                  className="form-control"
                  disabled
                  type="text"
                  value={idOrden}
                  // onChange={(e)=>{setIdOrden(e.target.value)}}
                  style={{ textAlign: "center" }}
                />
              </div>
              <div className="mb-3 col-md-3" style={{ paddingRight: "20px" }}>
                <label className="form-label">Fecha: </label>
                <input
                  className="form-control"
                  disabled
                  type="text"
                  value={fechaCreacion}
                  // onChange={(e)=>{setFechaCreacion(e.target.value)}}
                  style={{ textAlign: "center" }}
                />
              </div>
              <div className="mb-3 col-md-3" style={{ paddingRight: "20px" }}>
                <label className="form-label">Paciente: </label>
                <input
                  className="form-control"
                  disabled
                  type="text"
                  value={nombres}
                />
              </div>
              <div className="mb-3 col-md-2" style={{ paddingRight: "20px" }}>
                <label className="form-label">Nacimiento: </label>
                <input
                  className="form-control"
                  disabled
                  type="text"
                  value={fecha}
                />
              </div>
              <div className="mb-3 col-md-1">
                <label className="form-label">Edad: </label>
                <input
                  className="form-control"
                  disabled
                  type="text"
                  value={edad}
                />
              </div>
            </div>
            <Accordion activeKey={activeKeys} className="kkk_sss">
              {
                <>
                  <Accordion.Item
                    key={"1"}
                    eventKey={"1"}
                    className="quitarcursor"
                  >
                    <Accordion.Header
                      className="card-header fw-bold"
                      style={{ marginTop: "20px", cursor: "default" }}
                    >
                      Subir Imágenes
                      <ModalSeperado
                        handleModalClick={handleModalClick}
                        show={show}
                        handleClose={handleClose}
                        id_orden={idOrden}
                      />
                    </Accordion.Header>
                    <Accordion.Body style={{ position: "relative" }}>
                      <div className="d-flex  justify-content-between">
                        <div
                          className="mb-3 col-md-12"
                          style={{ paddingRight: "20px" }}
                        >
                          <div className="content_archivos">
                            <div className="content_archivos-boton">
                              <Button
                                onClick={handleShow}
                                className="form-label col-md-3"
                                id={"1"}
                                name={"1"}
                              >
                                Subir imágenes
                              </Button>
                            </div>
                            <Swiper
                              slidesPerView={5}
                              // spaceBetween={20}
                              navigation={true}
                              modules={[Grid, Pagination]}
                              className="mySwiper"
                              grid={{
                                rows: 2,
                              }}
                              // style={{ width: "98%", maxWidth: "1000px" }}
                            >
                              {images.map((img) =>
                                img.id_orden == id ? (
                                  <SwiperSlide
                                    style={{
                                      height: "100px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <>
                                      <div
                                        key={img.id}
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                        }}
                                      >
                                        {img.archivo
                                          .split(",")
                                          .map((linea, index) => (
                                            <div
                                              className="div_delete"
                                              style={{
                                                display: "flex",
                                                gap: "0px",
                                                overflow: "hidden",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                width: "100%",
                                                height: "100%",
                                                position: "relative",
                                                padding: "10px 0",
                                              }}
                                              key={index}
                                            >
                                              <span className="span_delete">
                                                <button
                                                  onClick={(e) => {
                                                    e.preventDefault(),
                                                      preguntar(
                                                        img.id,
                                                        img.archivo
                                                      );
                                                  }}
                                                  style={{
                                                    background: "red",
                                                    padding: "8px",
                                                    borderRadius: "10px",
                                                    border: "none",
                                                  }}
                                                >
                                                  <RiDeleteBin6Fill
                                                    style={{ color: "white" }}
                                                  />
                                                </button>
                                              </span>
                                              {linea.split(".").pop() ==
                                                "jpg" ||
                                              linea.split(".").pop() == "png" ||
                                              linea.split(".").pop() ==
                                                "jpeg" ||
                                              linea.split(".").pop() == "gif" ||
                                              linea.split(".").pop() == "bmp" ||
                                              linea.split(".").pop() ==
                                                "tiff" ||
                                              linea.split(".").pop() ==
                                                "webp" ||
                                              linea.split(".").pop() ==
                                                "svg" ? (
                                                <img
                                                  src={`${Global.urlImages}/imagenes/${linea}`}
                                                  alt="Imagen"
                                                  style={{
                                                    width: "100%",
                                                    objectFit: "contain",
                                                    height: "100%",
                                                  }}
                                                />
                                              ) : (
                                                <BsFileZipFill
                                                  style={{
                                                    fontSize: "40px",
                                                    width: "20%",
                                                    color: "#906B9F",
                                                    margin: "auto",
                                                  }}
                                                />
                                              )}
                                            </div>
                                          ))}
                                      </div>
                                    </>
                                  </SwiperSlide>
                                ) : (
                                  ""
                                )
                              )}
                            </Swiper>
                          </div>
                        </div>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item
                    key={"1"}
                    eventKey={"1"}
                    className="quitarcursor"
                  >
                    <Accordion.Header
                      className="card-header fw-bold"
                      style={{ marginTop: "20px" }}
                    >
                      Subir Informes
                      <ModalSeperado
                        handleModalClick={handleModalClick}
                        show={show}
                        getImages={getImages}
                        handleClose={handleClose}
                        id_orden={idOrden}
                      />
                      <ModalInformes
                        show3={show3}
                        handleClose3={handleClose3}
                        id_servicio={id_servicio}
                        getInformes={getInformes}
                        id_orden={idOrden}
                        handleModalClick={handleModalClick}
                      />
                    </Accordion.Header>
                    <Accordion.Body style={{ position: "relative" }}>
                      <div className="d-flex  justify-content-between">
                        <div
                          className="mb-3 col-md-12"
                          style={{ paddingRight: "20px" }}
                        >
                          <div className="content_archivos">
                            <div>
                              <div className="content_archivos-boton">
                                <Button
                                  onClick={handleShow3}
                                  className="form-label col-md-3"
                                  id={"1"}
                                >
                                  Subir Informes
                                </Button>
                              </div>
                              <Swiper
                                slidesPerView={5}
                                spaceBetween={20}
                                navigation={true}
                                modules={[Navigation]}
                                className="mySwiper"
                                style={{ width: "98%", maxWidth: "1000px" }}
                              >
                                {informes.map((info) =>
                                  info.id_orden == id ? (
                                    <div
                                      className="content_archivos__ul__divs"
                                      key={info.id}
                                      style={{ border: "1px solid grey" }}
                                    >
                                      <div className="content_archivos__ul__divs__clindrns">
                                        {info.informe
                                          .split(",")
                                          .map((linea, index) => (
                                            <div
                                              style={{
                                                display: "flex",
                                                gap: "0px",
                                                alignItems: "center",
                                                width: "100%",
                                              }}
                                              key={index}
                                            >
                                              {linea.split(".").pop() ==
                                                "jpg" ||
                                              linea.split(".").pop() == "png" ||
                                              linea.split(".").pop() ==
                                                "jpeg" ||
                                              linea.split(".").pop() == "gif" ||
                                              linea.split(".").pop() == "bmp" ||
                                              linea.split(".").pop() ==
                                                "tiff" ||
                                              linea.split(".").pop() ==
                                                "webp" ||
                                              linea.split(".").pop() ==
                                                "svg" ? (
                                                <img
                                                  src={`${Global.urlImages}/informes/${linea}`}
                                                  alt="Imagen"
                                                  style={{
                                                    width: "20%",
                                                    objectFit: "contain",
                                                    maxHeight: "80px",
                                                  }}
                                                />
                                              ) : (
                                                <BsFileZipFill
                                                  style={{
                                                    fontSize: "40px",
                                                    width: "20%",
                                                    color: "#906B9F",
                                                    margin: "auto",
                                                  }}
                                                />
                                              )}
                                              <p
                                                key={index}
                                                style={{ width: "80%" }}
                                              >
                                                {formatFileName(linea)}
                                              </p>
                                            </div>
                                          ))}
                                      </div>
                                      <button
                                        className="text-danger btnEliminar "
                                        onClick={(e) => {
                                          e.preventDefault(),
                                            preguntarInformes(
                                              info.id,
                                              info.informe
                                            );
                                        }}
                                      >
                                        <BsFillTrashFill />
                                      </button>
                                    </div>
                                  ) : (
                                    ""
                                  )
                                )}
                              </Swiper>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </>
              }
            </Accordion>
            <div className="d-flex gap-2 contentBtnRegistrar">
              <input type="hidden" name="oculto" value="1" />
              <Link
                to="/admin/ordenVirtual"
                className="btn btn-danger btnCancelar"
              >
                Regresar
              </Link>
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

export default ArchivosEstudio;
