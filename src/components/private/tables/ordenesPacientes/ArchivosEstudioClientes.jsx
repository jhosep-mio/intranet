import React, { useState, useEffect} from 'react';
import { Link, useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import { Global } from '../../../../helper/Global';
import Swal from 'sweetalert2';
import logo from "./../../../../assets/logos/logo.png";
import rar from "./../../../../assets/admin/zip.png";
import Button from 'react-bootstrap/Button';
import { BsEyeFill, BsFileZipFill , BsFillTrashFill,BsDatabaseFillDown} from "react-icons/bs";
import Accordion from 'react-bootstrap/Accordion';
import useAuth from '../../../../hooks/useAuth';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import { Grid, Pagination } from "swiper";
import { RViewer, RViewerTrigger } from 'react-viewerjs'

const ArchivosEstudioClientes = () => {

    const { auth} = useAuth({});
    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    let token = localStorage.getItem("token");
    const[idOrden,setIdOrden] = useState(0);
    const [servicios, setservicios] = useState( [] );
    const[idPaciente,setIdPaciente] = useState(0);
    const[nombres, setNombres] = useState("");
    const[idOdontologo, setIdOdontologo] = useState(0);
    const[impresionCheck, setImpresionCheck] = useState([]);
    const [elementos, setElementos] = useState([]);
    const [id_servicio, setId_servicio] = useState('');
    const [id_item, setIdItem] = useState('');
    const[fechaCreacion, setFechaCreacion] = useState("");
    const[edad, setEdad] = useState(0);
    const[dni, setDni] = useState(0);
    const[email, setEmail] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [loadingDowload, setLoadingDowload] = useState(false);

    const[email_odontologo, setEmail_odontologo] = useState("");
    const[user_odontologo, setUser_odontologo] = useState("");
    const[passOdontologo, setPassOdontologo] = useState("");

    const[fecha, setFecha] = useState(0);
    const[varon, setVaron] = useState(false);
    const[mujer, setMujer] = useState(false);
    const[show, setShow] = useState(false);
    const[images, setImages] = useState([]);
    const[odontologo, setOdontologo] = useState("");
    const[idServicio, setIdServicio] = useState(0);
    const [informes, setInformes] = useState([]);
    const [descargas, setDescargas] = useState([]);

    const openLightbox = (index) => {
        setIsOpen(true);
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

    const getImages= async () =>{
        const request = await axios.get(`${Global.url}/verImagenes`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        }); 
        setImages(request.data);
    };

    const getRutas= async () =>{
        const request = await axios.get(`${Global.url}/veRutas`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        }); 
        setDescargas(request.data);
    };

    const getOneOrden = async() =>{

        setLoading(true);
        const oneOrden = await axios.get(`${Global.url}/oneOrdenVirtual/${id}`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        });

        setIdPaciente(oneOrden.data.verOrden.id_paciente);
        setIdOdontologo (oneOrden.data.verOrden.id_odontologo);
        setIdOrden(oneOrden.data.verOrden.id);
        const fecha_at = new Date(oneOrden.data.verOrden.created_at)
        setFechaCreacion(`${fecha_at.toLocaleDateString()}  -  ${fecha_at.toLocaleTimeString()}`)
        setElementos(JSON.parse(oneOrden.data.verOrden.impresionServicios))
        setIdServicio(JSON.parse(oneOrden.data.verOrden.impresionServicios)[0]);
       
        setNombres(`${auth.nombres} ${auth.apellido_p} ${auth.apellido_m}`);
        setEdad(calcularEdad(auth.f_nacimiento));
        setDni(auth.numero_documento_paciente_odontologo);
        setEmail(auth.correo);

        const fecha_date = new Date(auth.f_nacimiento);
        setFecha(fecha_date.toLocaleDateString());


        if(auth.genero == 0 ){
            setVaron(true);
        }else if (auth.genero == 1){
            setMujer(true);
        }

        const request = await axios.get(`${Global.url}/allServicios`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        });
        setservicios(request.data);

        const oneOdontologo = await axios.get(`${Global.url}/oneOdontologo/${oneOrden.data.verOrden.id_odontologo}`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        });

        setOdontologo(`${oneOdontologo.data.nombres} ${oneOdontologo.data.apellido_p} ${oneOdontologo.data.apellido_m}`);
        setIdOdontologo(oneOdontologo.data.id);

        setUser_odontologo(oneOdontologo.data.numero_documento_paciente_odontologo);
        setPassOdontologo(oneOdontologo.data.cop);
        setEmail_odontologo(oneOdontologo.data.correo);


        setLoading(false)
    }

    const handleModalClick = (event) => {
        event.stopPropagation(); // Detiene la propagación del evento de clic
    };
    const descargarImagenesGroup = async(servicio, nombre) => {

        function getTime() {
            return Math.floor(Date.now() / 1000);
        }

        setLoadingDowload(true);
        const data = new FormData();
        data.append('id_orden', id);
        data.append('id_servicio', servicio);
        // data.append('id_servicio', servicio);
        await axios({
            method: 'post',
            url: `${Global.url}/dowloadsGroup`, // Cambia la URL de la API a la ruta que configuraste en tu backend de Laravel
            responseType: 'blob', // Indica que la respuesta será un archivo binario
            data,
            headers:{
                'Authorization': `Bearer ${token}`
            },
          })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${getTime()}-${nombre}.zip`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch((error) => {
                console.log(error.request)
                Swal.fire('Error al descargar el archivo ZIP', '', 'error');
            });
        setLoadingDowload(false);
    }

    const preguntarDescargaGroup = async (servicio) =>{

        const oneOrden = await axios.get(`${Global.url}/oneServicio/${servicio}`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        });

        
        Swal.fire({
            title: `¿Seguro de descargar todos los archivos del servicio ${oneOrden.data.nombre}? `,
            showDenyButton: true,
            confirmButtonText: 'Descargar',
            denyButtonText: `Cancelar`,
          }).then((result) => {
            if (result.isConfirmed) {
                descargarImagenesGroup(servicio,oneOrden.data.nombre);
            }
          })
    }

    const getInformes= async () =>{
        const request = await axios.get(`${Global.url}/verInformes`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        }); 
        setInformes(request.data);

        // request.data.map((infor)=>(
        //     infor.id_orden == id ? 
        //         setDescargas([...descargas, `${Global.urlImages}/imagenes/${img.archivo}`])
        //     : ""
        // ));
    };

    const preguntarInformes = (id,archivos) =>{
        Swal.fire({
            title: `¿Estás seguro de eliminar el informe "${archivos}"?`,
            showDenyButton: true,
            confirmButtonText: 'Eliminar',
            denyButtonText: `Cancelar`,
          }).then((result) => {
            if (result.isConfirmed) {
                deleteInforme(id);
            }
          })
    }

    const deleteInforme  = async (id) =>{
        try {
            const resultado= await axios.delete(`${Global.url}/deleteInformes/${id}`,{
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            });
            if(resultado.data.status == "success"){
                Swal.fire('Se elimino correctamente', '', 'success');
                getInformes();
            }
        } catch (error) {
                console.log(error.request.response)
                Swal.fire('Error al eliminar el registro', '', 'error');
        }
    }

    const descargarImagenesGroupInformes = async(servicio, nombre) => {
        setLoadingDowload(true);

        function getTime() {
            return Math.floor(Date.now() / 1000);
        }

        const data = new FormData();
        data.append('id_orden', id);
        data.append('id_servicio', servicio);
        // data.append('id_servicio', servicio);
        await axios({
            method: 'post',
            url: `${Global.url}/dowloadsGroupInformes`, // Cambia la URL de la API a la ruta que configuraste en tu backend de Laravel
            responseType: 'blob', // Indica que la respuesta será un archivo binario
            data,
            headers:{
                'Authorization': `Bearer ${token}`
            },
          })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${getTime()}-informe-${nombre}.zip`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch((error) => {
                console.log(error)
                Swal.fire('Error al descargar el archivo ZIP', '', 'error');
            });
        setLoadingDowload(false);
    }

    const preguntarDescargaGroupInformes = async(servicio) =>{

        const oneOrden = await axios.get(`${Global.url}/oneServicio/${servicio}`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        });

        Swal.fire({
            title: `¿Seguro de descargar el grupo de informes de ${oneOrden.data.nombre}?`,
            showDenyButton: true,
            confirmButtonText: 'Descargar',
            denyButtonText: `Cancelar`,
          }).then((result) => {
            if (result.isConfirmed) {
                descargarImagenesGroupInformes(servicio, oneOrden.data.nombre);
            }
          })
    }
    
    useEffect(() =>{
        getOneOrden();
        getImages();
        getRutas();
        getInformes();
        // descargarImagenes();
    },[])


    return (
        <div className="container col-md-11 mt-6 container_clientes">
            <div className="card">
                <div className="card-header fw-bold">
                    Registros de estudio:
                </div>
                {loading == false ?
                <form className="p-4 needs-validation form_general">
                    <div className="d-flex justify-content-between">
                        <div className="mb-3 col-md-12 content_img" style={{position: 'relative'}}>
                           <img src={logo} alt=""/>
                        </div>
                    </div>
                    <div className="d-flex  justify-content-between" style={{paddingTop: '30px'}}>
                        <div className="mb-3 col-md-3" style={{paddingRight: '20px'}}>
                            <label className="form-label">N° Orden: </label>
                            <input className="form-control" disabled
                                type="text"
                                value={idOrden}
                                // onChange={(e)=>{setIdOrden(e.target.value)}}
                                style={{textAlign: 'center'}}
                            />
                        </div>
                        <div className="mb-3 col-md-3" style={{paddingRight: '20px'}}>
                            <label className="form-label">Fecha: </label>
                            <input className="form-control" disabled
                                type="text"
                                value={fechaCreacion}
                                // onChange={(e)=>{setFechaCreacion(e.target.value)}}
                                style={{textAlign: 'center'}}
                            />
                        </div>
                        <div className="mb-3 col-md-3" style={{paddingRight: '20px'}}>
                            <label className="form-label">Paciente: </label>
                            <input className="form-control" disabled
                                type="text"
                                value={nombres}
                            />
                        </div>
                        <div className="mb-3 col-md-2" style={{paddingRight: '20px'}}>
                            <label className="form-label">Nacimiento: </label>
                            <input className="form-control" disabled
                                type="text"
                                value={fecha}
                            />
                        </div>
                        <div className="mb-3 col-md-1" >
                            <label className="form-label">Edad: </label>
                            <input className="form-control" disabled
                                type="text"
                                value={edad}
                            />
                        </div>
                    </div>
                     <Accordion defaultActiveKey={"0"} onClick={handleModalClick} >
                     {
                        <Accordion.Item key="0" eventKey="0">
                            <Accordion.Header className="card-header fw-bold" style={{marginTop: '20px'}}>
                            </Accordion.Header>
                            <Accordion.Body style={{position: 'relative'}}>
                                <div className='group_descargas'>
                                    {loadingDowload  ?
                                    <div className='card-header-content' style={{width: '50px', height: '50px'}}>
                                        <div className="dot-spinner dot-spinner11">
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
                                    :
                                    <BsDatabaseFillDown style={{color: 'green', fontSize: '27px'}} title="Descargar Archivos" 
                                    // onClick={()=>{preguntarDescargaGroup(serv.id)}}
                                    />
                                    }
                                </div>
                                <div className="d-flex  justify-content-between">
                                    <div className="mb-3 col-md-12">
                                        <label className="form-label col-md-4 titles_lavels" style={{textAlign: 'center', width: '100%'}}>ARCHIVOS ADQUIRIDOS: </label>
                                            <Swiper
                                                slidesPerView={4}
                                                grid={{
                                                rows: 2,
                                                }}
                                                spaceBetween={10}
                                                pagination={{
                                                clickable: true,
                                                }}
                                                modules={[Grid, Pagination]}
                                                className="mySwiper swiper_admin_pacientes"
                                            >
                                                {images.map((img)=>(img.id_orden == id ?
                                                    <SwiperSlide key={img.id} >
                                                            {(img.archivo).split(',').map((linea,index)=>(
                                                                linea.split('.').pop() == "jpg" ||  linea.split('.').pop() == "png" || linea.split('.').pop() == "jpeg" || linea.split('.').pop() == "gif" || linea.split('.').pop() == "bmp" || linea.split('.').pop() == "tiff" || linea.split('.').pop() == "webp" || linea.split('.').pop() == "svg" ?
                                                                <RViewer imageUrls={`${Global.urlImages}/imagenes/${linea}`} key={index}>
                                                                    <RViewerTrigger >
                                                                        <img src={`${Global.urlImages}/imagenes/${linea}`} alt={`${linea}`} style={{cursor: 'pointer'}}/>
                                                                    </RViewerTrigger>
                                                                </RViewer>
                                                                : 
                                                                <img src={rar} alt={`${linea}`} style={{width: '50%', height: '50%'}}/>
                                                            ))}
                                                    </SwiperSlide>
                                                : ""
                                                ))}
                                            </Swiper>                                                          
                                    </div>
                                </div>
                                <hr className='seperacion'/>
                                <div className="d-flex  justify-content-between informes_cotnents" style={{marginTop: "40px"}}>
                                    <div className="mb-3 col-md-12">
                                        <label className="form-label col-md-4 titles_lavels" style={{textAlign: 'center', width: '100%'}}>INFORMES: </label>
                                            <Swiper
                                                slidesPerView={4}
                                                grid={{
                                                rows: 2,
                                                }}
                                                spaceBetween={10}
                                                pagination={{
                                                clickable: true,
                                                }}
                                                modules={[Grid, Pagination]}
                                                className="mySwiper swiper_admin_pacientes"
                                            >
                                                {informes.map((info)=>(
                                                     info.id_orden == id ?
                                                    <SwiperSlide key={info.id} >
                                                            {(info.informe).split(',').map((linea,index)=>(
                                                                linea.split('.').pop() == "jpg" ||  linea.split('.').pop() == "png" || linea.split('.').pop() == "jpeg" || linea.split('.').pop() == "gif" || linea.split('.').pop() == "bmp" || linea.split('.').pop() == "tiff" || linea.split('.').pop() == "webp" || linea.split('.').pop() == "svg" ?
                                                                <RViewer imageUrls={`${Global.urlImages}/informes/${linea}`} key={index}>
                                                                    <RViewerTrigger >
                                                                        <img src={`${Global.urlImages}/informes/${linea}`} alt={`${linea}`} style={{cursor: 'pointer'}}/>
                                                                    </RViewerTrigger>
                                                                </RViewer>
                                                                : 
                                                                <img src={rar} alt={`${linea}`} style={{width: '60%', height: '60%'}}/>
                                                            ))}
                                                    </SwiperSlide>
                                                : ""
                                                ))}
                                            </Swiper>                                                          
                                    </div>
                                    <div className='grupo_informes_pacientes'>
                                        {loadingDowload  ?
                                            <div className='card-header-content' style={{width: '50px', height: '50px'}}>
                                                <div className="dot-spinner dot-spinner11">
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
                                        :
                                            <BsDatabaseFillDown style={{color: 'green', fontSize: '27px'}} title="Descargar Informes" 
                                            // onClick={()=>{preguntarDescargaGroupInformes(serv.id)}}
                                            />
                                        }
                                    </div>
                                </div>
                                    
                            </Accordion.Body>
                        </Accordion.Item>
                    }
                    </Accordion>
                    <div className="d-flex gap-2 contentBtnRegistrar">
                        <input type="hidden" name="oculto" value="1" />
                        <Link to="/dashboard/lista-de-ordenes" className="btn btn-danger btnCancelar">Regresar</Link>
                    </div>
                </form>
                : <div className="dot-spinner dot-spinner4">
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
        </div>
    )
}

export default ArchivosEstudioClientes