import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Global } from "../../../../helper/Global";
import logo from "./../../../../assets/logos/logo.png";
import Accordion from "react-bootstrap/Accordion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";

const EditarOrdenVirtual = ({ setLoadingeyes, loadingeyes }) => {
    const [loading, setLoading] = useState(true);
    const[serviciosEstate, setServiciosState]= useState([]);
    const[llenarserv, setLlenarServ]= useState([]);

    const {id} = useParams();
    const[impresionCheck, setImpresionCheck] = useState([]);
    let token = localStorage.getItem("token");
    const[varon, setVaron] = useState(false);
    const[mujer, setMujer] = useState(false);
    const[idServicio, setIdServicio] = useState(0);
    const[odontologos, setOdontologos] = useState([]);
    const[servicios, setServicios] = useState([]);
    const[items, setItems] = useState([]);
    const [elementos, setElementos] = useState([]);
    const [search, setSearch] = useState('');
    const[nombres, setNombres] = useState("");
    const[edad, setEdad] = useState(0);
    const[celular, setCelular] = useState(0);
    const[genero, setGenero] = useState(0);
    const[fecha, setFecha] = useState(0);
    const[odontologo, setOdontologo] = useState("");
    const[cop, setCop] = useState("");
    const[emailOdon, setEmailOdon] = useState("");
    const[botonDoctor, setBotonDoctor] = useState(false);
    const[correo_paciente, setCorreoPaciente] = useState("");
    const[celular_Odon, setCelular_Odon] = useState("");
    const[insumoC, setInsumoC]= useState({});

    //ORDEN VIRTUAL
    const[idPaciente,setIdPaciente] = useState(0);
    const[idOdontologo, setIdOdontologo] = useState(0);
    const[consulta, setConsulta] = useState("");
    const[estadoG, setEstadoG] = useState(0);

    const[box18, setBox18] = useState(false);
    const[box17, setBox17] = useState(false);
    const[box16, setBox16] = useState(false);
    const[box15, setBox15] = useState(false);
    const[box14, setBox14] = useState(false);
    const[box13, setBox13] = useState(false);
    const[box12, setBox12] = useState(false);
    const[box11, setBox11] = useState(false);

    const[box21, setBox21] = useState(false);
    const[box22, setBox22] = useState(false);
    const[box23, setBox23] = useState(false);
    const[box24, setBox24] = useState(false);
    const[box25, setBox25] = useState(false);
    const[box26, setBox26] = useState(false);
    const[box27, setBox27] = useState(false);
    const[box28, setBox28] = useState(false);

    const[box48, setBox48] = useState(false);
    const[box47, setBox47] = useState(false);
    const[box46, setBox46] = useState(false);
    const[box45, setBox45] = useState(false);
    const[box44, setBox44] = useState(false);
    const[box43, setBox43] = useState(false);
    const[box42, setBox42] = useState(false);
    const[box41, setBox41] = useState(false);

    const[box31, setBox31] = useState(false);
    const[box32, setBox32] = useState(false);
    const[box33, setBox33] = useState(false);
    const[box34, setBox34] = useState(false);
    const[box35, setBox35] = useState(false);
    const[box36, setBox36] = useState(false);
    const[box37, setBox37] = useState(false);
    const[box38, setBox38] = useState(false);

    const[siConGuias, setSiConGuias] = useState(false);
    const[noConGuias, setNoConGuias] = useState(false);

    const[otrosAnalisis, setOtrosAnalisis] = useState("");
    const[totalPrecio, setTotalPrecio] = useState(0);
    const[metodoPago, setMetodoPago] = useState("");
    const[agregarComisiones, setAgregarComisiones] = useState(false);
    const[fechaCreacion, setFechaCreacion] = useState("");

    const getInsumo= async () =>{
        setLoading(true);
            const request = await axios.get(`${Global.url}/oneInsumo/1`,{
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(request)
        setInsumoC(request.data);
        setLoading(false);
    };

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

    const getAllOdontologos= async () =>{
        setLoading(true);
        const request = await axios.get(`${Global.url}/allOdontologos`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        });
        setOdontologos(request.data);
    };

    const getAllServicios= async () =>{
        setLoading(true);
        const request = await axios.get(`${Global.url}/allServicios`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        });
        setServicios(request.data)
        setIdServicio(request.data[0].id);
    };

    const getAllItems= async () =>{
        setLoading(true);
        const request = await axios.get(`${Global.url}/allItemServices`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        });
        setItems(request.data);
    };

    const AGREGARPRECIO = () =>{
        let count=0;
        if(agregarComisiones == false){
            for (let i = 0; i < elementos.length; i++) {
                for (let j = 0; j <impresionCheck.length; j++) {
                    if(elementos[i].estado == true && elementos[i].precio == (elementos[i].precio_impresion)-(elementos[i].comision_impreso)){
                        elementos[i].precio = (elementos[i].precio_impresion);
                    }else if(elementos[i].estado == true && elementos[i].precio == (elementos[i].precio_digital)-(elementos[i].comision_digital)){
                        elementos[i].precio = (elementos[i].precio_digital);
                    }
                    if(elementos[i].id_servicio == impresionCheck[j].id && impresionCheck[j].estado == true && elementos[i].estado == true){
                        elementos[i].precio = elementos[i].precio_impresion;
                    }else  if(elementos[i].id_servicio == impresionCheck[j].id && impresionCheck[j].estado == false && elementos[i].estado == true){
                        elementos[i].precio = elementos[i].precio_digital;
                    }
                    count++;
                }
            }
            if(count == 0){
                for (let i = 0; i < elementos.length; i++) {
                    count=0;
                    elementos[i].precio = elementos[i].precio_digital;
                }
            }    
        }else{
            for (let i = 0; i < elementos.length; i++) {
                for (let j = 0; j <impresionCheck.length; j++) {
                    if(elementos[i].estado == true && elementos[i].precio == elementos[i].precio_impresion){
                        elementos[i].precio = (elementos[i].precio_impresion)-(elementos[i].comision_impreso);
                    }else if(elementos[i].estado == true && elementos[i].precio == elementos[i].precio_digital){
                        elementos[i].precio = (elementos[i].precio_digital)-(elementos[i].comision_digital);
                    }
                    count++;
                }
            }

            if(count == 0){
                for (let i = 0; i < elementos.length; i++) {
                    count=0;
                    elementos[i].precio = (elementos[i].precio_digital)-(elementos[i].comision_digital);
                }
            }   

        }  
        setTotalPrecio(elementos.reduce((acumulador, producto) => {
            return acumulador = acumulador + (
                producto.estado == true ? 
                (parseFloat(producto.precio)) 
                : 0
                );
        }, 0))
    }

    useEffect(()=>{
        AGREGARPRECIO();
    },[agregarComisiones])
    
    useEffect(()=>{
        AGREGARPRECIO();
    }, [impresionCheck])

    useEffect(()=>{
        AGREGARPRECIO();
        arreglosyaenviad()
    }, [elementos])

    useEffect(()=>{
        filterDate()
    }, [search])


    useEffect(()=>{
        search.length == 0 ? setBotonDoctor(false) : setBotonDoctor(true);
    }, [search])

    useEffect(() =>{
        getAllOdontologos();
        getAllServicios();
        getAllItems();
        getOneOrden();
        getInsumo()
    },[])

    const filterDate = async() =>{
        
        if(search.length > 4){
            const filter = odontologos.filter(
            odon => odon.cop.toString() == (search)
            );

            if(filter.length == 1) {
                if(filter[0].cop.toString().length == search.length){
                    setOdontologo(`${filter[0].nombres} ${filter[0].apellido_p} ${filter[0].apellido_m}`);
                    setCop(filter[0].cop);
                    setIdOdontologo(filter[0].id);
                    setEmailOdon(filter[0].correo);
                    setBotonDoctor(false);
                    return filter[0];
                }
            }else{
                const filter = [];
                setOdontologo("");
                setCop("");
                setEmailOdon("");
                return filter[0];
            }

        }else if(search.length == 0){
            const oneOdontologo = await axios.get(`${Global.url}/oneOdontologo/${idOdontologo}`,{
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            });
            setOdontologo(`${oneOdontologo.data.nombres} ${oneOdontologo.data.apellido_p} ${oneOdontologo.data.apellido_m}`);
            setCop(oneOdontologo.data.cop);
            setIdOdontologo(oneOdontologo.data.id);
            setEmailOdon(oneOdontologo.data.correo);
        }else{
            const filter = [];
            setOdontologo("");
            setCop("");
            setEmailOdon("");
            return filter[0];
        }
    }

    const getOneOrden = async() =>{
        setLoading(true);
        const oneOrden = await axios.get(`${Global.url}/oneOrdenVirtual/${id}`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        });

        setIdPaciente(oneOrden.data.verOrden.id_paciente);
        setIdOdontologo (oneOrden.data.verOrden.id_odontologo);
        setConsulta(oneOrden.data.verOrden.consulta);

        setBox18(oneOrden.data.verOrden.box18 == 1 ? true : false)
        setBox17(oneOrden.data.verOrden.box17 == 1 ? true : false)
        setBox16(oneOrden.data.verOrden.box16 == 1 ? true : false)
        setBox15(oneOrden.data.verOrden.box15 == 1 ? true : false)
        setBox14(oneOrden.data.verOrden.box14 == 1 ? true : false)
        setBox13(oneOrden.data.verOrden.box13 == 1 ? true : false)
        setBox12(oneOrden.data.verOrden.box12 == 1 ? true : false)
        setBox11(oneOrden.data.verOrden.box11 == 1 ? true : false)

        setBox21(oneOrden.data.verOrden.box21 == 1 ? true : false)
        setBox22(oneOrden.data.verOrden.box22 == 1 ? true : false)
        setBox23(oneOrden.data.verOrden.box23 == 1 ? true : false)
        setBox24(oneOrden.data.verOrden.box24 == 1 ? true : false)
        setBox25(oneOrden.data.verOrden.box25 == 1 ? true : false)
        setBox26(oneOrden.data.verOrden.box26 == 1 ? true : false)
        setBox27(oneOrden.data.verOrden.box27 == 1 ? true : false)
        setBox28(oneOrden.data.verOrden.box28 == 1 ? true : false)

        setBox48(oneOrden.data.verOrden.box48 == 1 ? true : false)
        setBox47(oneOrden.data.verOrden.box47 == 1 ? true : false)
        setBox46(oneOrden.data.verOrden.box46 == 1 ? true : false)
        setBox45(oneOrden.data.verOrden.box45 == 1 ? true : false)
        setBox44(oneOrden.data.verOrden.box44 == 1 ? true : false)
        setBox43(oneOrden.data.verOrden.box43 == 1 ? true : false)
        setBox42(oneOrden.data.verOrden.box42 == 1 ? true : false)
        setBox41(oneOrden.data.verOrden.box41 == 1 ? true : false)

        setBox31(oneOrden.data.verOrden.box31 == 1 ? true : false)
        setBox32(oneOrden.data.verOrden.box32 == 1 ? true : false)
        setBox33(oneOrden.data.verOrden.box33 == 1 ? true : false)
        setBox34(oneOrden.data.verOrden.box34 == 1 ? true : false)
        setBox35(oneOrden.data.verOrden.box35 == 1 ? true : false)
        setBox36(oneOrden.data.verOrden.box36 == 1 ? true : false)
        setBox37(oneOrden.data.verOrden.box37 == 1 ? true : false)
        setBox38(oneOrden.data.verOrden.box38 == 1 ? true : false)

        setSiConGuias(oneOrden.data.verOrden.siConGuias == 1 ? true : false)
        setNoConGuias(oneOrden.data.verOrden.noConGuias == 1 ? true : false )

        setOtrosAnalisis(oneOrden.data.verOrden.otrosAnalisis)
        setTotalPrecio(oneOrden.data.verOrden.precio_final)
        setMetodoPago(oneOrden.data.verOrden.metodoPago == null ? 0 : oneOrden.data.verOrden.metodoPago    )
        setEstadoG(oneOrden.data.verOrden.estado)
        const fecha_at = new Date(oneOrden.data.verOrden.created_at)
        setFechaCreacion(`${fecha_at.toLocaleTimeString()} - ${fecha_at.toLocaleDateString()}`)
        setImpresionCheck(JSON.parse(oneOrden.data.verOrden.listaServicios))

        setServiciosState(JSON.parse(oneOrden.data.verOrden.impresionServicios))
        setLlenarServ(JSON.parse(oneOrden.data.verOrden.arryServicios))

        setElementos(JSON.parse(oneOrden.data.verOrden.listaItems))
        setAgregarComisiones(oneOrden.data.verOrden.activeComision == 1 ? true : false);

        const onePaciente = await axios.get(`${Global.url}/onePaciente/${oneOrden.data.verOrden.id_paciente}`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        });
        setNombres(`${onePaciente.data.nombres} ${onePaciente.data.apellido_p} ${onePaciente.data.apellido_m}`);
        setEdad(calcularEdad(onePaciente.data.f_nacimiento));
        setFecha(onePaciente.data.f_nacimiento == null ? "" : new Date(onePaciente.data.f_nacimiento));
        setCelular(onePaciente.data.celular);
        setGenero(onePaciente.data.genero);
        setCorreoPaciente(onePaciente.data.correo);

        if(onePaciente.data.genero == 0 ){
            setVaron(true);
        }else if (onePaciente.data.genero == 1){
            setMujer(true);
        }

        const oneOdontologo = await axios.get(`${Global.url}/oneOdontologo/${oneOrden.data.verOrden.id_odontologo}`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        });

        setOdontologo(`${oneOdontologo.data.nombres == "No tiene un odontólogo asignado" ? "" :  oneOdontologo.data.nombres} ${oneOdontologo.data.apellido_p} ${oneOdontologo.data.apellido_m}`);
        setCop(oneOdontologo.data.cop == 0 ? "" : oneOdontologo.data.cop);
        setCelular_Odon(oneOdontologo.data.celular)
        setIdOdontologo(oneOdontologo.data.id);
        setEmailOdon(oneOdontologo.data.correo);
        setLoading(false);
    }

    const arreglosyaenviad =() =>{
        for(let i = 0; i < llenarserv.length; i++){
            const llenos = elementos.some(objeto => objeto.estado == true && objeto.id_servicio ==  llenarserv[i].id_servicio)
            if(llenos == false){
                const index = serviciosEstate.findIndex(item => item.id_servicio == llenarserv[i].id_servicio);
                if (index !== -1) {
                    serviciosEstate.splice(index, 1);
                } 
            }else{
                const existe = serviciosEstate.find(id => id.id_servicio == llenarserv[i].id_servicio);
                if (!existe) {
                    setServiciosState([...serviciosEstate, llenarserv[i]])
                }
            }
        }
    }

    const validarEstado =(estad) => {
        if(estad == 0) {
            setShow3(true)
        }   
        if(estad == 1){
            Swal.fire({
                title: '',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Exámen realizado',
                denyButtonText: `Registrar Nota de Crédito`,
              }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    agregarStado2();
                } else if (result.isDenied) {
                    setShow4(true)
                }
              })
        }
        if(estad == 2){
            Swal.fire({
                title: '',
                showCancelButton: true,
                confirmButtonText: 'Cambiar Estado',
              }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    agregarStado1();
                } 
              })
        }
        if(estad == 3){
            setShow3(true)
        }
    }

    const agregarStado2 = async () => {
        const data = new FormData();
        data.append('estado', 2);
        data.append('_method', 'PUT');

        try {
            let respuesta = await axios.post(`${Global.url}/updateOrdenFactura/${id}`, data,{
            headers:{
                'Authorization': `Bearer ${token}`
                } });

            if(respuesta.data.status == "success"){   
                setEstadoG(2);
                Swal.fire('Editado correctamente', '', 'success');
            }  else{
                Swal.fire('Error', '', 'error');
            }
        } catch (error) {
            console.log(error)
            Swal.fire('Error', '', 'error');
        }
    }

    const agregarStado1 = async () => {
        const data2 = new FormData();
        data2.append('estado', 1);
        data2.append('_method', 'PUT');
        try {
            let respuesta2 = await axios.post(`${Global.url}/updateOrdenFactura/${id}`, data2,{
            headers:{
                'Authorization': `Bearer ${token}`
                } });

            if(respuesta2.data.status == "success"){   
                setEstadoG(1);
                Swal.fire('Editado correctamente', '', 'success');
            }  else{
                Swal.fire('Error', '', 'error');
            }
        } catch (error) {
            console.log(error)
            Swal.fire('Error', '', 'error');
        }
    }

  return (
    <div className="container col-md-12 mt-12" style={{ padding: "0" }}>
      {loading == false ? (
        <div className="card">
          <div className="card-header fw-bold">Orden Virtual:</div>
          <form
            className="p-4 needs-validation"
            disabled
            style={{ position: "relative" }}
          >
            <div className="d-flex justify-content-between mt-4">
              <div className="mb-3 col-md-12 content_img">
                <img src={logo} alt="" />
              </div>
            </div>
            <div className="mb-3 col-md-12" style={{ margin: "0 auto" }}>
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
                    value={totalPrecio}
                    type="text"
                  />
                </div>
                <div className="mb-3 col-md-3 div_conten2">
                  <label className="label_title col-md-5">
                    Restar comisiones:{" "}
                  </label>
                  <input
                    type="checkbox"
                    className="on_active"
                    disabled
                    value={agregarComisiones}
                    checked={agregarComisiones}
                  />
                </div>
                <div className="mb-3 col-md-5 div_conten">
                  <label className="label_title col-md-5">
                    Método de pago:{" "}
                  </label>
                  <select
                    value={metodoPago}
                    type="text"
                    className=" form-select2"
                    autoFocus
                    disabled
                    required
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
                      style={{ background: "rgb(191, 191, 31)" }}
                      className="button_estado"
                      type="button"
                      value={"Creado"}
                      onClick={() => {
                        validarEstado(0);
                      }}
                    />
                  ) : estadoG == 1 ? (
                    <input
                      style={{ background: "green" }}
                      className="button_estado"
                      type="button"
                      value="Pagado con documento electrónico"
                      onClick={() => {
                        validarEstado(1);
                      }}
                    />
                  ) : estadoG == 2 ? (
                    <input
                      style={{ background: "#D23741" }}
                      className="button_estado"
                      type="button"
                      value="Exámen Realizado"
                      onClick={() => {
                        validarEstado(2);
                      }}
                    />
                  ) : estadoG == 3 ? (
                    <input
                      style={{ background: "#01C2D4" }}
                      className="button_estado"
                      type="button"
                      value="Pagado sin documento electrónico"
                      onClick={() => {
                        validarEstado(3);
                      }}
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
                    checked={varon}
                  />
                  <span className="">F</span>
                  <input
                    value={mujer}
                    type="checkbox"
                    className="on_active"
                    disabled
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
                    value={cop}
                    type="text"
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
                    style={{ textAlign: "left" }}
                  />
                </div>
              </div>

              <Accordion
                style={{ marginTop: "20px" }}
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
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              height: "80px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              className="boxes_black"
                            >
                              D
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
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
                                    <span
                                      className=""
                                      value={box18}
                                      onClick={() => setBox18(!box18)}
                                      style={{ userSelect: "none" }}
                                    >
                                      1.8
                                    </span>
                                  </div>
                                  <div className="content_cuadrados">
                                    <input
                                      type="checkbox"
                                      className=""
                                      value={box17}
                                      disabled
                                      checked={box17}
                                    />
                                    <span
                                      className=""
                                      value={box17}
                                      onClick={() => setBox17(!box17)}
                                      style={{ userSelect: "none" }}
                                    >
                                      1.7
                                    </span>
                                  </div>
                                  <div className="content_cuadrados">
                                    <input
                                      type="checkbox"
                                      className=""
                                      value={box16}
                                      disabled
                                      checked={box16}
                                    />
                                    <span
                                      className=""
                                      value={box16}
                                      onClick={() => setBox16(!box16)}
                                      style={{ userSelect: "none" }}
                                    >
                                      1.6
                                    </span>
                                  </div>
                                  <div className="content_cuadrados">
                                    <input
                                      type="checkbox"
                                      className=""
                                      value={box15}
                                      disabled
                                      checked={box15}
                                    />
                                    <span
                                      className=""
                                      value={box15}
                                      onClick={() => setBox15(!box15)}
                                      style={{ userSelect: "none" }}
                                    >
                                      1.5
                                    </span>
                                  </div>
                                  <div className="content_cuadrados">
                                    <input
                                      type="checkbox"
                                      className=""
                                      value={box14}
                                      disabled
                                      checked={box14}
                                    />
                                    <span
                                      className=""
                                      value={box14}
                                      onClick={() => setBox14(!box14)}
                                      style={{ userSelect: "none" }}
                                    >
                                      1.4
                                    </span>
                                  </div>
                                  <div className="content_cuadrados">
                                    <input
                                      type="checkbox"
                                      className=""
                                      value={box13}
                                      disabled
                                      checked={box13}
                                    />
                                    <span
                                      className=""
                                      value={box13}
                                      onClick={() => setBox13(!box13)}
                                      style={{ userSelect: "none" }}
                                    >
                                      1.3
                                    </span>
                                  </div>
                                  <div className="content_cuadrados">
                                    <input
                                      type="checkbox"
                                      className=""
                                      value={box12}
                                      disabled
                                      checked={box12}
                                    />
                                    <span
                                      className=""
                                      value={box12}
                                      onClick={() => setBox12(!box12)}
                                      style={{ userSelect: "none" }}
                                    >
                                      1.2
                                    </span>
                                  </div>
                                  <div className="content_cuadrados">
                                    <input
                                      type="checkbox"
                                      className=""
                                      value={box11}
                                      disabled
                                      checked={box11}
                                    />
                                    <span
                                      className=""
                                      value={box11}
                                      onClick={() => setBox11(!box11)}
                                      style={{ userSelect: "none" }}
                                    >
                                      1.1
                                    </span>
                                  </div>
                                  <div className="content_cuadrados">
                                    <input
                                      type="checkbox"
                                      className=""
                                      value={box21}
                                      disabled
                                      checked={box21}
                                    />
                                    <span
                                      className=""
                                      value={box21}
                                      onClick={() => setBox21(!box21)}
                                      style={{ userSelect: "none" }}
                                    >
                                      2.1
                                    </span>
                                  </div>
                                  <div className="content_cuadrados">
                                    <input
                                      type="checkbox"
                                      className=""
                                      value={box22}
                                      disabled
                                      checked={box22}
                                    />
                                    <span
                                      className=""
                                      value={box22}
                                      onClick={() => setBox22(!box22)}
                                      style={{ userSelect: "none" }}
                                    >
                                      2.2
                                    </span>
                                  </div>
                                  <div className="content_cuadrados">
                                    <input
                                      type="checkbox"
                                      className=""
                                      value={box23}
                                      disabled
                                      checked={box23}
                                    />
                                    <span
                                      className=""
                                      value={box23}
                                      onClick={() => setBox23(!box23)}
                                      style={{ userSelect: "none" }}
                                    >
                                      2.3
                                    </span>
                                  </div>
                                  <div className="content_cuadrados">
                                    <input
                                      type="checkbox"
                                      className=""
                                      value={box24}
                                      disabled
                                      checked={box24}
                                    />
                                    <span
                                      className=""
                                      value={box24}
                                      onClick={() => setBox24(!box24)}
                                      style={{ userSelect: "none" }}
                                    >
                                      2.4
                                    </span>
                                  </div>
                                  <div className="content_cuadrados">
                                    <input
                                      type="checkbox"
                                      className=""
                                      value={box25}
                                      disabled
                                      checked={box25}
                                    />
                                    <span
                                      className=""
                                      value={box25}
                                      onClick={() => setBox25(!box25)}
                                      style={{ userSelect: "none" }}
                                    >
                                      2.5
                                    </span>
                                  </div>
                                  <div className="content_cuadrados">
                                    <input
                                      type="checkbox"
                                      className=""
                                      value={box26}
                                      disabled
                                      checked={box26}
                                    />
                                    <span
                                      className=""
                                      value={box26}
                                      onClick={() => setBox26(!box26)}
                                      style={{ userSelect: "none" }}
                                    >
                                      2.6
                                    </span>
                                  </div>
                                  <div className="content_cuadrados">
                                    <input
                                      type="checkbox"
                                      className=""
                                      value={box27}
                                      disabled
                                      checked={box27}
                                    />
                                    <span
                                      className=""
                                      value={box27}
                                      onClick={() => setBox27(!box27)}
                                      style={{ userSelect: "none" }}
                                    >
                                      2.7
                                    </span>
                                  </div>
                                  <div className="content_cuadrados">
                                    <input
                                      type="checkbox"
                                      className=""
                                      value={box28}
                                      disabled
                                      checked={box28}
                                    />
                                    <span
                                      className=""
                                      value={box28}
                                      onClick={() => setBox28(!box28)}
                                      style={{ userSelect: "none" }}
                                    >
                                      2.8
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-12 ">
                                <div className="mb-3 col-md-12 div_tercero">
                                  <div className="content_cuadrados">
                                    <input
                                      type="checkbox"
                                      className=""
                                      value={box48}
                                      disabled
                                      checked={box48}
                                    />
                                    <span
                                      className=""
                                      value={box48}
                                      onClick={() => setBox48(!box48)}
                                      style={{ userSelect: "none" }}
                                    >
                                      4.8
                                    </span>
                                  </div>
                                  <div className="content_cuadrados">
                                    <input
                                      type="checkbox"
                                      className=""
                                      value={box47}
                                      disabled
                                      checked={box47}
                                    />
                                    <span
                                      className=""
                                      value={box47}
                                      onClick={() => setBox47(!box47)}
                                      style={{ userSelect: "none" }}
                                    >
                                      4.7
                                    </span>
                                  </div>
                                  <div className="content_cuadrados">
                                    <input
                                      type="checkbox"
                                      className=""
                                      value={box46}
                                      disabled
                                      checked={box46}
                                    />
                                    <span
                                      className=""
                                      value={box46}
                                      onClick={() => setBox46(!box46)}
                                      style={{ userSelect: "none" }}
                                    >
                                      4.6
                                    </span>
                                  </div>
                                  <div className="content_cuadrados">
                                    <input
                                      type="checkbox"
                                      className=""
                                      value={box45}
                                      disabled
                                      checked={box45}
                                    />
                                    <span
                                      className=""
                                      value={box45}
                                      onClick={() => setBox45(!box45)}
                                      style={{ userSelect: "none" }}
                                    >
                                      4.5
                                    </span>
                                  </div>
                                  <div className="content_cuadrados">
                                    <input
                                      type="checkbox"
                                      className=""
                                      value={box44}
                                      disabled
                                      checked={box44}
                                    />
                                    <span
                                      className=""
                                      value={box44}
                                      onClick={() => setBox44(!box44)}
                                      style={{ userSelect: "none" }}
                                    >
                                      4.4
                                    </span>
                                  </div>
                                  <div className="content_cuadrados">
                                    <input
                                      type="checkbox"
                                      className=""
                                      value={box43}
                                      disabled
                                      checked={box43}
                                    />
                                    <span
                                      className=""
                                      value={box43}
                                      onClick={() => setBox43(!box43)}
                                      style={{ userSelect: "none" }}
                                    >
                                      4.3
                                    </span>
                                  </div>
                                  <div className="content_cuadrados">
                                    <input
                                      type="checkbox"
                                      className=""
                                      value={box42}
                                      disabled
                                      checked={box42}
                                    />
                                    <span
                                      className=""
                                      value={box42}
                                      onClick={() => setBox42(!box42)}
                                      style={{ userSelect: "none" }}
                                    >
                                      4.2
                                    </span>
                                  </div>
                                  <div className="content_cuadrados">
                                    <input
                                      type="checkbox"
                                      className=""
                                      value={box41}
                                      disabled
                                      checked={box41}
                                    />
                                    <span
                                      className=""
                                      value={box41}
                                      onClick={() => setBox41(!box41)}
                                      style={{ userSelect: "none" }}
                                    >
                                      4.1
                                    </span>
                                  </div>

                                  <div className="content_cuadrados">
                                    <input
                                      type="checkbox"
                                      className=""
                                      value={box31}
                                      disabled
                                      checked={box31}
                                    />
                                    <span
                                      className=""
                                      value={box31}
                                      onClick={() => setBox31(!box31)}
                                      style={{ userSelect: "none" }}
                                    >
                                      3.1
                                    </span>
                                  </div>
                                  <div className="content_cuadrados">
                                    <input
                                      type="checkbox"
                                      className=""
                                      value={box32}
                                      disabled
                                      checked={box32}
                                    />
                                    <span
                                      className=""
                                      value={box32}
                                      onClick={() => setBox32(!box32)}
                                      style={{ userSelect: "none" }}
                                    >
                                      3.2
                                    </span>
                                  </div>
                                  <div className="content_cuadrados">
                                    <input
                                      type="checkbox"
                                      className=""
                                      value={box33}
                                      disabled
                                      checked={box33}
                                    />
                                    <span
                                      className=""
                                      value={box33}
                                      onClick={() => setBox33(!box33)}
                                      style={{ userSelect: "none" }}
                                    >
                                      3.3
                                    </span>
                                  </div>
                                  <div className="content_cuadrados">
                                    <input
                                      type="checkbox"
                                      className=""
                                      value={box34}
                                      disabled
                                      checked={box34}
                                    />
                                    <span
                                      className=""
                                      value={box34}
                                      onClick={() => setBox34(!box34)}
                                      style={{ userSelect: "none" }}
                                    >
                                      3.4
                                    </span>
                                  </div>
                                  <div className="content_cuadrados">
                                    <input
                                      type="checkbox"
                                      className=""
                                      value={box35}
                                      disabled
                                      checked={box35}
                                    />
                                    <span
                                      className=""
                                      value={box35}
                                      onClick={() => setBox35(!box35)}
                                      style={{ userSelect: "none" }}
                                    >
                                      3.5
                                    </span>
                                  </div>
                                  <div className="content_cuadrados">
                                    <input
                                      type="checkbox"
                                      className=""
                                      value={box36}
                                      disabled
                                      checked={box36}
                                    />
                                    <span
                                      className=""
                                      value={box36}
                                      onClick={() => setBox36(!box36)}
                                      style={{ userSelect: "none" }}
                                    >
                                      3.6
                                    </span>
                                  </div>
                                  <div className="content_cuadrados">
                                    <input
                                      type="checkbox"
                                      className=""
                                      value={box37}
                                      disabled
                                      checked={box37}
                                    />
                                    <span
                                      className=""
                                      value={box37}
                                      onClick={() => setBox37(!box37)}
                                      style={{ userSelect: "none" }}
                                    >
                                      3.7
                                    </span>
                                  </div>
                                  <div className="content_cuadrados">
                                    <input
                                      type="checkbox"
                                      className=""
                                      value={box38}
                                      disabled
                                      checked={box38}
                                    />
                                    <span
                                      className=""
                                      value={box38}
                                      onClick={() => setBox38(!box38)}
                                      style={{ userSelect: "none" }}
                                    >
                                      3.8
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              className="boxes_black"
                            >
                              I
                            </div>
                          </div>

                          <div
                            className="mb-3 col-md-12 div_bot_box2"
                            style={{ paddingTop: "10px" }}
                          >
                            <span className="label_title2">
                              MUY IMPORTANTE: ¿El paciente es enviado con guias?
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
                                checked={noConGuias}
                                value={noConGuias}
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
                    value={otrosAnalisis}
                    disabled
                  ></textarea>
                </div>
              </div>
            </div>
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
