import React, { useEffect, useState } from 'react';
import { Link, useNavigate,useParams} from 'react-router-dom';
import axios from 'axios';
import { Global } from '../../../../helper/Global';
import Swal from 'sweetalert2';
import logo from "./../../../../assets/logos/logo.png";
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import AgregarOdontologo from './AgregarOdontologo';
import { BsPlusCircleFill } from "react-icons/bs";
import AgregarClinica from './AgregarFactura';
import AgregarFactura from './AgregarFactura';
import AgregarNota from './AgregarNota';
import ListaFacturas from './ListaFacturas';
import ListaClientes from './ListaClientes';
import sunat from './../../../../assets/admin/sunat.png';
import useAuth from '../../../../hooks/useAuth';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";

const EditarOrdenVirtual = () => {

    const {auth} = useAuth();
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

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [show2, setShow2] = useState(false);
    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);

    const [show3, setShow3] = useState(false);
    const handleClose3 = () => setShow3(false);
    const handleShow3 = () => setShow3(true);

    const [show4, setShow4] = useState(false);
    const handleClose4 = () => setShow4(false);
    const handleShow4 = () => setShow4(true);

    const [show5, setShow5] = useState(false);
    const handleClose5 = () => setShow5(false);
    const handleShow5 = () => setShow5(true);


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

    const onSeachChange = ({target}) =>{
        setSearch(target.value);
    }

    function quitarAcentos(cadena){
        const acentos = {'á':'a','é':'e','í':'i','ó':'o','ú':'u','Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U'};
        return cadena.split('').map( letra => acentos[letra] || letra).join('').toString();	
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
        const ordenExisente = impresionCheck.findIndex((ordenExisente) => (
                ordenExisente.id == orden.id
            )
        );
            
          if (ordenExisente == -1) {
            setImpresionCheck([...impresionCheck, orden]);
          } else {
            const nuevaOrden = [...impresionCheck];
            nuevaOrden[ordenExisente] = orden;
            setImpresionCheck(nuevaOrden);
          }
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

    const UpdateOrdenVirtual = async (e) => {
        e.preventDefault();
        if(elementos.length == 0 || !elementos.some(elemento => elemento.estado == true)){
            Swal.fire('Seleccionar un tipo de exámen', '', 'error');
        }else{
            setLoading(true)
            let token = localStorage.getItem("token");

            const data = new FormData();
            data.append('id_modificacion', auth.id);
            data.append('id_paciente', idPaciente);
            data.append('id_odontologo', idOdontologo);

            let oneClinica = await axios.get(`${Global.url}/oneOdontologo/${idOdontologo}`,{
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            });

            data.append('id_clinica', oneClinica.data.clinica);

            data.append('consulta', consulta);

            data.append('box18', box18 == true ? 1 : 0);
            data.append('box17', box17 == true ? 1 : 0);
            data.append('box16', box16 == true ? 1 : 0);
            data.append('box15', box15 == true ? 1 : 0);
            data.append('box14', box14 == true ? 1 : 0);
            data.append('box13', box13 == true ? 1 : 0);
            data.append('box12', box12 == true ? 1 : 0);
            data.append('box11', box11 == true ? 1 : 0);

            data.append('box21', box21 == true ? 1 : 0);
            data.append('box22', box22 == true ? 1 : 0);
            data.append('box23', box23 == true ? 1 : 0);
            data.append('box24', box24 == true ? 1 : 0);
            data.append('box25', box25 == true ? 1 : 0);
            data.append('box26', box26 == true ? 1 : 0);
            data.append('box27', box27 == true ? 1 : 0);
            data.append('box28', box28 == true ? 1 : 0);

            data.append('box48', box48 == true ? 1 : 0);
            data.append('box47', box47 == true ? 1 : 0);
            data.append('box46', box46 == true ? 1 : 0);
            data.append('box45', box45 == true ? 1 : 0);
            data.append('box44', box44 == true ? 1 : 0);
            data.append('box43', box43 == true ? 1 : 0);
            data.append('box42', box42 == true ? 1 : 0);
            data.append('box41', box41 == true ? 1 : 0);

            data.append('box31', box31 == true ? 1 : 0);
            data.append('box32', box32 == true ? 1 : 0);
            data.append('box33', box33 == true ? 1 : 0);
            data.append('box34', box34 == true ? 1 : 0);
            data.append('box35', box35 == true ? 1 : 0);
            data.append('box36', box36 == true ? 1 : 0);
            data.append('box37', box37 == true ? 1 : 0);
            data.append('box38', box38 == true ? 1 : 0);

            data.append('siConGuias', siConGuias == true ? 1 : 0);
            data.append('noConGuias', noConGuias == true ? 1 : 0);

            data.append('listaServicios', JSON.stringify(impresionCheck));

            data.append('impresionServicios', JSON.stringify(serviciosEstate));
            data.append('arryServicios', JSON.stringify(llenarserv));

            data.append('listaItems', JSON.stringify(elementos));
            data.append('precio_final', totalPrecio);
            data.append('metodoPago', metodoPago == null ? "" : metodoPago);

            data.append('otrosAnalisis', otrosAnalisis);
            data.append('estado', estadoG);
            data.append('activeComision', agregarComisiones == true ? 1 : 0);

            data.append('_method', 'PUT');

            try {
                let respuesta= await axios.post(`${Global.url}/updateOrdenVirtual/${id}`, data,{
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if(respuesta.data.status == "success"){
                    Swal.fire('Editado correctamente', '', 'success');
                    navigate('/admin/ordenVirtual');
                }else{
                    Swal.fire('Error al agregar el registro', '', 'error');
                }
            } catch (error) {
                console.log(error.request.response);
            }
            setLoading(false)
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

    const handleChangeCheckbox = () => {
        const isChecked = !agregarComisiones; // Invierte el valor actual del checkbox
        setAgregarComisiones(isChecked);
      
        if (isChecked) {
          // Mostrar SweetAlert solo cuando se marque el checkbox
          Swal.fire({
            title: '¿Deseas restar las comisiones?',
            showCancelButton: true,
            confirmButtonText: 'SI',
            cancelButtonText: 'NO',
            icon: 'question',
          }).then((result) => {
            if (result.isConfirmed) {
              setAgregarComisiones(true);
            } else {
              setAgregarComisiones(false);
            }
          });
        }
    };
      

    return (
        <div className="container col-md-9 mt-6">
            {loading == false ?
            <div className="card">
                <div className="card-header fw-bold">
                    Editar orden Virtual:
                </div>
                <form className="p-4 needs-validation" onSubmit={UpdateOrdenVirtual}  style={{position: 'relative'}}>
                    <div className='boton_lista_facturas'>
                        <button className='boton_lista_facturas2' onClick={(e)=>{e.preventDefault(), setShow5(true);}}>
                            <img src={sunat} alt="" />
                            Facturas/Boletas Registradas
                        </button>
                    </div>
                    <div className='boton_lista_facturas3'>
                        <a className='boton_lista_facturas4' href={"https://www.sunat.gob.pe/portalanterior.html"} target='_black'>
                            <img src={sunat} alt="" />
                            Generar Factura/Boleta
                        </a>
                    </div>
                    <div className="d-flex justify-content-between mt-4">
                        <div className="mb-3 col-md-12 content_img">
                           <img src={logo} alt="" />
                        </div>
                        
                    </div>
                    <div className="mb-3 col-md-12" style={{margin: '0 auto'}}>
                            <label className="form-label titulos_labels">GENERAL </label>
                            <div className='content_general mb-3 col-md-12'>
                                <div className="mb-3 col-md-4 div_conten2">
                                    <label className="label_title col-md-5">Total a pagar: </label>
                                    <input className="form-control form-control3 form-control2" disabled required
                                        value={(totalPrecio)}
                                        type="text"
                                        onChange={(e) => setTotalPrecio(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-md-3 div_conten2">
                                    <label className="label_title col-md-5">Restar comisiones: </label>
                                    <input type="checkbox" className='on_active'
                                        value={agregarComisiones}
                                        checked={agregarComisiones}
                                        onChange={handleChangeCheckbox}
                                        // onChange={(e) => setAgregarComisiones(e.target.checked)}
                                    />
                                </div>
                                <div className="mb-3 col-md-5 div_conten">
                                    <label className="label_title col-md-5">Método de pago: </label>
                                    <select value={metodoPago} type="text" className=" form-select2" autoFocus required onChange={(e)=> {setMetodoPago(e.target.value)}}>
                                        <option value="0" >POS</option>
                                        <option value="1" >Efectivo</option>
                                        <option value="2" >Transferencia</option>
                                    </select>
                                </div>
                            </div>
                            <div className='content_general mb-3 col-md-12'>
                                <div className="mb-3 col-md-6 div_conten2">
                                    <label className="label_title">ESTADO: </label>
                                    {
                                        estadoG == 0 ?
                                        <input style={{background: 'rgb(191, 191, 31)'}} className="button_estado" type="button" value={"Creado"} onClick={()=> {validarEstado(0)}}/>
                                        : estadoG == 1 ?
                                        <input style={{background: 'green'}} className="button_estado" type="button" value="Pagado con documento electrónico" onClick={()=> {validarEstado(1)}}/>
                                        : estadoG == 2 ?
                                        <input style={{background: '#D23741'}} className="button_estado" type="button" value="Exámen Realizado" onClick={()=> {validarEstado(2)}}/>
                                        : estadoG == 3 ?
                                        <input style={{background: '#01C2D4'}} className="button_estado" type="button" value="Pagado sin documento electrónico" onClick={()=> {validarEstado(3)}}/>
                                        : ""
                                    }
                                </div>
                                <div className="mb-3 col-md-6 div_conten">
                                    <label className="label_title col-md-5">Fecha de creacion:</label>
                                    <input className="form-control form-control3 form-control2" disabled
                                        value={fechaCreacion}
                                        type="text"
                                        onChange={(e) => setFechaCreacion(e.target.value)}
                                    />
                                </div>
                            </div>
                            <label className="form-label titulos_labels" style={{margin: '10px 0 10px 0'}}>DATOS DEL PACIENTE </label>
                            <div className='content_general mb-3 col-md-12'>
                                <div className="mb-3 col-md-10 div_conten2">
                                    <label className="label_title col-md-5">Nombres: </label>
                                    <input className="form-control form-control3" disabled  required
                                        value={nombres}
                                        type="text"
                                        onChange={(e) => setNombres(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-md-2 div_conten">
                                    <label className="label_title col-md-5">Edad: </label>
                                    <input className="form-control form-control3 form-control2" disabled  required
                                        value={edad}
                                        type="text"
                                        onChange={(e) => setEdad(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className='content_general mb-3 col-md-12'>
                                <div className="mb-3 col-md-6 div_conten2">
                                    <label className="label_title col-md-5">Fecha de Nacimiento: </label>
                                    <DatePicker
                                        className="form-control form-control3"
                                        selected={fecha}
                                        value={fecha}
                                        disabled
                                        dateFormat="dd/MM/yyyy"
                                        locale={es}
                                    />
                                </div>
                                <div className="mb-3 col-md-6 div_conten" style={{justifyContent: 'start'}}>
                                    <label className="label_title col-md-5">Sexo:</label>
                                    <span className=''>M</span>
                                    <input value={varon} type="checkbox" className='on_active' disabled onChange={(e) => setVaron(e.target.checked)} checked={varon} />
                                    <span className="">F</span>
                                    <input value={mujer} type="checkbox" className='on_active' disabled onChange={(e) => setMujer(e.target.checked)} checked={mujer}/>
                                </div>
                            </div>
                            <div className='content_general mb-3 col-md-12'>
                                <div className="mb-3 col-md-6 div_conten2">
                                    <label className="label_title col-md-5">Correo: </label>
                                    <input className="form-control form-control3 form-control2"  disabled  required
                                        value={correo_paciente}
                                        type="text"
                                        style={{textAlign: 'left'}}
                                    />
                                </div>
                                <div className="mb-3 col-md-6 div_conten">
                                    <label className="label_title col-md-5">Telefono: </label>
                                    <input className="form-control form-control3 form-control2"  disabled  required
                                        value={celular}
                                        type="text"
                                        onChange={(e) => setCelular(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className='content_general mb-3 col-md-12'>
                                <div className="mb-3 col-md-12 div_conten">
                                    <label className="label_title col-md-5" >Motivo de consulta: </label>
                                    <input className="form-control form-control3"  
                                        value={consulta}
                                        type="text"
                                        onChange={(e) => setConsulta(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className='div_busqueda'>
                                <div>
                                    <label className="form-label titulos_labels" style={{margin: '10px 0 10px 0'}}>DATOS DEL DOCTOR(A) </label>
                                    <BsPlusCircleFill style={{marginLeft: '20px', fontSize: '30px', color: '#906B9F', cursor: 'pointer'}} onClick={handleShow}/>
                                </div>
                                <div className="mb-3 col-md-2 boton_agregar_clinica">
                                    <input type="button" className="btn btn-primary btnRegistrar btnRegistrar2" value="Buscar Doctor" onClick={handleShow2} />
                                </div>
                            </div>
                            
                            <div className='content_general mb-3 col-md-12'>
                                <div className="mb-3 col-md-12 div_conten">
                                    <label className="label_title col-md-5">Doctor(a): </label>
                                    <input className="form-control form-control3" required disabled
                                        value={odontologo}
                                        type="text"
                                        onChange={(e) => setOdontologo(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className='content_general mb-3 col-md-12'>
                                <div className="mb-3 col-md-6 div_conten2">
                                    <label className="label_title col-md-5">C.O.P: </label>
                                    <input className="form-control form-control3" required disabled
                                        value={cop}
                                        type="text"
                                        onChange={(e) => setCop(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-md-6 div_conten">
                                    <label className="label_title col-md-5">Celular: </label>
                                    <input className="form-control form-control3 form-control2" required disabled
                                        value={celular_Odon}
                                        type="text"
                                    />
                                </div>
                            </div>
                            <div className='content_general mb-3 col-md-12'>
                                <div className="mb-3 col-md-12 div_conten">
                                    <label className="label_title col-md-5">EMAIL: </label>
                                    <input className="form-control form-control3 form-control2" required disabled
                                        value={emailOdon}
                                        type="text"
                                        onChange={(e) => setEmailOdon(e.target.value)}
                                        style={{textAlign: 'left'}}
                                    />
                                </div>
                            </div>

                            <Accordion  activeKey={servicios.map((servicio) => servicio.id)} style={{marginTop: '20px'}}>
                                {servicios.map((servicio) => (
                                <Accordion.Item eventKey={servicio.id} key={servicio.id}>
                                    <Accordion.Header> 
                                        <label className="form-label titulos_labels" style={{margin: '10px 0 10px 0'}}>{servicio.nombre}</label>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        {
                                            servicio.impreso == 1 ?
                                            <div className='item_impresion'>
                                                <span className=''>¿Desea los resultados en físico?</span>
                                                <input type="checkbox" 
                                                    checked={impresionCheck.find(estado => estado.id == servicio.id)?.estado || false}
                                                    id={"checkboxi"+servicio.id} className='on_active'  
                                                    onChange={(e)=>{llenarImpresion({
                                                        id: servicio.id, 
                                                        estado: e.target.checked, 
                                                    })}}
                                                />
                                            </div>
                                            : ""
                                        }
                                        <div  className='mb-3 col-md-12 div_general_box'>
                                            <ul className="mb-3 col-md-12 div_secundario">
                                                {items.map((item) => (
                                                item.id_servicio == servicio.id ?   
                                                <li key={item.id} className='content_checkBox'>
                                                    <input type="checkbox" 
                                                    checked={elementos.find(estado => estado.id_item == item.id)?.estado || false}
                                                    id={"checkboxi"+item.id} className='on_active'  
                                                    onChange={
                                                        (e)=>{llenarArray({
                                                        id_item: item.id, 
                                                        id_servicio: servicio.id, 
                                                        estado: e.target.checked, 
                                                        estadoServicio: impresionCheck.find(estado => estado.id == servicio.id)?.estado == true ? true : false, 
                                                        precio: item.precio_digital,
                                                        precio_impresion: item.precio_impresion,
                                                        precio_digital: item.precio_digital,
                                                        comision_impreso: item.comision_impreso,
                                                        comision_digital: item.comision_digital,
                                                        insumos1: item.insumos1,
                                                        insumos2: item.insumos2,
                                                        insumos3: item.insumos3,
                                                        insumos4: item.insumos4,

                                                        insumosM1: item.insumosM1,
                                                        insumosM2: item.insumosM2,
                                                        insumosM3: item.insumosM3,
                                                        insumosM4: item.insumosM4,

                                                        insumosM5: item.insumosM5,
                                                        insumosM6: item.insumosM6,

                                                        insumoCarpeta: insumoC.precio,
                                                        insumoUSB: servicio.insumoUSB,
                                                        nombre: item.nombre,

                                                        })}
                                                    }
                                                    />
                                                    <span className=''>{item.nombre}</span>
                                                </li>
                                                : ""
                                                ))}
                                            </ul>
                                        </div>

                                        {servicio.id == 1 ?
                                        <>
                                        <label className="form-label titulos_labels" style={{margin: '10px 0 10px 0'}}>IMPLANTES / ENDODONCIA</label>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80px'}}>
                                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} className='boxes_black'>
                                                D
                                            </div>
                                            <div style={{display: 'flex', flexDirection: 'column',   alignItems: 'center', justifyContent: 'center'}}>
                                                <div className='mb-3 col-md-12 div_box_generl_bot'>
                                                    <div className="mb-3 col-md-12 div_tercero">
                                                        <div className='content_cuadrados'>
                                                            <input type="checkbox" className='' value={box18} onChange={(e) => setBox18(e.target.checked)} checked={box18}/>
                                                            <span className='' value={box18} onClick={() => setBox18(!box18)} style={{userSelect: 'none'}}>1.8</span>
                                                        </div>
                                                        <div className='content_cuadrados'>
                                                            <input type="checkbox" className='' value={box17} onChange={(e) => setBox17(e.target.checked)} checked={box17}/>
                                                            <span className="" value={box17} onClick={() => setBox17(!box17)} style={{userSelect: 'none'}}>1.7</span>
                                                        </div>
                                                        <div className='content_cuadrados'>
                                                            <input type="checkbox" className='' value={box16} onChange={(e) => setBox16(e.target.checked)} checked={box16}/>
                                                            <span className="" value={box16} onClick={() => setBox16(!box16)} style={{userSelect: 'none'}}>1.6</span>
                                                        </div>
                                                        <div className='content_cuadrados'>
                                                            <input type="checkbox" className='' value={box15} onChange={(e) => setBox15(e.target.checked)} checked={box15}/>
                                                            <span className="" value={box15} onClick={() => setBox15(!box15)} style={{userSelect: 'none'}}>1.5</span>
                                                        </div>
                                                        <div className='content_cuadrados'>
                                                            <input type="checkbox" className='' value={box14} onChange={(e) => setBox14(e.target.checked)} checked={box14}/>
                                                            <span className="" value={box14} onClick={() => setBox14(!box14)} style={{userSelect: 'none'}}>1.4</span>
                                                        </div>
                                                        <div className='content_cuadrados'>
                                                            <input type="checkbox" className='' value={box13} onChange={(e) => setBox13(e.target.checked)} checked={box13}/>
                                                            <span className="" value={box13} onClick={() => setBox13(!box13)} style={{userSelect: 'none'}}>1.3</span>
                                                        </div>
                                                        <div className='content_cuadrados'>
                                                            <input type="checkbox" className='' value={box12} onChange={(e) => setBox12(e.target.checked)} checked={box12}/>
                                                            <span className="" value={box12} onClick={() => setBox12(!box12)} style={{userSelect: 'none'}}>1.2</span>
                                                        </div>
                                                        <div className='content_cuadrados'>
                                                            <input type="checkbox" className='' value={box11} onChange={(e) => setBox11(e.target.checked)} checked={box11}/>
                                                            <span className="" value={box11} onClick={() => setBox11(!box11)} style={{userSelect: 'none'}}>1.1</span>
                                                        </div>
                                                        <div className='content_cuadrados'>
                                                            <input type="checkbox" className='' value={box21} onChange={(e) => setBox21(e.target.checked)} checked={box21}/>
                                                            <span className="" value={box21} onClick={() => setBox21(!box21)} style={{userSelect: 'none'}}>2.1</span>
                                                        </div>
                                                        <div className='content_cuadrados'>
                                                            <input type="checkbox" className='' value={box22} onChange={(e) => setBox22(e.target.checked)} checked={box22}/>
                                                            <span className="" value={box22} onClick={() => setBox22(!box22)} style={{userSelect: 'none'}}>2.2</span>
                                                        </div>
                                                        <div className='content_cuadrados'>
                                                            <input type="checkbox" className='' value={box23} onChange={(e) => setBox23(e.target.checked)} checked={box23}/>
                                                            <span className="" value={box23} onClick={() => setBox23(!box23)} style={{userSelect: 'none'}}>2.3</span>
                                                        </div>
                                                        <div className='content_cuadrados'>
                                                            <input type="checkbox" className='' value={box24} onChange={(e) => setBox24(e.target.checked)} checked={box24}/>
                                                            <span className="" value={box24} onClick={() => setBox24(!box24)} style={{userSelect: 'none'}}>2.4</span>
                                                        </div>
                                                        <div className='content_cuadrados'>
                                                            <input type="checkbox" className='' value={box25} onChange={(e) => setBox25(e.target.checked)} checked={box25}/>
                                                            <span className="" value={box25} onClick={() => setBox25(!box25)} style={{userSelect: 'none'}}>2.5</span>
                                                        </div>
                                                        <div className='content_cuadrados'>
                                                            <input type="checkbox" className='' value={box26} onChange={(e) => setBox26(e.target.checked)} checked={box26}/>
                                                            <span className="" value={box26} onClick={() => setBox26(!box26)} style={{userSelect: 'none'}}>2.6</span>
                                                        </div>
                                                        <div className='content_cuadrados'>
                                                            <input type="checkbox" className='' value={box27} onChange={(e) => setBox27(e.target.checked)} checked={box27}/>
                                                            <span className="" value={box27} onClick={() => setBox27(!box27)} style={{userSelect: 'none'}}>2.7</span>
                                                        </div>
                                                        <div className='content_cuadrados'>
                                                            <input type="checkbox" className='' value={box28} onChange={(e) => setBox28(e.target.checked)} checked={box28}/>
                                                            <span className="" value={box28} onClick={() => setBox28(!box28)} style={{userSelect: 'none'}}>2.8</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-md-12 '>
                                                    <div className="mb-3 col-md-12 div_tercero">
                                                        <div className='content_cuadrados'>
                                                            <input type="checkbox" className='' value={box48} onChange={(e) => setBox48(e.target.checked)} checked={box48} />
                                                            <span className='' value={box48} onClick={() => setBox48(!box48)} style={{userSelect: 'none'}}>4.8</span>
                                                        </div>
                                                        <div className='content_cuadrados'>
                                                            <input type="checkbox" className='' value={box47} onChange={(e) => setBox47(e.target.checked)} checked={box47}/>
                                                            <span className="" value={box47} onClick={() => setBox47(!box47)} style={{userSelect: 'none'}}>4.7</span>
                                                        </div>
                                                        <div className='content_cuadrados'>
                                                            <input type="checkbox" className='' value={box46} onChange={(e) => setBox46(e.target.checked)} checked={box46}/>
                                                            <span className="" value={box46} onClick={() => setBox46(!box46)} style={{userSelect: 'none'}}>4.6</span>
                                                        </div>
                                                        <div className='content_cuadrados'>
                                                            <input type="checkbox" className='' value={box45} onChange={(e) => setBox45(e.target.checked)} checked={box45}/>
                                                            <span className="" value={box45} onClick={() => setBox45(!box45)} style={{userSelect: 'none'}}>4.5</span>
                                                        </div>
                                                        <div className='content_cuadrados'>
                                                            <input type="checkbox" className='' value={box44} onChange={(e) => setBox44(e.target.checked)} checked={box44}/>
                                                            <span className="" value={box44} onClick={() => setBox44(!box44)} style={{userSelect: 'none'}}>4.4</span>
                                                        </div>
                                                        <div className='content_cuadrados'>
                                                            <input type="checkbox" className='' value={box43} onChange={(e) => setBox43(e.target.checked)} checked={box43}/>
                                                            <span className="" value={box43} onClick={() => setBox43(!box43)} style={{userSelect: 'none'}}>4.3</span>
                                                        </div>
                                                        <div className='content_cuadrados'>
                                                            <input type="checkbox" className='' value={box42} onChange={(e) => setBox42(e.target.checked)} checked={box42}/>
                                                            <span className="" value={box42} onClick={() => setBox42(!box42)} style={{userSelect: 'none'}}>4.2</span>
                                                        </div>
                                                        <div className='content_cuadrados'>
                                                            <input type="checkbox" className='' value={box41} onChange={(e) => setBox41(e.target.checked)} checked={box41}/>
                                                            <span className="" value={box41} onClick={() => setBox41(!box41)} style={{userSelect: 'none'}}>4.1</span>
                                                        </div>

                                                        <div className='content_cuadrados'>
                                                            <input type="checkbox" className='' value={box31} onChange={(e) => setBox31(e.target.checked)} checked={box31}/>
                                                            <span className="" value={box31} onClick={() => setBox31(!box31)} style={{userSelect: 'none'}}>3.1</span>
                                                        </div>
                                                        <div className='content_cuadrados'>
                                                            <input type="checkbox" className='' value={box32} onChange={(e) => setBox32(e.target.checked)} checked={box32}/>
                                                            <span className="" value={box32} onClick={() => setBox32(!box32)} style={{userSelect: 'none'}}>3.2</span>
                                                        </div>
                                                        <div className='content_cuadrados'>
                                                            <input type="checkbox" className='' value={box33} onChange={(e) => setBox33(e.target.checked)} checked={box33}/>
                                                            <span className="" value={box33} onClick={() => setBox33(!box33)} style={{userSelect: 'none'}}>3.3</span>
                                                        </div>
                                                        <div className='content_cuadrados'>
                                                            <input type="checkbox" className='' value={box34} onChange={(e) => setBox34(e.target.checked)} checked={box34}/>
                                                            <span className="" value={box34} onClick={() => setBox34(!box34)} style={{userSelect: 'none'}}>3.4</span>
                                                        </div>
                                                        <div className='content_cuadrados'>
                                                            <input type="checkbox" className='' value={box35} onChange={(e) => setBox35(e.target.checked)} checked={box35}/>
                                                            <span className="" value={box35} onClick={() => setBox35(!box35)} style={{userSelect: 'none'}}>3.5</span>
                                                        </div>
                                                        <div className='content_cuadrados'>
                                                            <input type="checkbox" className='' value={box36} onChange={(e) => setBox36(e.target.checked)} checked={box36}/>
                                                            <span className="" value={box36} onClick={() => setBox36(!box36)} style={{userSelect: 'none'}}>3.6</span>
                                                        </div>
                                                        <div className='content_cuadrados'>
                                                            <input type="checkbox" className='' value={box37} onChange={(e) => setBox37(e.target.checked)} checked={box37}/>
                                                            <span className="" value={box37} onClick={() => setBox37(!box37)} style={{userSelect: 'none'}}>3.7</span>
                                                        </div>
                                                        <div className='content_cuadrados'>
                                                                <input type="checkbox" className='' value={box38} onChange={(e) => setBox38(e.target.checked)} checked={box38}/>
                                                                <span className="" value={box38} onClick={() => setBox38(!box38)} style={{userSelect: 'none'}}>3.8</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} className='boxes_black'>
                                                I
                                            </div>
                                        </div>

                                        <div className='mb-3 col-md-12 div_bot_box2' style={{paddingTop: '10px'}}>
                                            <span className='label_title2'>MUY IMPORTANTE: ¿El paciente es enviado con guias?</span> 
                                            <div className='content_checkBox2'>
                                                <span className="">Si</span>
                                                <input type="checkbox" className='on_active' checked={siConGuias}  value={siConGuias} onChange={(e) =>{
                                                    setSiConGuias(e.target.checked)
                                                    setNoConGuias(false)
                                                }
                                                } />
                                            </div>
                                            <div className='content_checkBox2'>
                                                <span className="">No</span>
                                                <input type="checkbox" className='on_active' checked={noConGuias} value={noConGuias} onChange={(e) => {
                                                    setNoConGuias(e.target.checked) , 
                                                    setSiConGuias(false)}}/>
                                            </div>
                                        </div>
                                        </>
                                        : ""}
                                    </Accordion.Body>
                                </Accordion.Item>
                                ))}
                            </Accordion>
                            
                            <label className="form-label titulos_labels" style={{margin: '20px 0 10px 0'}}>OTROS: </label>

                            <div className='mb-3 col-md-12 div_general_box div_general_box2'>
                                <div className="mb-3 col-md-12">
                                    <textarea type="text" className="form-control areas_textos colorarea" cols="70"  value={otrosAnalisis} onChange={(e) => setOtrosAnalisis(e.target.value)}></textarea>
                                </div>
                            </div>
                       </div>

                       <Modal show={show} onHide={handleClose} animation={false} className='buscarOdontologo encontrarOdontologo'>
                            <Modal.Body>
                                <AgregarOdontologo cerrar={handleClose}  id_odon={setIdOdontologo} nombreOdon={setOdontologo} copOdon={setCop} emailOdon={setEmailOdon} celOdon={setCelular_Odon} />
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

                        <Modal show={show3} onHide={handleClose3} animation={false} className='buscarOdontologo'>
                            <Modal.Body>
                                <AgregarFactura cerrar={handleClose3} id_orden={id} setEstadoG={setEstadoG}/>
                            </Modal.Body>
                            <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose3}>
                                Cerrar
                            </Button>
                            </Modal.Footer>
                        </Modal>

                        <Modal show={show4} onHide={handleClose4} animation={false} className='buscarOdontologo'>
                            <Modal.Body>
                                <AgregarNota cerrar={handleClose4} id_orden={id} setEstadoG={setEstadoG}/>
                            </Modal.Body>
                            <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose4}>
                                Cerrar
                            </Button>
                            </Modal.Footer>
                        </Modal>

                        <Modal show={show5} onHide={handleClose5} animation={false} className='buscarOdontologo'>
                            <Modal.Body>
                                <ListaFacturas cerrar={handleClose5} id_orden={id} />
                            </Modal.Body>
                            <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose5}>
                                Cerrar
                            </Button>
                            </Modal.Footer>
                        </Modal>

                        <Modal show={show2} onHide={handleClose2} animation={false} className='buscarOdontologo encontrarOdontologo'>
                            <Modal.Body>
                                <ListaClientes cerrar={handleClose2} id_odon={setIdOdontologo} nombreOdon={setOdontologo} copOdon={setCop} emailOdon={setEmailOdon} celOdon={setCelular_Odon}/>
                            </Modal.Body>
                            <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose2}>
                                Cerrar
                            </Button>
                            {/* <Button variant="primary" onClick={handleClose}>
                                Save Changes
                            </Button> */}
                            </Modal.Footer>
                        </Modal>

                    <div className="d-flex gap-2 contentBtnRegistrar">
                        <input type="hidden" name="oculto" value="1" />
                        <Link to="/admin/ordenVirtual" className="btn btn-danger btnCancelar">Cancelar</Link>
                        <input type="submit" className="btn btn-primary btnRegistrar" value="Grabar" />
                    </div>
                </form>
            </div>
            :<div className="dot-spinner dot-spinner3">
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
            </div>}
        </div>
    )
}

export default EditarOrdenVirtual