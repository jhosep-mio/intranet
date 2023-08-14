import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Global } from '../../../../helper/Global';
import Swal from 'sweetalert2';
import logo from "./../../../../assets/logos/logo.png";
import { CSSTransition } from 'react-transition-group';
import { LoadingSmall } from '../../shared/LoadingSmall';

const AgregarItem = () => {
    let token = localStorage.getItem("token");
    const [loading, setLoading] = useState(true)
    const[servicios, setServicios] = useState([]);

    const [id_servicio, setId_servicio] = useState(1);
    const [nombre, setNombre] = useState("");

    const [precio_impresion, setPrecio_impresion] = useState("");
    const [precio_digital, setPrecio_digital] = useState("");

    const [comision_impreso, setComision_impreso] = useState("");
    const [comision_digital, setComision_digital] = useState("");
    const [insumos1, setInsumos1] = useState("");
    const [insumos2, setInsumos2] = useState("");
    const [insumos3, setInsumos3] = useState("");
    const [insumos4, setInsumos4] = useState("");

    const [insumosM1, setInsumosM1] = useState("");
    const [insumosM2, setInsumosM2] = useState("");
    const [insumosM3, setInsumosM3] = useState("");
    const [insumosM4, setInsumosM4] = useState("");
    const [insumosM5, setInsumosM5] = useState("");
    const [insumosM6, setInsumosM6] = useState("");

    const [insumoCarpeta, setInsumoCarpeta] = useState("");

    useEffect ( () =>{
        getServicios();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const navigate = useNavigate();

    const saveItem = async (e) => {
        setLoading(true)
        e.preventDefault();
        let token = localStorage.getItem("token");

        const data = new FormData();
        data.append('id_servicio', id_servicio);
        data.append('nombre', nombre);

        data.append('precio_impresion', precio_impresion);
        data.append('precio_digital', precio_digital);

        data.append('comision_impreso', comision_impreso);
        data.append('comision_digital', comision_digital);

        data.append('insumos1', insumos1);
        data.append('insumos2', insumos2);
        data.append('insumos3', insumos3);
        data.append('insumos4', insumos4);

        data.append('insumosM1', insumosM1);
        data.append('insumosM2', insumosM2);
        data.append('insumosM3', insumosM3);
        data.append('insumosM4', insumosM4);
        data.append('insumosM5', insumosM5);
        data.append('insumosM6', insumosM6);

        data.append('insumoCarpeta', insumoCarpeta);


        try {
            let respuesta = await axios.post(`${Global.url}/saveItem`, data,{
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            });
            if(respuesta.data.status == "success"){
                Swal.fire('Agregado correctamente', '', 'success');
                navigate(`/admin/examenes`);
            }else{
                Swal.fire('Error al agregar el registro', '', 'error');
            }
        } catch (error) {
            console.log(error)
            if(error.request.response.includes(`Duplicate entry '${nombre}' for key 'nombre'`)){
                Swal.fire('Nombre duplicado', '', 'error');
            }else if(error.request.response.includes("nombre")){
                Swal.fire('Nombre inválido', '', 'error');
            }
        }
        setLoading(false)
    }

    const getServicios= async () =>{
        const request = await axios.get(`${Global.url}/allServicios`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        });
        setServicios(request.data);
        setLoading(false)
    };

    return (
        <div className="container col-md-10 mt-6">
            {!loading ?
            <div className="card">
                <div className="card-header fw-bold">
                    Agregar Examen:
                </div>
                <form className="p-4 needs-validation" onSubmit={saveItem}>
                    <div className="d-flex justify-content-between">
                        <div className="mb-3 col-md-12 content_img">
                           <img src={logo} alt=""/>
                        </div>
                    </div>
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
                                <div className="mb-3 col-md-8 div_conten2">
                                    <label className="label_title col-md-5">Tipo de Exámen: </label>
                                    <select value={id_servicio} type="text" className="form-select2"  autoFocus required onChange={(e)=>{setId_servicio(e.target.value)}}>
                                        {servicios.map((clini) => (
                                        <option key={clini.id} value={clini.id}>{clini.nombre}</option>
                                        ))
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className='content_general mb-3 col-md-12'>
                                <div className="mb-3 col-md-6 div_conten2">
                                    <label className="label_title col-md-5">Precio impresión: </label>
                                    <input className="form-control form-control3" autoFocus required
                                        value={precio_impresion}
                                        type="number"
                                        step="0.01"
                                        onChange={(e) => setPrecio_impresion(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-md-6 div_conten">
                                    <label className="label_title col-md-5">Precio digital: </label>
                                    <input className="form-control form-control3" autoFocus required
                                        value={precio_digital}
                                        type="number"
                                        step="0.01"
                                        onChange={(e) => setPrecio_digital(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className='content_general mb-3 col-md-12'>
                                <div className="mb-3 col-md-6 div_conten2">
                                    <label className="label_title col-md-5">Comisión impresión: </label>
                                    <input className="form-control form-control3" autoFocus required
                                        value={comision_impreso}
                                        type="number"
                                        step="0.01"
                                        onChange={(e) => setComision_impreso(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3 col-md-6 div_conten">
                                    <label className="label_title col-md-5">Comisión Digital: </label>
                                    <input className="form-control form-control3" autoFocus required
                                        value={comision_digital}
                                        type="number"
                                        step="0.01"
                                        onChange={(e) => setComision_digital(e.target.value)}
                                    />
                                </div>
                            </div>
                            <label htmlFor="" className='especia'>Insumos - Especialistas</label>
                            <div className='content_general mb-3 col-md-12'>
                                <div className="mb-3 col-md-6 div_conten2">
                                    <label className="label_title col-md-5">Insumos 1: </label>
                                    <input className="form-control form-control3" autoFocus 
                                        value={insumos1}
                                        type="number"
                                        step="0.01"
                                        onChange={(e) => setInsumos1(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-md-6 div_conten">
                                    <label className="label_title col-md-5">Insumos 2: </label>
                                    <input className="form-control form-control3" autoFocus 
                                        value={insumos2}
                                        type="number"
                                        step="0.01"
                                        onChange={(e) => setInsumos2(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className='content_general mb-3 col-md-12'>
                                <div className="mb-3 col-md-6 div_conten2">
                                    <label className="label_title col-md-5">Insumos 3: </label>
                                    <input className="form-control form-control3" autoFocus 
                                        value={insumos3}
                                        type="number"
                                        step="0.01"
                                        onChange={(e) => setInsumos3(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-md-6 div_conten">
                                    <label className="label_title col-md-5">Insumos 4: </label>
                                    <input className="form-control form-control3" autoFocus 
                                        value={insumos4}
                                        type="number"
                                        step="0.01"
                                        onChange={(e) => setInsumos4(e.target.value)}
                                    />
                                </div>
                            </div>
                            <label htmlFor="" className='especia'>Insumos - Material Fisico</label>
                            <div className='content_general mb-3 col-md-12'>
                                <div className="mb-3 col-md-6 div_conten2">
                                    <label className="label_title col-md-5">Insumos 1 : </label>
                                    <input className="form-control form-control3" autoFocus 
                                        value={insumosM1}
                                        type="number"
                                        step="0.01"
                                        onChange={(e) => setInsumosM1(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-md-6 div_conten">
                                    <label className="label_title col-md-5">Insumos 2: </label>
                                    <input className="form-control form-control3" autoFocus 
                                        value={insumosM2}
                                        type="number"
                                        step="0.01"
                                        onChange={(e) => setInsumosM2(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className='content_general mb-3 col-md-12'>
                                <div className="mb-3 col-md-6 div_conten2">
                                    <label className="label_title col-md-5">Insumos 3: </label>
                                    <input className="form-control form-control3" autoFocus 
                                        value={insumosM3}
                                        type="number"
                                        step="0.01"
                                        onChange={(e) => setInsumosM3(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-md-6 div_conten">
                                    <label className="label_title col-md-5">Insumos 4: </label>
                                    <input className="form-control form-control3" autoFocus 
                                        value={insumosM4}
                                        type="number"
                                        step="0.01"
                                        onChange={(e) => setInsumosM4(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className='content_general mb-3 col-md-12'>
                                <div className="mb-3 col-md-6 div_conten2">
                                    <label className="label_title col-md-5">Insumos 5: </label>
                                    <input className="form-control form-control3" autoFocus 
                                        value={insumosM5}
                                        type="number"
                                        step="0.01"
                                        onChange={(e) => setInsumosM5(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-md-6 div_conten">
                                    <label className="label_title col-md-5">Insumos 6: </label>
                                    <input className="form-control form-control3" autoFocus 
                                        value={insumosM6}
                                        type="number"
                                        step="0.01"
                                        onChange={(e) => setInsumosM6(e.target.value)}
                                    />
                                </div>
                            </div>
                            
              
                        </div>
                    </div>    
                    <div className="d-flex gap-2 contentBtnRegistrar">
                        <input type="hidden" name="oculto" value="1" />
                        <Link to="/admin/examenes" className="btn btn-danger btnCancelar">Cancelar</Link>
                        <input type="submit" className="btn btn-primary btnRegistrar" value="Registrar" />
                    </div>
                </form>
            </div>
            : <LoadingSmall/>}
        </div>
    )
}

export default AgregarItem