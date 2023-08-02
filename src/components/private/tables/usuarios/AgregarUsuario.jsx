import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Global } from '../../../../helper/Global';
import Swal from 'sweetalert2';
import logo from "./../../../../assets/logos/logo.png";

const AgregarUsuario = () => {

    const [name, setName] = useState("");
    const [id_rol, setId_rol] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    
    const navigate = useNavigate();

    const saveClinica = async (e) => {
        e.preventDefault();
        let token = localStorage.getItem("token");

        const data = new FormData();
        data.append('name', name);
        data.append('id_rol', id_rol);
        data.append('email', email);
        data.append('password', password);
        data.append('password_confirmation', password2);

        try {
            let respuesta = await axios.post(`${Global.url}/registerUsersAdmins`, data,{
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if(respuesta.data.status == "success"){
                Swal.fire('Agregado correctamente', '', 'success');
                navigate('/admin/usuarioss');
            }else{
                Swal.fire('Error al agregar el registro', '', 'error');
            }
        } catch (error) {
            console.log(error);
            if(error.request.response.includes("The email has already been taken")){
                Swal.fire('El correo ya existe', '', 'error');

            }if(error.request.response.includes("for key 'users_email_unique'")){
                Swal.fire('El correo ya existe', '', 'error');
            }else if(error.request.response.includes("The password confirmation does not match")){
                Swal.fire('Las contraseñas no son iguales', '', 'error');
            }else{
                Swal.fire('Error no encontrado', '', 'error');
            }
        }
    }

    return (
        <div className="container col-md-8 mt-6">
            <div className="card">
                <div className="card-header fw-bold">
                    Agregar Usuario:
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
                                <label className="label_title col-md-5">Tipo de usuario: </label>
                                <select value={id_rol} type="text" className="form-select2"  autoFocus required onChange={(e)=>{setId_rol(e.target.value)}}>
                                    <option value="">Seleccionar</option>
                                    <option value="99">Administrador</option>
                                    <option value="98">Recepcion</option>
                                </select>
                            </div>

                            <div className='content_general mb-3 col-md-12'>
                                <div className="mb-3 col-md-12 div_conten">
                                    <label className="label_title">Nombres: </label>
                                    <input className="form-control form-control3" autoFocus required
                                        value={name}
                                        type="text"
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className='content_general mb-3 col-md-12'>
                                <div className="mb-3 col-md-12 div_conten">
                                    <label className="label_title">Email: </label>
                                    <input className="form-control form-control3" autoFocus
                                        value={email}
                                        type="email"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className='content_general mb-3 col-md-12'>
                                <div className="mb-3 col-md-12 div_conten">
                                    <label className="label_title">Contraseña: </label>
                                    <input className="form-control form-control3" autoFocus 
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value) }}
                                        type="text"
                                    />
                                </div>
                            </div>
                            <div className='content_general mb-3 col-md-12'>
                                <div className="mb-3 col-md-12 div_conten">
                                    <label className="label_title">Confirmar Contraseña: </label>
                                    <input className="form-control form-control3" autoFocus 
                                        value={password2}
                                        onChange={(e) => { setPassword2(e.target.value) }}
                                        type="text"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>    
                    <div className="d-flex gap-2 contentBtnRegistrar">
                        <input type="hidden" name="oculto" value="1" />
                        <Link to="/admin/usuarioss" className="btn btn-danger btnCancelar">Cancelar</Link>
                        <input type="submit" className="btn btn-primary btnRegistrar" value="Registrar" />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AgregarUsuario