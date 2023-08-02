import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Global } from '../../../../helper/Global';

const AgregarCategoria = () => {

    const [nombre, setNombre] = useState("");
    const [categoria, setCategoria] = useState("");
    const [imagen, setImagen] = useState("");

    const navigate = useNavigate();

    const saveCategoria = async (e) => {
        e.preventDefault();
        await axios.post(`${Global.url}/saveProducto`, { nombre: nombre, categoria: categoria, imagen: imagen });
        navigate('/admin/categoria');
    }

    return (
        <div className="container col-md-10 mt-6">
            <div className="card">
                <div className="card-header fw-bold">
                    Agregar Categoria:
                </div>
                <form className="p-4 needs-validation" onSubmit={saveCategoria}>
                    <div className="d-flex  justify-content-between">
                        <div className="mb-3 col-md-5">
                            <label className="form-label">Nombre: </label>
                            <input className="form-control" autoFocus required
                                value={nombre}
                                onChange={(e) => { setNombre(e.target.value) }}
                                type="text"
                            />
                        </div>

                        <div className="mb-3 col-md-5">
                            <label className="form-label">Categoria: </label>
                            <input className="form-control" autoFocus required
                                value={categoria}
                                onChange={(e) => { setCategoria(e.target.value) }}
                                type="text"
                            />
                        </div>
                    </div>

                    <div className="d-flex  justify-content-center">
                        <div className="mb-3">
                            <label className="form-label">Imagen: </label>
                            <textarea className="form-control" cols="30" rows="5" autoFocus required
                                onChange={(e) => { setImagen(e.target.value) }}
                                value={imagen}
                                type="text"    
                            ></textarea>
                        </div>  
                    </div>

                    <div className="d-flex gap-2 contentBtnRegistrar">
                        <input type="hidden" name="oculto" value="1" />
                        <Link to="/admin/categoria" className="btn btn-danger btnCancelar">Cancelar</Link>
                        <input type="submit" className="btn btn-primary btnRegistrar" value="Registrar" />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AgregarCategoria