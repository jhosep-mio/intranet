import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPencil, faTrash, faPlus} from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate} from 'react-router-dom';
import { Global } from '../../../../helper/Global';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import Swal from 'sweetalert2';
import { BsCloudUploadFill } from "react-icons/bs";
import useAuth from '../../../../hooks/useAuth';


const ListaOrdenesPacientes = () => {
    const { auth} = useAuth({});

    const navigate = useNavigate();

    const [ordenes, setOrdenes] = useState( [] );
    const [itemPagination, setItemPagination] = useState( [] );
    const [servicios, setservicios] = useState( [] );
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [paginaActual, setpaginaActual] = useState(1);
    const [cantidadRegistros] = useState(4);
    const [cargandoBusqueda, setCargandoBusqueda] = useState(0);
    let token = localStorage.getItem("token");

    useEffect ( () =>{
        const filter2 = ordenes.filter((odo) =>{
            return (
            quitarAcentos(`${odo.paciente} ${odo.paciente_apellido_p} ${odo.paciente_apellido_m}`.toLowerCase()).includes(quitarAcentos(search.toLowerCase())) ||
            quitarAcentos(`${odo.odontologo} ${odo.odontologo_apellido_p} ${odo.odontologo_apellido_m}`.toLowerCase()).includes(quitarAcentos(search.toLowerCase())) ||
            quitarAcentos(new Date(odo.created_at).toLocaleDateString()).includes(quitarAcentos(search.toLowerCase())) ||
            quitarAcentos(odo.estado == 0 ? "creado" : odo.estado == 1 ? "pendiente" : odo.estado == 2 ? "Realizado" : "").includes(quitarAcentos(search.toLowerCase())) ||
            odo.copOdontologo.toString().includes(search)
            )
        });
        setCargandoBusqueda(filter2.length);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    useEffect ( () =>{
        getAllOrdenes();
        getAllservicios();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() =>{
   const items = [];

    if (Math.ceil(totalPosts / cantidadRegistros) <= 1) {
      setItemPagination(items);
      return;
    }

    const numPaginas = Math.ceil(totalPosts / cantidadRegistros);

    items.push(
      <Pagination.Item
        key={1}
        active={1 === paginaActual}
        onClick={() => setpaginaActual(1)}
      >
        {1}
      </Pagination.Item>
    );

    if (numPaginas > 3 && paginaActual > 2) {
      items.push(<Pagination.Ellipsis key="ellipsis-start" />);
    }

    for (let i = paginaActual - 1; i <= paginaActual + 1; i++) {
      if (i > 1 && i < numPaginas) {
        items.push(
          <Pagination.Item
            key={i}
            active={i === paginaActual}
            onClick={() => setpaginaActual(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
    }

    if (numPaginas > 3 && paginaActual < numPaginas - 1) {
      items.push(<Pagination.Ellipsis key="ellipsis-end" />);
    }

    items.push(
      <Pagination.Item
        key={numPaginas}
        active={numPaginas === paginaActual}
        onClick={() => setpaginaActual(numPaginas)}
      >
        {numPaginas}
      </Pagination.Item>
    );

    setItemPagination(items);
    },[ordenes,paginaActual,search])

    const getAllOrdenes= async () =>{
        setLoading(true);

        const request = await axios.get(`${Global.url}/allOrdenVirtualesPacientes/${auth.id}`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        });

        setOrdenes(request.data);
        setCargandoBusqueda(request.data.length);
        setLoading(false);
    };

    const indexOfLastPost = paginaActual * cantidadRegistros;
    const indexOfFirstPost= indexOfLastPost - cantidadRegistros;
    let totalPosts = ordenes.length;

    function quitarAcentos(cadena){
        const acentos = {'á':'a','é':'e','í':'i','ó':'o','ú':'u','Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U'};
        return cadena.split('').map( letra => acentos[letra] || letra).join('').toString();	
    } 

    const filterDate = () =>{
        if(search.length == 0){
            let orden = ordenes.slice(indexOfFirstPost, indexOfLastPost);
            return orden;
        }

        const filter = ordenes.filter((odo) =>{
            return (
            quitarAcentos(`${odo.paciente} ${odo.paciente_apellido_p} ${odo.paciente_apellido_m}`.toLowerCase()).includes(quitarAcentos(search.toLowerCase())) ||
            quitarAcentos(`${odo.odontologo} ${odo.odontologo_apellido_p} ${odo.odontologo_apellido_m}`.toLowerCase()).includes(quitarAcentos(search.toLowerCase())) ||
            quitarAcentos(new Date(odo.created_at).toLocaleDateString()).includes(quitarAcentos(search.toLowerCase())) ||
            quitarAcentos(odo.estado == 0 ? "creado" : odo.estado == 1 ? "pendiente" : odo.estado == 2 ? "realizado" : "").includes(quitarAcentos(search.toLowerCase())) ||
            odo.copOdontologo.toString().includes(search)
            )
        });
        totalPosts= filter.length;
        return filter.slice(indexOfFirstPost, indexOfLastPost);
    }

    const onSeachChange = ({target}) =>{
        setpaginaActual(1);
        setSearch(target.value);
    }
    const getAllservicios= async () =>{
        setLoading(true);

        const request = await axios.get(`${Global.url}/allServicios`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        });

        setservicios(request.data);
        setLoading(false);
    };
    
    const irEstudio = (id) =>{
        navigate(`/dashboard/estudios/${id}`);
    }

    // const listaNombres = elementos.map((elementos, indexElementos) => {
    //     servicios.map((serv, indexserv) => {
    //         if(elementos.estado == true && serv.id == elementos.id_servicio){
    //             if (!nombresImpresos.has(serv.nombre)) {
    //                 nombresImpresos.add(serv.nombre);
    //                 // Retornar un <li> con el nombre para imprimirlo en la lista
    //                 return <li key={indexElementos}>{serv.nombre}</li>;
    //             } else {
    //                 // Si el nombre ya ha sido impreso, retornar null para no imprimirlo de nuevo
    //                 return null;
    //             }
    //         }
    //     });
    // });

    // console.log(listaNombres.filter(nombre => nombre !== null));

    return (
        <div className="container mt-6 ms-5-auto container_clientes">
            <div className="row justify-content-center">
                {/* TAMAÑO DE LA TABLA WIDTH  */}
                <div className="col-md-11">
                    {/* <!--=== TABLA PRODUCTOS ===--> */}
                    <div className="card">
                        <div className="card-header text-center fs-5 fw-bolder">
                            Listado de ordenes realizadas
                        </div>
                        <div className="p-4 table-responsive">
                            <div id="productos_filter" className="dataTables_filter">
                                <label>Buscar:<input 
                                value={search}
                                onChange={onSeachChange}
                                type="search" className="form-control form-control-sm" placeholder="" aria-controls="productos"/>
                                </label>
                            </div>
                           
                            <Table id="productos" className="table align-middle table-hover display">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col" className="text-center">Paciente</th>

                                        <th scope="col" className="text-center">Tp. Estudio</th>

                                        <th scope="col" className="text-center">F. Creacion</th>

                                        <th scope="col" className="text-center">Codigo</th>
                                    </tr>
                                </thead>
                                <tbody id="tableBody">
                                    { loading == false ? filterDate().map((orden)=>(
                                        orden.id_paciente == auth.id ?
                                        <tr key={orden.id} style={{cursor: 'pointer'}} onClick={()=>{irEstudio(orden.id)}}>
                                            <td  className="text-center" style={{maxWidth: '150px'}}>
                                                {orden.paciente} {orden.paciente_apellido_p} {orden.paciente_apellido_m}
                                            </td>

                                            <td  className="text-left" >
                                                <div style={{display: 'flex', justifyContent: 'center'}}>
                                                    <ul style={{listStyle:'none'}}>
                                                        {
                                                        servicios.map((serv, indexserv) => (
                                                            JSON.parse(orden.impresionServicios).map((elementos, indexElementos) => (
                                                                    elementos.estado == true && serv.id == elementos.id_servicio && orden.id_paciente == auth.id?
                                                                        <li key={indexserv}>{serv.nombre}</li>
                                                                        :""
                                                            ))
                                                        ))
                                                        }
                                                    </ul>
                                                </div>
                                            </td>
                                        
                                            <td  className="text-center" style={{maxWidth: '100px'}}>
                                                {new Date(orden.created_at).toLocaleDateString()} &nbsp; {new Date(orden.created_at).toLocaleTimeString()}
                                            </td>
                                            <td  className="text-center">
                                                {orden.id}
                                            </td>
                                        </tr>
                                        : ""
                                    )) : 
                                    <tr colSpan="7" align="center" rowSpan="7">
                                        <td colSpan="7">
                                            <div className="dot-spinner">
                                                <div className="dot-spinner__dot"></div>
                                                <div className="dot-spinner__dot"></div>
                                                <div className="dot-spinner__dot"></div>
                                                <div className="dot-spinner__dot"></div>
                                                <div className="dot-spinner__dot"></div>
                                                <div className="dot-spinner__dot"></div>
                                                <div className="dot-spinner__dot"></div>
                                                <div className="dot-spinner__dot"></div>
                                            </div>
                                        </td>
                                    </tr>
                                    }
                                </tbody>
                            </Table>

                            <div className="dataTables_info" id="productos_info" role="status" aria-live="polite">
                              {
                              cargandoBusqueda
                              } Registros</div>
                            
                             <div className="dataTables_paginate paging_simple_numbers" id="productos_paginate">
                                <Pagination>
                                    {itemPagination.map((item) =>{
                                        return item;
                                    })}
                                </Pagination>
                            </div> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListaOrdenesPacientes