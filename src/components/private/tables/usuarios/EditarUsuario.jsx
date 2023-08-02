import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Global } from '../../../../helper/Global';
import Swal from 'sweetalert2';
import logo from "./../../../../assets/logos/logo.png";
import { useEffect } from 'react';
import useAuth from '../../../../hooks/useAuth';

const EditarUsuario = () => {
    const {auth} = useAuth();
    let token = localStorage.getItem("token");
    const {id} = useParams();

    const [name, setName] = useState("");
    const [id_rol, setId_rol] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    if(auth.id == 1){

    }else if(id == 1){
        navigate('/admin/usuarioss');
    }

    const saveClinica = async (e) => {
        e.preventDefault();
        let token = localStorage.getItem("token");


        const data = new FormData();
        data.append('name', name);
        data.append('id_rol', id_rol);
        data.append('email', email);
        data.append('password', password);
        data.append('_method', 'PUT');

        try {
            let respuesta = await axios.post(`${Global.url}/updateUser/${id}`, data,{
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if(respuesta.data.status == "success"){
                Swal.fire('Actualizado correctamente', '', 'success');
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

    useEffect(()=>{
        getClinicaOne();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getClinicaOne = async() =>{
        setLoading(true);
            const oneClinica = await axios.get(`${Global.url}/getUsuario/${id}`,{
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            });

            setName(oneClinica.data.name);
            setId_rol(oneClinica.data.id_rol);
            setEmail(oneClinica.data.email);
            // setPassword(oneClinica.data.password);
        setLoading(false);
    }

    return (
        <div className="container col-md-8 mt-6">
           
            <div className="card">
                <div className="card-header fw-bold">
                    Editar Usuario:
                </div>
                {loading == false ?
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
                                    <option value="98">Recepción</option>
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
                        </div>
                    </div>    
                    <div className="d-flex gap-2 contentBtnRegistrar">
                        <input type="hidden" name="oculto" value="1" />
                        <Link to="/admin/usuarioss" className="btn btn-danger btnCancelar">Cancelar</Link>
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

export default EditarUsuario