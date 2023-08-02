import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPencil, faTrash, faPlus} from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Global } from '../../../../helper/Global';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import Swal from 'sweetalert2';
import { BsXCircle } from "react-icons/bs";

export const Reportes = () => {
    const navigate = useNavigate();
  return (
    <div className="container mt-6 ms-5-auto">
        <div className="row justify-content-center">
            {/* TAMAÑO DE LA TABLA WIDTH  */}
            <div className="col-md-11">
                {/* <!--=== TABLA PRODUCTOS ===--> */}

                <div className="card">
                    <div className="card-header text-center fs-5 fw-bolder">
                        Listado de Reportes
                    </div>
                    <div className="p-4 table-responsive">
                        <Table id="productos" className="table align-middle table-hover display">
                            <tbody id="tableBody">
                                    <tr style={{cursor: 'pointer'}} onClick={()=>{navigate("pacientes-clinicas")}}>
                                        <td  className="text-center">
                                            Reporte sobre cantidad de pacientes enviados por clínicas dentales. 
                                        </td>
                                    </tr>

                                    <tr style={{cursor: 'pointer'}} onClick={()=>{navigate("pacientes-odontologos")}}>
                                        <td  className="text-center">
                                            Reporte sobre cantidad de pacientes enviados por odontólogos.
                                        </td>
                                    </tr>
                                    <tr style={{cursor: 'pointer'}} onClick={()=>{navigate("ingresos-mensuales")}}>
                                        <td  className="text-center">
                                            Reporte de ingresos mensuales
                                        </td>
                                    </tr>
                                    <tr style={{cursor: 'pointer'}} onClick={()=>{navigate("egresos-mensuales")}}>
                                        <td  className="text-center">
                                            Reporte de egresos mensuales
                                        </td>
                                    </tr>
                                    <tr style={{cursor: 'pointer'}} onClick={()=>{navigate("comision-odontologos")}}>
                                        <td  className="text-center">
                                            Reporte de comisiones a pagar por odontólogo.   
                                        </td>
                                    </tr>
                            </tbody>
                        </Table>
                      
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
