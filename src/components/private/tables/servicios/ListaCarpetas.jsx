import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Global } from "../../../../helper/Global";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import Swal from "sweetalert2";
import { BsFillCheckSquareFill, BsFillXSquareFill } from "react-icons/bs";
import useAuth from "../../../../hooks/useAuth";

const ListaCarpetas = () => {
  let token = localStorage.getItem("token");
  const [insumo, setInsumo] = useState({});
  const [loading, setLoading] = useState(false);
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getOneInsumo();
    if (auth.id_rol != "99") {
      navigate("/admin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getOneInsumo = async () => {
    setLoading(true);
    const request = await axios.get(`${Global.url}/oneInsumo/1`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setInsumo(request.data);
    setLoading(false);
  };

  return (
    <div className="container mt-6 ms-5-auto">
      <div className="row justify-content-center">
        {/* TAMAÑO DE LA TABLA WIDTH  */}
        <div className="col-md-11">
          {/* <!--=== TABLA PRODUCTOS ===--> */}
          <div className="card">
            <div
              className="card-header text-center fs-5 fw-bolder"
              style={{ transition: "all 500ms" }}
            >
              Listado de Insumo por Carpeta
            </div>
            <div className="content_top_filters">
              <div className="content_top_filters__buttons">
                <button
                  onClick={() => navigate("/admin/examenes")}
                  style={{
                    backgroundColor: "transparent",
                    color: "#41326D",
                  }}
                >
                  Exámenes
                </button>
                <button
                  onClick={() => navigate("/admin/tipos-examen")}
                  style={{
                    backgroundColor: "transparent",
                    color: "#41326D",
                  }}
                >
                  Tipos de exámen
                </button>
                <button
                  onClick={() => navigate("/admin/carpetas")}
                  style={{
                    backgroundColor: "#41326D",
                    color: "white",
                  }}
                >
                  Insumo Carpeta
                </button>
              </div>
            </div>

            <div className="p-4 table-responsive odon_itemServices">
              <Table
                id="productos"
                className="table align-middle table-hover display"
              >
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="text-center">
                      ID
                    </th>

                    <th scope="col" className="text-center">
                      Nombre
                    </th>

                    <th scope="col" className="text-center">
                      Precio
                    </th>
                    {/* <!-- 3 --> */}
                    <th scope="col" className="text-center">
                      Opciones
                    </th>
                  </tr>
                </thead>
                <tbody id="tableBody">
                  {loading == false ? (
                    <tr key={insumo.id}>
                      <td className="text-center">{insumo.id}</td>

                      <td className="text-center">{insumo.nombre}</td>

                      <td className="text-center">{insumo.precio}</td>

                      {/* <!-- 9. Opciones --> */}
                      <td className="text-center">
                        <Link
                          className="text-success"
                          to={`editar/${insumo.id}`}
                        >
                          <FontAwesomeIcon icon={faPencil} />
                        </Link>
                      </td>
                    </tr>
                  ) : 
                    (
                        <tr colSpan="6" align="center" rowSpan="5">
                          <td colSpan="6">
                            <div className="dot-spinner">
                              <div className="dot-spinner__dot"></div>
                              <div className="dot-spinner__dot"></div>
                              <div className="dot-spinner__dot"></div>
                              <div className="dot-spinner__dot"></div>
                              <div className="dot-spinner__dot"></div>
                              <div className="dot-spinner__dot"></div>
                              <div className="dot-spinner__dot"></div>
                              <div className="dot-spinner__dot"></div>
                            </div>
                          </td>
                        </tr>
                      )}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListaCarpetas;
