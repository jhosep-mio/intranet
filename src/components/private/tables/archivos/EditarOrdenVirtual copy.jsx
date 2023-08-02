import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Global } from "../../../../helper/Global";
import Swal from "sweetalert2";
import logo from "./../../../../assets/logos/logo.png";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import AgregarOdontologo from "./../orden_virtual/AgregarOdontologo";
import { BsPlusCircleFill } from "react-icons/bs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";

const EditarOrdenVirtual = ({ setLoadingeyes, loadingeyes }) => {
  const [loading, setLoading] = useState(false);
  const [serviciosEstate, setServiciosState] = useState([]);
  const [llenarserv, setLlenarServ] = useState([]);
  const [correo_paciente, setCorreoPaciente] = useState("");
  const { id } = useParams();
  const [impresionCheck, setImpresionCheck] = useState([]);
  let token = localStorage.getItem("token");
  const [varon, setVaron] = useState(false);
  const [mujer, setMujer] = useState(false);
  const [idServicio, setIdServicio] = useState(0);
  const [odontologos, setOdontologos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [items, setItems] = useState([]);
  const [elementos, setElementos] = useState([]);
  const [search, setSearch] = useState("");
  const [nombres, setNombres] = useState("");
  const [edad, setEdad] = useState(0);
  const [celular, setCelular] = useState(0);
  const [genero, setGenero] = useState(0);
  const [fecha, setFecha] = useState(0);
  const [odontologo, setOdontologo] = useState("");
  const [cop, setCop] = useState("");
  const [emailOdon, setEmailOdon] = useState("");
  const [botonDoctor, setBotonDoctor] = useState(false);
  //ORDEN VIRTUAL
  const [idPaciente, setIdPaciente] = useState(0);
  const [idOdontologo, setIdOdontologo] = useState(0);
  const [consulta, setConsulta] = useState("");
  const [estadoG, setEstadoG] = useState(0);
  const[celular_Odon, setCelular_Odon] = useState("");

  const [box18, setBox18] = useState(false);
  const [box17, setBox17] = useState(false);
  const [box16, setBox16] = useState(false);
  const [box15, setBox15] = useState(false);
  const [box14, setBox14] = useState(false);
  const [box13, setBox13] = useState(false);
  const [box12, setBox12] = useState(false);
  const [box11, setBox11] = useState(false);

  const [box21, setBox21] = useState(false);
  const [box22, setBox22] = useState(false);
  const [box23, setBox23] = useState(false);
  const [box24, setBox24] = useState(false);
  const [box25, setBox25] = useState(false);
  const [box26, setBox26] = useState(false);
  const [box27, setBox27] = useState(false);
  const [box28, setBox28] = useState(false);

  const [box48, setBox48] = useState(false);
  const [box47, setBox47] = useState(false);
  const [box46, setBox46] = useState(false);
  const [box45, setBox45] = useState(false);
  const [box44, setBox44] = useState(false);
  const [box43, setBox43] = useState(false);
  const [box42, setBox42] = useState(false);
  const [box41, setBox41] = useState(false);

  const [box31, setBox31] = useState(false);
  const [box32, setBox32] = useState(false);
  const [box33, setBox33] = useState(false);
  const [box34, setBox34] = useState(false);
  const [box35, setBox35] = useState(false);
  const [box36, setBox36] = useState(false);
  const [box37, setBox37] = useState(false);
  const [box38, setBox38] = useState(false);

  const [siConGuias, setSiConGuias] = useState(true);
  const [noConGuias, setNoConGuias] = useState(false);

  const [otrosAnalisis, setOtrosAnalisis] = useState("");
  const [totalPrecio, setTotalPrecio] = useState(0);
  const [metodoPago, setMetodoPago] = useState("");
  const [agregarComisiones, setAgregarComisiones] = useState(false);
  const [fechaCreacion, setFechaCreacion] = useState("");

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

  const getAllOdontologos = async () => {
    setLoading(true);
    const request = await axios.get(`${Global.url}/allOdontologos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setOdontologos(request.data);
  };

  const getAllServicios = async () => {
    setLoading(true);
    const request = await axios.get(`${Global.url}/allServicios`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setServicios(request.data);
    setIdServicio(request.data[0].id);
  };

  const getAllItems = async () => {
    setLoading(true);
    const request = await axios.get(`${Global.url}/allItemServices`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setItems(request.data);
  };

  const llenarArray = (orden) => {
    const ordenExisente = elementos.findIndex(
      (ordenExisente) => ordenExisente.id_item == orden.id_item
    );

    if (ordenExisente == -1) {
      setElementos([...elementos, orden]);
    } else {
      const nuevaOrden = [...elementos];
      nuevaOrden[ordenExisente] = orden;
      setElementos(nuevaOrden);
    }
    const ordenExisente2 = llenarserv.findIndex(
      (ordenExisente) => ordenExisente.id_servicio == orden.id_servicio
    );
    if (ordenExisente2 == -1) {
      setLlenarServ([...llenarserv, orden]);
    } else {
      const nuevaOrden2 = [...llenarserv];
      nuevaOrden2[ordenExisente2] = orden;
      setLlenarServ(nuevaOrden2);
    }
  };

  const llenarImpresion = (orden) => {
    setAgregarComisiones(false);
    const ordenExisente = impresionCheck.findIndex(
      (ordenExisente) => ordenExisente.id == orden.id
    );

    if (ordenExisente == -1) {
      setImpresionCheck([...impresionCheck, orden]);
    } else {
      const nuevaOrden = [...impresionCheck];
      nuevaOrden[ordenExisente] = orden;
      setImpresionCheck(nuevaOrden);
    }
  };

  const AGREGARPRECIO = () => {
    let count = 0;
    if (agregarComisiones == false) {
      for (let i = 0; i < elementos.length; i++) {
        for (let j = 0; j < impresionCheck.length; j++) {
          if (
            elementos[i].estado == true &&
            elementos[i].precio ==
              elementos[i].precio_impresion - elementos[i].comision_impreso
          ) {
            elementos[i].precio = elementos[i].precio_impresion;
          } else if (
            elementos[i].estado == true &&
            elementos[i].precio ==
              elementos[i].precio_digital - elementos[i].comision_digital
          ) {
            elementos[i].precio = elementos[i].precio_digital;
          }
          if (
            elementos[i].id_servicio == impresionCheck[j].id &&
            impresionCheck[j].estado == true &&
            elementos[i].estado == true
          ) {
            elementos[i].precio = elementos[i].precio_impresion;
          } else if (
            elementos[i].id_servicio == impresionCheck[j].id &&
            impresionCheck[j].estado == false &&
            elementos[i].estado == true
          ) {
            elementos[i].precio = elementos[i].precio_digital;
          }
          count++;
        }
      }
      if (count == 0) {
        for (let i = 0; i < elementos.length; i++) {
          count = 0;
          elementos[i].precio = elementos[i].precio_digital;
        }
      }
    } else {
      for (let i = 0; i < elementos.length; i++) {
        for (let j = 0; j < impresionCheck.length; j++) {
          if (
            elementos[i].estado == true &&
            elementos[i].precio == elementos[i].precio_impresion
          ) {
            elementos[i].precio =
              elementos[i].precio_impresion - elementos[i].comision_impreso;
          } else if (
            elementos[i].estado == true &&
            elementos[i].precio == elementos[i].precio_digital
          ) {
            elementos[i].precio =
              elementos[i].precio_digital - elementos[i].comision_digital;
          }
          count++;
        }
      }

      if (count == 0) {
        for (let i = 0; i < elementos.length; i++) {
          count = 0;
          elementos[i].precio =
            elementos[i].precio_digital - elementos[i].comision_digital;
        }
      }
    }
    setTotalPrecio(
      elementos.reduce((acumulador, producto) => {
        return (acumulador =
          acumulador +
          (producto.estado == true ? parseFloat(producto.precio) : 0));
      }, 0)
    );
  };

  useEffect(() => {
    AGREGARPRECIO();
  }, [agregarComisiones]);

  useEffect(() => {
    AGREGARPRECIO();
  }, [impresionCheck]);

  useEffect(() => {
    AGREGARPRECIO();
  }, [elementos]);

  useEffect(() => {
    filterDate();
  }, [search]);

  useEffect(() => {
    search.length == 0 ? setBotonDoctor(false) : setBotonDoctor(true);
  }, [search]);

  useEffect(() => {
    getAllOdontologos();
    getAllServicios();
    getAllItems();
    getOneOrden();
  }, []);

  const filterDate = async () => {
    if (search.length > 4) {
      const filter = odontologos.filter(
        (odon) => odon.cop.toString() == search
      );

      if (filter.length == 1) {
        if (filter[0].cop.toString().length == search.length) {
          setOdontologo(
            `${filter[0].nombres} ${filter[0].apellido_p} ${filter[0].apellido_m}`
          );
          setCop(filter[0].cop);
          setIdOdontologo(filter[0].id);
          setEmailOdon(filter[0].correo);
          setBotonDoctor(false);
          return filter[0];
        }
      } else {
        const filter = [];
        setOdontologo("");
        setCop("");
        setEmailOdon("");
        return filter[0];
      }
    } else if (search.length == 0) {
      const oneOdontologo = await axios.get(
        `${Global.url}/oneOdontologo/${idOdontologo}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOdontologo(
        `${oneOdontologo.data.nombres} ${oneOdontologo.data.apellido_p} ${oneOdontologo.data.apellido_m}`
      );
      setCop(oneOdontologo.data.cop);
      setIdOdontologo(oneOdontologo.data.id);
      setEmailOdon(oneOdontologo.data.correo);
    } else {
      const filter = [];
      setOdontologo("");
      setCop("");
      setEmailOdon("");
      return filter[0];
    }
  };

  const getOneOrden = useCallback(async () => {
    setLoading(true);
    setLoadingeyes(true);
    const {
      data: { verOrden },
    } = await axios.get(`${Global.url}/oneOrdenVirtual/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { id_paciente, id_odontologo, consulta } = verOrden;
    setIdPaciente(id_paciente);
    setIdOdontologo(id_odontologo);
    setConsulta(consulta);

    const boxFields = [
      "box18",
      "box17",
      "box16",
      "box15",
      "box14",
      "box13",
      "box12",
      "box11",
      "box21",
      "box22",
      "box23",
      "box24",
      "box25",
      "box26",
      "box27",
      "box28",
      "box48",
      "box47",
      "box46",
      "box45",
      "box44",
      "box43",
      "box42",
      "box41",
      "box31",
      "box32",
      "box33",
      "box34",
      "box35",
      "box36",
      "box37",
      "box38",
    ];

    boxFields.forEach((field) => {
      const value = verOrden[field] === 1;
      const setter = `set${field.charAt(0).toUpperCase()}${field.slice(1)}`;
      eval(`${setter}(${value})`);
    });

    setSiConGuias(verOrden.siConGuias);
    setNoConGuias(verOrden.noConGuias);
    setOtrosAnalisis(verOrden.otrosAnalisis);
    setTotalPrecio(verOrden.precio_final);
    setMetodoPago(verOrden.metodoPago || 0);
    setEstadoG(verOrden.estado);

    const fecha_at = new Date(verOrden.created_at);
    setFechaCreacion(
      `${fecha_at.toLocaleTimeString()} - ${fecha_at.toLocaleDateString()}`
    );
    setImpresionCheck(JSON.parse(verOrden.listaServicios));
    setServiciosState(JSON.parse(verOrden.impresionServicios));
    setLlenarServ(JSON.parse(verOrden.arryServicios));
    setElementos(JSON.parse(verOrden.listaItems));
    setAgregarComisiones(verOrden.activeComision === 1);

    const onePaciente = await getOnePaciente(verOrden.id_paciente);
    setNombres(
      `${onePaciente.nombres} ${onePaciente.apellido_p} ${onePaciente.apellido_m}`
    );
    setEdad(calcularEdad(onePaciente.f_nacimiento));
    setFecha(
      onePaciente.f_nacimiento == null ? "" : new Date(onePaciente.f_nacimiento)
    );
    setCelular(onePaciente.celular);
    setCorreoPaciente(onePaciente.correo);
    setGenero(onePaciente.genero);
    setVaron(onePaciente.genero == 0);
    setMujer(onePaciente.genero == 1);

    const oneOdontologo = await getOneOdontologo(verOrden.id_odontologo);
    setOdontologo(
      `${oneOdontologo.nombres} ${oneOdontologo.apellido_p} ${oneOdontologo.apellido_m}`
    );
    setCop(oneOdontologo.cop);
    setCelular_Odon(oneOdontologo.celular)
    setIdOdontologo(oneOdontologo.id);
    setEmailOdon(oneOdontologo.correo);
    setLoading(false);
    setLoadingeyes(false);
  });

  const getOnePaciente = async (pacienteId) => {
    const { data } = await axios.get(
      `${Global.url}/onePaciente/${pacienteId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  };

  const getOneOdontologo = async (odontologoId) => {
    const { data } = await axios.get(
      `${Global.url}/oneOdontologo/${odontologoId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  };
  return (
    <div className="container col-md-12 mt-12" style={{ padding: "0" }}>
      {loading == false ? (
        <div className="card">
          <div className="card-header fw-bold">Orden Virtual:</div>
          <form className="p-4 needs-validation" disabled>
            <div className="d-flex justify-content-between">
              <div className="mb-3 col-md-12 content_img">
                <img src={logo} alt="" />
              </div>
            </div>
            <div className="mb-3 col-md-11" style={{ margin: "0 auto" }}>
              <label className="form-label titulos_labels">GENERAL </label>
              <div className="content_general mb-3 col-md-12">
                <div className="mb-3 col-md-4 div_conten2">
                  <label className="label_title col-md-5">
                    Total a pagar:{" "}
                  </label>
                  <input
                    className="form-control form-control3 form-control2"
                    disabled
                    required
                    value={totalPrecio.toFixed(2)}
                    type="text"
                    onChange={(e) => setTotalPrecio(e.target.value)}
                  />
                </div>
                <div className="mb-3 col-md-3 div_conten2">
                  <label className="label_title col-md-5">
                    Restar comisiones:{" "}
                  </label>
                  <input
                    type="checkbox"
                    className="on_active"
                    value={agregarComisiones}
                    checked={agregarComisiones}
                    disabled
                  />
                </div>
                <div className="mb-3 col-md-5 div_conten">
                  <label className="label_title col-md-5">
                    Método de pago:{" "}
                  </label>
                  <select
                    value={metodoPago}
                    type="text"
                    disabled
                    className=" form-select2"
                    autoFocus
                    required
                    onChange={(e) => {
                      setMetodoPago(e.target.value);
                    }}
                  >
                    <option value="0">POS</option>
                    <option value="1">Efectivo</option>
                    <option value="2">Transferencia</option>
                  </select>
                </div>
              </div>
              <div className="content_general mb-3 col-md-12">
                <div className="mb-3 col-md-6 div_conten2">
                  <label className="label_title">ESTADO: </label>
                  {estadoG == 0 ? (
                    <input
                      style={{ background: "green" }}
                      className="button_estado"
                      type="button"
                      value={"Creado"}
                      disabled
                    />
                  ) : estadoG == 1 ? (
                    <input
                      style={{ background: "rgb(191, 191, 31)" }}
                      className="button_estado"
                      type="button"
                      value="Pendiente"
                      disabled
                    />
                  ) : estadoG == 2 ? (
                    <input
                      style={{ background: "#D23741" }}
                      className="button_estado"
                      type="button"
                      value="Realizado"
                      disabled
                    />
                  ) : (
                    ""
                  )}
                </div>
                <div className="mb-3 col-md-6 div_conten">
                  <label className="label_title col-md-5">
                    Fecha de creacion:
                  </label>
                  <input
                    className="form-control form-control3 form-control2"
                    disabled
                    value={fechaCreacion}
                    type="text"
                  />
                </div>
              </div>
              <label
                className="form-label titulos_labels"
                style={{ margin: "10px 0 10px 0" }}
              >
                DATOS DEL PACIENTE{" "}
              </label>
              <div className="content_general mb-3 col-md-12">
                <div className="mb-3 col-md-10 div_conten2">
                  <label className="label_title col-md-5">Nombres: </label>
                  <input
                    className="form-control form-control3"
                    disabled
                    required
                    value={nombres}
                    type="text"
                  />
                </div>
                <div className="mb-3 col-md-2 div_conten">
                  <label className="label_title col-md-5">Edad: </label>
                  <input
                    className="form-control form-control3 form-control2"
                    disabled
                    required
                    value={edad}
                    type="text"
                  />
                </div>
              </div>

              <div className="content_general mb-3 col-md-12">
                <div className="mb-3 col-md-6 div_conten2">
                  <label className="label_title col-md-5">
                    Fecha de Nacimiento:{" "}
                  </label>
                  <DatePicker
                    className="form-control form-control3"
                    selected={fecha}
                    value={fecha}
                    disabled
                    dateFormat="dd/MM/yyyy"
                    locale={es}
                  />
                </div>
                <div
                  className="mb-3 col-md-6 div_conten"
                  style={{ justifyContent: "start" }}
                >
                  <label className="label_title col-md-5">Sexo:</label>
                  <span className="">M</span>
                  <input
                    value={varon}
                    type="checkbox"
                    className="on_active"
                    disabled
                    onChange={(e) => setVaron(e.target.checked)}
                    checked={varon}
                  />
                  <span className="">F</span>
                  <input
                    value={mujer}
                    type="checkbox"
                    className="on_active"
                    disabled
                    onChange={(e) => setMujer(e.target.checked)}
                    checked={mujer}
                  />
                </div>
              </div>

              <div className="content_general mb-3 col-md-12">
                <div className="mb-3 col-md-6 div_conten2">
                  <label className="label_title col-md-5">Correo: </label>
                  <input
                    className="form-control form-control3 form-control2"
                    disabled
                    required
                    value={correo_paciente}
                    type="text"
                    style={{ textAlign: "left" }}
                  />
                </div>
                <div className="mb-3 col-md-6 div_conten">
                  <label className="label_title col-md-5">Telefono: </label>
                  <input
                    className="form-control form-control3 form-control2"
                    disabled
                    required
                    value={celular}
                    type="text"
                    onChange={(e) => setCelular(e.target.value)}
                  />
                </div>
              </div>

              <div className="content_general mb-3 col-md-12">
                <div className="mb-3 col-md-12 div_conten">
                  <label className="label_title col-md-5">
                    Motivo de consulta:{" "}
                  </label>
                  <input
                    className="form-control form-control3"
                    autoFocus
                    required
                    value={consulta}
                    type="text"
                    disabled
                  />
                </div>
              </div>

              <div className="div_busqueda">
                <div>
                  <label
                    className="form-label titulos_labels"
                    style={{ margin: "10px 0 10px 0" }}
                  >
                    DATOS DEL DOCTOR(A){" "}
                  </label>
                </div>
              </div>

              <div className="content_general mb-3 col-md-12">
                <div className="mb-3 col-md-12 div_conten">
                  <label className="label_title col-md-5">Doctor(a): </label>
                  <input
                    className="form-control form-control3"
                    required
                    disabled
                    value={odontologo}
                    type="text"
                  />
                </div>
              </div>

              <div className="content_general mb-3 col-md-12">
                <div className="mb-3 col-md-6 div_conten2">
                  <label className="label_title col-md-5">C.O.P: </label>
                  <input
                    className="form-control form-control3"
                    required
                    disabled
                    value={cop == 0 ? '' : cop}
                    type="text"
                    onChange={(e) => setCop(e.target.value)}
                  />
                </div>
                <div className="mb-3 col-md-6 div_conten">
                  <label className="label_title col-md-5">Celular: </label>
                  <input
                    className="form-control form-control3 form-control2"
                    required
                    disabled
                    value={celular_Odon}
                    type="text"
                  />
                </div>
              </div>
              <div className="content_general mb-3 col-md-12">
                <div className="mb-3 col-md-12 div_conten">
                  <label className="label_title col-md-5">EMAIL: </label>
                  <input
                    className="form-control form-control3 form-control2"
                    required
                    disabled
                    value={emailOdon}
                    type="text"
                    onChange={(e) => setEmailOdon(e.target.value)}
                    style={{ textAlign: "left" }}
                  />
                </div>
              </div>

              {idServicio != 0 ? (
                <Accordion
                  defaultActiveKey={idServicio}
                  style={{ marginTop: "20px" }}
                  disabled
                >
                  {servicios.map((servicio) => (
                    <Accordion.Item eventKey={servicio.id} key={servicio.id}>
                      <Accordion.Header>
                        <label
                          className="form-label titulos_labels"
                          style={{ margin: "10px 0 10px 0" }}
                        >
                          {servicio.nombre}
                        </label>
                      </Accordion.Header>
                      <Accordion.Body>
                        {servicio.impreso == 1 ? (
                          <div className="item_impresion">
                            <span className="">¿Impresión?</span>
                            <input
                              type="checkbox"
                              checked={
                                impresionCheck.find(
                                  (estado) => estado.id == servicio.id
                                )?.estado || false
                              }
                              id={"checkboxi" + servicio.id}
                              className="on_active"
                              disabled
                            />
                          </div>
                        ) : (
                          ""
                        )}
                        <div className="mb-3 col-md-12 div_general_box">
                          <ul className="mb-3 col-md-12 div_secundario">
                            {items.map((item) =>
                              item.id_servicio == servicio.id ? (
                                <li key={item.id} className="content_checkBox">
                                  <input
                                    type="checkbox"
                                    checked={
                                      elementos.find(
                                        (estado) => estado.id_item == item.id
                                      )?.estado || false
                                    }
                                    id={"checkboxi" + item.id}
                                    className="on_active"
                                    disabled
                                  />
                                  <span className="">{item.nombre}</span>
                                </li>
                              ) : (
                                ""
                              )
                            )}
                          </ul>
                        </div>

                        {servicio.id == 1 ? (
                          <>
                            <label
                              className="form-label titulos_labels"
                              style={{ margin: "10px 0 10px 0" }}
                            >
                              IMPLANTES / ENDODONCIA
                            </label>
                            <div className="mb-3 col-md-12 div_box_generl_bot">
                              <div className="mb-3 col-md-12 div_tercero">
                                <div className="content_cuadrados">
                                  <input
                                    type="checkbox"
                                    className=""
                                    value={box18}
                                    disabled
                                    checked={box18}
                                  />
                                  <span className="">18</span>
                                </div>
                                <div className="content_cuadrados">
                                  <input
                                    type="checkbox"
                                    className=""
                                    value={box17}
                                    disabledchecked={box17}
                                  />
                                  <span className="">17</span>
                                </div>
                                <div className="content_cuadrados">
                                  <input
                                    type="checkbox"
                                    className=""
                                    value={box16}
                                    disabled
                                    checked={box16}
                                  />
                                  <span className="">16</span>
                                </div>
                                <div className="content_cuadrados">
                                  <input
                                    type="checkbox"
                                    className=""
                                    value={box15}
                                    disabled
                                    checked={box15}
                                  />
                                  <span className="">15</span>
                                </div>
                                <div className="content_cuadrados">
                                  <input
                                    type="checkbox"
                                    className=""
                                    value={box14}
                                    disabled
                                    checked={box14}
                                  />
                                  <span className="">14</span>
                                </div>
                                <div className="content_cuadrados">
                                  <input
                                    type="checkbox"
                                    className=""
                                    value={box13}
                                    disabled
                                    checked={box13}
                                  />
                                  <span className="">13</span>
                                </div>
                                <div className="content_cuadrados">
                                  <input
                                    type="checkbox"
                                    className=""
                                    value={box12}
                                    disabled
                                    checked={box12}
                                  />
                                  <span className="">12</span>
                                </div>
                                <div className="content_cuadrados">
                                  <input
                                    type="checkbox"
                                    className=""
                                    value={box11}
                                    disabled
                                    checked={box11}
                                  />
                                  <span className="">11</span>
                                </div>
                                <div className="content_cuadrados">
                                  <input
                                    type="checkbox"
                                    className=""
                                    value={box21}
                                    disabled
                                    checked={box21}
                                  />
                                  <span className="">21</span>
                                </div>
                                <div className="content_cuadrados">
                                  <input
                                    type="checkbox"
                                    className=""
                                    value={box22}
                                    disabled
                                    checked={box22}
                                  />
                                  <span className="">22</span>
                                </div>
                                <div className="content_cuadrados">
                                  <input
                                    type="checkbox"
                                    className=""
                                    value={box23}
                                    disabled
                                    checked={box23}
                                  />
                                  <span className="">23</span>
                                </div>
                                <div className="content_cuadrados">
                                  <input
                                    type="checkbox"
                                    className=""
                                    value={box24}
                                    disabled
                                    checked={box24}
                                  />
                                  <span className="">24</span>
                                </div>
                                <div className="content_cuadrados">
                                  <input
                                    type="checkbox"
                                    className=""
                                    value={box25}
                                    disabled
                                    checked={box25}
                                  />
                                  <span className="">25</span>
                                </div>
                                <div className="content_cuadrados">
                                  <input
                                    type="checkbox"
                                    className=""
                                    value={box26}
                                    disabled
                                    checked={box26}
                                  />
                                  <span className="">26</span>
                                </div>
                                <div className="content_cuadrados">
                                  <input
                                    type="checkbox"
                                    className=""
                                    value={box27}
                                    disabled
                                    checked={box27}
                                  />
                                  <span className="">27</span>
                                </div>
                                <div className="content_cuadrados">
                                  <input
                                    type="checkbox"
                                    className=""
                                    value={box28}
                                    disabled
                                    checked={box28}
                                  />
                                  <span className="">28</span>
                                </div>
                              </div>
                            </div>
                            <div className="mb-3 col-md-12 ">
                              <div className="mb-3 col-md-12 div_tercero">
                                <div className="content_cuadrados">
                                  <input
                                    type="checkbox"
                                    className=""
                                    value={box48}
                                    disabled
                                    checked={box48}
                                  />
                                  <span className="">48</span>
                                </div>
                                <div className="content_cuadrados">
                                  <input
                                    type="checkbox"
                                    className=""
                                    value={box47}
                                    disabled
                                    checked={box47}
                                  />
                                  <span className="">47</span>
                                </div>
                                <div className="content_cuadrados">
                                  <input
                                    type="checkbox"
                                    className=""
                                    value={box46}
                                    disabled
                                    checked={box46}
                                  />
                                  <span className="">46</span>
                                </div>
                                <div className="content_cuadrados">
                                  <input
                                    type="checkbox"
                                    className=""
                                    value={box45}
                                    disabled
                                    checked={box45}
                                  />
                                  <span className="">45</span>
                                </div>
                                <div className="content_cuadrados">
                                  <input
                                    type="checkbox"
                                    className=""
                                    value={box44}
                                    disabled
                                    checked={box44}
                                  />
                                  <span className="">44</span>
                                </div>
                                <div className="content_cuadrados">
                                  <input
                                    type="checkbox"
                                    className=""
                                    value={box43}
                                    disabled
                                    checked={box43}
                                  />
                                  <span className="">43</span>
                                </div>
                                <div className="content_cuadrados">
                                  <input
                                    type="checkbox"
                                    className=""
                                    value={box42}
                                    disabled
                                    checked={box42}
                                  />
                                  <span className="">42</span>
                                </div>
                                <div className="content_cuadrados">
                                  <input
                                    type="checkbox"
                                    className=""
                                    value={box41}
                                    disabled
                                    checked={box41}
                                  />
                                  <span className="">41</span>
                                </div>

                                <div className="content_cuadrados">
                                  <input
                                    type="checkbox"
                                    className=""
                                    value={box31}
                                    disabled
                                    checked={box31}
                                  />
                                  <span className="">31</span>
                                </div>
                                <div className="content_cuadrados">
                                  <input
                                    type="checkbox"
                                    className=""
                                    value={box32}
                                    disabled
                                    checked={box32}
                                  />
                                  <span className="">32</span>
                                </div>
                                <div className="content_cuadrados">
                                  <input
                                    type="checkbox"
                                    className=""
                                    value={box33}
                                    disabled
                                    checked={box33}
                                  />
                                  <span className="">33</span>
                                </div>
                                <div className="content_cuadrados">
                                  <input
                                    type="checkbox"
                                    className=""
                                    value={box34}
                                    disabled
                                    checked={box34}
                                  />
                                  <span className="">34</span>
                                </div>
                                <div className="content_cuadrados">
                                  <input
                                    type="checkbox"
                                    className=""
                                    value={box35}
                                    disabled
                                    checked={box35}
                                  />
                                  <span className="">35</span>
                                </div>
                                <div className="content_cuadrados">
                                  <input
                                    type="checkbox"
                                    className=""
                                    value={box36}
                                    disabled
                                    checked={box36}
                                  />
                                  <span className="">36</span>
                                </div>
                                <div className="content_cuadrados">
                                  <input
                                    type="checkbox"
                                    className=""
                                    value={box37}
                                    disabled
                                    checked={box37}
                                  />
                                  <span className="">37</span>
                                </div>
                                <div className="content_cuadrados">
                                  <input
                                    type="checkbox"
                                    className=""
                                    value={box38}
                                    disabled
                                    checked={box38}
                                  />
                                  <span className="">38</span>
                                </div>
                              </div>
                            </div>
                            <div className="mb-3 col-md-12 div_bot_box2">
                              <span className="label_title2">
                                MUY IMPORTANTE: ¿El paciente es enviado con
                                guias?
                              </span>
                              <div className="content_checkBox2">
                                <span className="">Si</span>
                                <input
                                  type="checkbox"
                                  className="on_active"
                                  checked={siConGuias}
                                  value={siConGuias}
                                  disabled
                                />
                              </div>
                              <div className="content_checkBox2">
                                <span className="">No</span>
                                <input
                                  type="checkbox"
                                  className="on_active"
                                  value={noConGuias}
                                  checked={noConGuias}
                                  disabled
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              ) : (
                ""
              )}
              <label
                className="form-label titulos_labels"
                style={{ margin: "20px 0 10px 0" }}
              >
                OTROS:{" "}
              </label>

              <div className="mb-3 col-md-12 div_general_box div_general_box2">
                <div className="mb-3 col-md-12">
                  <textarea
                    type="text"
                    className="form-control areas_textos colorarea"
                    cols="70"
                    required
                    value={otrosAnalisis}
                    disabled
                  ></textarea>
                </div>
              </div>
            </div>

            <Modal show={show} onHide={handleClose} animation={false}>
              <Modal.Body>
                <AgregarOdontologo cerrar={handleClose} />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Cerrar
                </Button>
                {/* <Button variant="primary" onClick={handleClose}>
                            Save Changes
                        </Button> */}
              </Modal.Footer>
            </Modal>
          </form>
        </div>
      ) : (
        <div className="dot-spinner dot-spinner3">
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
  );
};

export default EditarOrdenVirtual;
