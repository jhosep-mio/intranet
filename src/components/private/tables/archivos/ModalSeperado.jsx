import {React,  useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Global } from '../../../../helper/Global';
import Swal from 'sweetalert2';
import upload from './../../../../assets/admin/upload.svg';
import ProgressBar from './ProgressBar';


const ModalSeperado = (props) => {
  const { show, handleClose , id_orden, handleModalClick, getImages} = props;

  const[arrayArchivos, setArrayArchivos] = useState([]);
  const[imagenes, setImagenes] = useState([]);
  const[cargando, setCargando] = useState(false);
  const[uplo, setUpload] = useState("");

  const [progress, setProgress] = useState(0);

  const changeImage = (e) => {
      const files = e.target.files;
      const fileNames = Array.from(files).map(file => file.name);
      setArrayArchivos([...arrayArchivos,  fileNames]); 
      setImagenes({
          archivo: files,
      });

      const progressPercentage = Math.round((loaded * 100) / total);
      setProgress(progressPercentage);
  };
  
  const handleSubirImagenes = async (event) => {
      event.preventDefault();
      setCargando(true);
      setUpload("")
      
      let token = localStorage.getItem("token");
      const data = new FormData();
      const files = event.target.files;

      data.append('id_orden', id_orden);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileType = file.type;
    
        // Verificar si el archivo es de tipo imagen
        if (fileType.startsWith('image/')) {
          data.append('archivo[]', file);
        } else {
          // Archivo no válido, hacer algo (por ejemplo, mostrar un mensaje de error)
          Swal.fire('Solo se aceptan imágenes', '',  'warning');
        }
      }

      try {
        let respuesta = await axios.post(`${Global.url}/saveArchivos`, data ,{
          onUploadProgress: (progressEvent) => {
            // Calcular el progreso de carga
            const progressPercentage = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(progressPercentage);
          },
          headers:{
              'Authorization': `Bearer ${token}`
          }
      });
        if(respuesta.data.status == "success"){
          setUpload("success")
          getImages()
            // Swal.fire('Agregado correctamente', '', 'success');
            // navigate('/admin/categoria');
        }else{
            setUpload("error")
            // Swal.fire('Error al agregar el registro', '', 'error');
            console.log("error")
        }
    } catch (error) {
        setUpload("error")
        console.log(error.request.response)
        // Swal.fire('Complete todos los campos', '', 'warning');
    }
    setCargando(false)
  }

  return (

    <Modal onClick={handleModalClick} show={show} onHide={handleClose} className='modal-dialog-centered'>
        <Modal.Header closeButton>
          <Modal.Title>Subir Imágenes</Modal.Title>
        </Modal.Header>
        {cargando == false ?
          <Modal.Body>
              <div className="image-upload-wrap">
                  <input
                      className="file-upload-input"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleSubirImagenes}
                  />
                  <div className="image-upload-wrap__text-information">
                      <img src={upload} alt="" />
                  </div>
                  {/* {
                      arrayArchivos.map(function(comida) {
                          return (`${comida}`).replace(/,/g, "-----");
                      })
                  } */}
              </div>
          </Modal.Body>
        : 

          <Modal.Body style={{display: "flex", justifyContent: 'center', alignItems: "center"}}>
            <div className="progressbar">
                <p><span>{progress}</span>%</p>
                <span className='progressbar__up' style={{height: `${progress}%`}}></span>
            </div>
          </Modal.Body>
          }

        <Modal.Footer>
          <div className='content_footer_letter'  style={uplo == "success" || uplo == "error" ? {justifyContent: 'space-between'} : {justifyContent: 'flex-end'}}>
            { uplo == "success" ?
              <p style={{color: 'green', fontWeight: 'bold' ,fontSize: '22px'}}>Se subieron correctamente los archivos</p>
              : uplo == "error" ?
              <p style={{color: 'red', fontWeight: 'bold' ,fontSize: '22px'}}>Error al subir los archivos</p>
              :""
            }
            <Button variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
  );
};
export default ModalSeperado;