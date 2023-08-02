import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Global } from '../../../../helper/Global';

const EditarCategoria = () => {

    const [nombre, setNombre] = useState("");
    const [categoria, setCategoria] = useState("");
    const [imagen, setImagen] = useState("");

    const navigate = useNavigate();
    const {id} = useParams();

    const updateCategoria = async (e) => {
        e.preventDefault();
        await axios.put(`${Global.url}/updateProducto/${id}`, 
        { nombre: nombre, 
          categoria: categoria, 
          imagen: imagen });

        navigate('/admin/categoria');
    }

    useEffect(()=>{
        const getCategoriaOne = async() =>{
            const oneProducto = await axios.get(`${Global.url}/oneProducto/${id}`);
            setNombre(oneProducto.data.nombre);
            setCategoria(oneProducto.data.categoria);
            setImagen(oneProducto.data.imagen);
        }
        getCategoriaOne();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div className="container col-md-10 mt-6">
            <div className="card">
                <div className="card-header fw-bold">
                    Editar Categoria:
                </div>
                <form className="p-4 needs-validation" onSubmit={updateCategoria}>
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
                                value={imagen}
                                onChange={(e) => { setImagen(e.target.value) }}
                                type="text"    
                            ></textarea>
                        </div>  
                    </div>

                    <div className="d-flex gap-2 contentBtnRegistrar">
                        <input type="hidden" name="oculto" value="1" />
                        <Link to="/admin/categoria" className="btn btn-danger btnCancelar">Cancelar</Link>
                        <input type="submit" className="btn btn-primary btnRegistrar" value="Grabar" />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditarCategoria