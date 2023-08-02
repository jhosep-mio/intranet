import React, { useState } from 'react';
import logo from './../../assets/logos/icono.png';
import logowhite from './../../assets/logos/logo_white.png';
import logotalk from './../../assets/icons/walkie-talkie.png';
import axios from 'axios';
import { Global } from '../../helper/Global';
import { useForm } from '../../hooks/useForm';
import useAuth from '../../hooks/useAuth';
import {useNavigate } from 'react-router-dom';

export const Login = () => {

    const navigate = useNavigate();
    const { form, changed } = useForm({});
    const [loged, setLoged] = useState("");
    const {auth,setAuth} = useAuth();

    if((auth.id && auth.id_rol == 99) || (auth.id && auth.id_rol == 98)){
        navigate("/admin", {replace: true});
    }else{
        const validar = async(e) =>{
            e.preventDefault();
            const data = new FormData();
            
            let email = form.email;
            let password = form.password;
    
            data.append('email', email);
            data.append('password', password);
            data.append('_method', 'POST');
    
            try {
                let respuesta= await axios.post(`${Global.url}/login`, data);
    
                if(respuesta.data.status == "success"){
                    localStorage.setItem("token", respuesta.data.acces_token);
                    localStorage.setItem("user", JSON.stringify(respuesta.data.user)); 
                    setLoged("login");
                    setAuth(respuesta.data.user);
                    console.log(respuesta.data)
                    setTimeout(()=>{
                        window.location.reload();
                    }, 1000);
    
                }else if(respuesta.data.status == "invalid"){
                    console.log("contraseña incorrecta");
                    setLoged("invalid");
                }else{
                    setLoged("noexiste");
                }
    
                } catch (error) {
                    setLoged("noexiste");
                    console.log(error)
                }
           
        }
        return (
        <div className="login-main">
            <div className="login-main__ctn1">
                <div className="login-main__name-empresa-main">
                    <h2><img loading="lazy" src={logo} alt="" className='login-main__img_logo' width="100%"/>RADIOLOGIA DENTAL AVANZADA</h2>
                </div>
    
                <div className="login-main__title-login-main">
                    <h1>Iniciar sesión</h1>
                </div>
                <div className="login-main__texto-login-main">
                    <p>Bienvenido 😀 Por favor introduce tus credenciales</p>
                </div>
                <div className="login-main__formulario-main">
                    <form onSubmit={validar}>
                        <div className="login-main__inputs">
                            <label htmlFor="">Email</label>
                            <input type="email" name="email" placeholder="Ingresa tu email" onChange={changed}/>
                        </div>
                        <div className="login-main__inputs">
                            <label htmlFor="">Contraseña</label>
                            <input type="password" name="password" id="pwd" className="login-main__pwd" placeholder="Ingresa tu contraseña"onChange={changed}/>
                        </div>
                        
                        <div>
                            {
                            loged == "invalid" ?
                            <p className='login-main__error_datos'>Contraseña incorrecta</p>
                            : loged == "noexiste" ?
                            <p className='login-main__error_datos'>El usuario no existe</p>
                            : loged == "login"? 
                            <p className='login-main__error_datos'>Usuario identificado correctamente</p>
                            :""
                            }
                        </div>

                        <div className="login-main__inputs login-main__fl">
    
                            <input type="checkbox" name="" id="checkbox_recordar" className="login-main__checkbox_recordar" value="recordar"/>
                                <label htmlFor="" className="login-main__lb">Recordar</label>
                                <a href="http://" className="login-main__link-olvide">Olvidé mi contraseña</a>
                        </div>
                        <div className="login-main__inputs">
                            <input type="submit" value="Iniciar sesión" className="login-main__btn-login" id="btn-login"/>
                        </div>
                    </form>
                </div>
    
                <div className="login-main__bg"></div>
            </div>
            <div className="login-main__ctn2">
                {/* <img loading="lazy" src={logowhite} alt=""  width="100%"/> */}
                <a href="../index.html"><img loading="lazy" className="login-main__icon" src={logowhite} alt="" height="250px"/></a>
            </div>
        </div>
        )
    }

}

