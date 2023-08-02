import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Global } from '../../../../helper/Global';
import Swal from 'sweetalert2';
import logo from "./../../../../assets/logos/logo.png";

const AgregarClinica2 = () => {

    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const [referencia, setReferencia] = useState("");
    const [telefono, setTelefono] = useState("");
    const [celular, setCelular] = useState("");
    
    const navigate = useNavigate();

    const saveClinica = async (e) => {
        e.preventDefault();
        let token = localStorage.getItem("token");

        const data = new FormData();
        data.append('nombre', nombre);
        data.append('direccion', direccion);
        data.append('referencia', referencia);
        data.append('telefono', telefono);
        data.append('celular', celular);

        try {
            let respuesta = await axios.post(`${Global.url}/saveClinica`, data,{
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if(respuesta.data.status == "success"){
                Swal.fire('Agregado correctamente', '', 'success');
                setNombre("");
                setDireccion("");
                setReferencia("");
                setTelefono("");
                setCelular("");
            }else{
                Swal.fire('Error al agregar el registro', '', 'error');
            }
        } catch (error) {
            if(error.request.response.includes("telefono")){
                Swal.fire('Telefono inválido', '', 'error');
            }else if(error.request.response.includes("celular")){
                Swal.fire('Celular inválido', '', 'error');
            }else if(error.request.response.includes("nombre")){
                Swal.fire('Nombre inválido', '', 'error');
            }else{
                Swal.fire('Error no encontrado', '', 'error');
            }
        }
    }

    return (
        <div className="container col-md-12 mt-6" style={{padding: '0', margin: '0'}}>
            <div className="card">
                <div className="card-header fw-bold">
                    Agregar Clinica:
                </div>
                <form className="p-4 needs-validation" onSubmit={saveClinica}>
                    <div className="d-flex justify-content-between">
                        <div className="mb-3 col-md-12 content_img">
                           <img src={logo} alt=""/>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center">
                        <div className="mb-3 col-md-11">
                            <div className='content_general mb-3 col-md-12'>
                                <div className="mb-3 col-md-12 div_conten">
                                    <label className="label_title">Nombres: </label>
                                    <input className="form-control form-control3" autoFocus required
                                        value={nombre}
                                        type="text"
                                        onChange={(e) => setNombre(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className='content_general mb-3 col-md-12'>
                                <div className="mb-3 col-md-12 div_conten">
                                    <label className="label_title">Dirección: </label>
                                    <input className="form-control form-control3" autoFocus required
                                        value={direccion}
                                        type="text"
                                        onChange={(e) => setDireccion(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className='content_general mb-3 col-md-12'>
                                <div className="mb-3 col-md-12 div_conten">
                                    <label className="label_title">Referencia: </label>
                                    <input className="form-control form-control3" autoFocus
                                        value={referencia}
                                        type="text"
                                        onChange={(e) => setReferencia(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className='content_general mb-3 col-md-12'>
                                <div className="mb-3 col-md-6 div_conten2">
                                    <label className="label_title">Telefono: </label>
                                    <input className="form-control form-control3" autoFocus 
                                    value={telefono}
                                    onChange={(e) => { setTelefono(e.target.value) }}
                                    type="text"
                                    />
                                </div>
                                <div className="mb-3 col-md-6 div_conten">
                                    <label className="label_title">Celular: </label>
                                    <input className="form-control form-control3" autoFocus required
                                        value={celular}
                                        onChange={(e) => { setCelular(e.target.value) }}
                                        type="text"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>    
                    <div className="d-flex gap-2 contentBtnRegistrar">
                        <input type="hidden" name="oculto" value="1" />
                        <input type="submit" className="btn btn-primary btnRegistrar" value="Registrar" />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AgregarClinica2