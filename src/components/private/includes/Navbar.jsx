import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './../../../assets/logos/logo.png';
import logowhite from './../../../assets/logos/logo.png';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleChevronRight, faMoon, faArrowRightFromBracket, faSun} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Global } from '../../../helper/Global';
import useAuth from '../../../hooks/useAuth';
import { FaJediOrder,FaUsers, FaHospitalAlt, FaClipboardList, } from "react-icons/fa";
import { BsStack } from "react-icons/bs";
import {BsPersonFill} from "react-icons/bs";
import { RiComputerLine, RiCreativeCommonsNcFill, RiUser3Fill } from "react-icons/ri";

export const Navbar = () => {
    const {auth, setAuth} = useAuth();
    const [abrirUser, setAbrirUser] = useState(false);
    const navigate = useNavigate();
    const slider= () =>{
        let slide = document.querySelector('.sidebar');
        slide.classList.toggle("close");

        let slide2 = document.querySelector('.menu-user');
        slide2.classList.toggle("closeas");
    }

    const modoOscuro= () =>{
        const body = document.querySelector('body');
        const more = document.querySelector('.more');
        const inactive = document.querySelector('.more5');
        const modeText = body.querySelector(".mode-text");

        body.classList.toggle("dark");

        if(body.classList.contains("dark")){
            modeText.innerText = "Light mode";
            more.classList.add("inactive");
            inactive.classList.remove("inactive");

        }else{
            modeText.innerText = "Dark mode";
            more.classList.remove("inactive");
            inactive.classList.add("inactive");
        }
    }
    const cerrarSession = async() =>{
        let token = localStorage.getItem("token");

        const data = new FormData();
        data.append('_method', "POST");

        await axios.post(`${Global.url}/logout`, data ,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        });
        localStorage.clear();
        setAuth({});
        navigate("/login");
    }

    const cerrarSessionUsers = async() =>{
        let token = localStorage.getItem("token");

        const data = new FormData();
        data.append('_method', "POST");

        await axios.post(`${Global.url}/logout`, data ,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        });
        localStorage.clear();
        setAuth({});
        navigate("/resultados");
    }
    return (
        <nav className="sidebar">
            <header style={{width: '100%'}}>
                <div className="image-text" style={{width: '100%'}}>
                    <span className="image">
                        <img src={logo} alt="logo-ico" width="20px" className="more"/>
                        <img src={logowhite} alt="logo-ico" width="60px" className="more5 inactive"/>
                    </span>
                </div>
                <FontAwesomeIcon icon={faCircleChevronRight} className="toggle" onClick={slider}/>
            </header>
            <div className="menu-bar" style={{zIndex: '99'}}>
                {/* <div>
                </div> */}
                {auth.id_rol == 98 &&
                <div className="menu">
                    <ul className="menu-links">
                        <li className="nav-links li">
                            <Link className="" to="clinicas">
                                <FaHospitalAlt className='icon'/>
                                <span className="text nav-text">Clínicas</span>
                            </Link>
                        </li>

                        <li className="nav-links li">
                            <Link className="" to="clientes">
                                <FaUsers  className="icon"/>
                                <span className="text nav-text">Clientes</span>
                            </Link>
                        </li>

                        <li className="nav-links li">
                            <Link className="" to="ordenVirtual">
                                <FaJediOrder className="icon"/>
                                <span className="text nav-text">Orden Virtual</span>
                            </Link>
                        </li>

                        <li className="nav-links li">
                            <Link className="" to="egresos">
                                <RiCreativeCommonsNcFill  className="icon"/>
                                <span className="text nav-text">Egresos</span>
                            </Link>
                        </li>
                    </ul>
                      
                </div>}
                {auth.id_rol == 99 &&
                <div className="menu">
                    <ul className="menu-links">
                        <li className="nav-links li">
                            <Link className="" to="clinicas">
                                <FaHospitalAlt className='icon'/>
                                <span className="text nav-text">Clínicas</span>
                            </Link>
                        </li>

                        <li className="nav-links li">
                            <Link className="" to="clientes">
                                <FaUsers  className="icon"/>
                                <span className="text nav-text">Clientes</span>
                            </Link>
                        </li>

                        <li className="nav-links li">
                            <Link className="" to="examenes">
                                <BsStack  className="icon"/>
                                <span className="text nav-text">Servicios</span>
                            </Link>
                        </li>

                        <li className="nav-links li">
                            <Link className="" to="egresos">
                                <RiCreativeCommonsNcFill  className="icon"/>
                                <span className="text nav-text">Egresos</span>
                            </Link>
                        </li>

                        <li className="nav-links li">
                            <Link className="" to="ordenVirtual">
                                <FaJediOrder className="icon"/>
                                <span className="text nav-text">Orden Virtual</span>
                            </Link>
                        </li>

                        
                        <li className="nav-links li">
                            <Link className="" to="reportes">
                                <FaClipboardList className="icon"/>
                                <span className="text nav-text">Reportes</span>
                            </Link>
                        </li>

                        <li className="nav-links li">
                            <Link className="" to="usuarioss">
                                <RiUser3Fill className="icon"/>
                                <span className="text nav-text">Usuarios</span>
                            </Link>
                        </li>

                    </ul>
                </div>}

                <div className="bottom-content">
                    {auth.id_rol == 99 || auth.id_rol == 98 ?
                    <li className="">
                        <Link onClick={cerrarSession}>
                            <FontAwesomeIcon icon={faArrowRightFromBracket} className="icon"/>
                            <span className="text nav-text">Cerrar sesion</span>
                        </Link>
                    </li>
                    : 
                    <li className="">
                        <Link onClick={cerrarSessionUsers}>
                            <FontAwesomeIcon icon={faArrowRightFromBracket} className="icon"/>
                            <span className="text nav-text">Cerrar sesion</span>
                        </Link>
                    </li>}
                    

                    {/* <li className="mode">
                        <div className="sun-moon">
                            <FontAwesomeIcon icon={faMoon} className="icon moon"/>
                            <FontAwesomeIcon icon={faSun} className="icon sun"/>
                        </div>
                        <span className="mode-text text">Dark mode</span>

                        <div className="toggle-switch">
                            <span className="switch" onClick={modoOscuro}></span>
                        </div>
                    </li> */}
                </div>
            </div>
        </nav>
    )   
}
