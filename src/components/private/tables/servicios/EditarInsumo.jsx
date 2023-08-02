import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Global } from '../../../../helper/Global';
import Swal from 'sweetalert2';
import logo from "./../../../../assets/logos/logo.png";
import { CSSTransition } from 'react-transition-group';

const EditarInsumo = () => {

    let token = localStorage.getItem("token");

    const[servicios, setServicios] = useState([]);

    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const {id} = useParams();

    const preguntar = (e) =>{
        e.preventDefault();
        Swal.fire({
            title: '¿Seguro que deseas editar el registro?',
            showDenyButton: true,
            confirmButtonText: 'Editar',
            denyButtonText: `Cancelar`,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                updateItem();
            }
          })
    }

    const updateItem = async () => {
        const data = new FormData();
        
        data.append('nombre', nombre);
        data.append('precio', precio);
 
        data.append('_method', 'PUT');

        try {
            let respuesta= await axios.post(`${Global.url}/updateInsumo/${id}`, data,{
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            });

            if(respuesta.data.status == "success"){
                Swal.fire('Actualización Correcta', '', 'success');
                navigate(`/admin/carpetas`);
            }else{
                Swal.fire('Error al realizar la edicion', '', 'error');
            }
        } catch (error) {
            console.log(error.request.response)
            if(error.request.response.includes("nombre")){
                Swal.fire('Nombre inválido', '', 'error');
            }
        }
     
    }
    useEffect(()=>{
        getItemOne();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getItemOne = async() =>{
        setLoading(true);
        const oneItem = await axios.get(`${Global.url}/oneInsumo/${id}`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        });

        setNombre(oneItem.data.nombre);
        setPrecio(oneItem.data.precio);
        setLoading(false);
    }

    return (
        <div className="container col-md-10 mt-6">
            <div className="card">
                <div className="card-header fw-bold">
                    Editar Insumo Carpeta:
                </div>
                <div className="d-flex justify-content-between">
                    <div className="mb-3 col-md-12 content_img">
                    <img src={logo} alt="" />
                    </div>
                </div>
                {loading == false ?
                <form className="p-4 needs-validation" onSubmit={preguntar}>
                    <div className="d-flex justify-content-center">
                        <div className="mb-3 col-md-11">
                            <div className='content_general mb-3 col-md-12'>
                                <div className="mb-3 col-md-12 div_conten">
                                    <label className="label_title col-md-5">Nombre: </label>
                                    <input className="form-control form-control3" autoFocus required
                                        value={nombre}
                                        type="text"
                                        onChange={(e) => setNombre(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className='content_general mb-3 col-md-12'>
                                <div className="mb-3 col-md-6 div_conten2">
                                    <label className="label_title col-md-5">Precio impresión: </label>
                                    <input className="form-control form-control3" autoFocus required
                                        value={precio}
                                        type="number"
                                        step="0.01"
                                        onChange={(e) => setPrecio(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>    
                    <div className="d-flex gap-2 contentBtnRegistrar">
                            <input type="hidden" name="oculto" value="1" />
                            <Link to="/admin/carpetas" className="btn btn-danger btnCancelar">Cancelar</Link>
                            <input type="submit" className="btn btn-primary btnRegistrar" value="Grabar" />
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

export default EditarInsumo