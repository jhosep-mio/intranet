import {React,  useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Global } from '../../../../helper/Global';
import upload from './../../../../assets/admin/uploadInformes.png';
import Swal from 'sweetalert2';


const ModalInformes = (props) => {
  const { show3, handleClose3, id_servicio, id_orden, handleModalClick, getInformes} = props;

  const[arrayInformes, setArrayInformes] = useState([]);
  const[informes, setInformes] = useState([]);
  const[cargando, setCargando] = useState(false);
  const[uplo, setUpload] = useState("");

  const [progress, setProgress] = useState(0);

  const handleSubirInformes = async (event) => {
      event.preventDefault();

      setCargando(true);
      setUpload("")
      
      let token = localStorage.getItem("token");
      const data = new FormData();
      const files = event.target.files;

      data.append('id_orden', id_orden);
      data.append('id_servicio', id_servicio);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExtension = '.' + file.name.split('.').pop();
      
        // Verificar la extensión del archivo y excluir imágenes
        if (file.type.startsWith('image/')) {
          // Archivo no válido, hacer algo (por ejemplo, mostrar un mensaje de error)
          Swal.fire('No se pueden subir imágenes', '', 'warning');
          continue; // Saltar al siguiente archivo
        }
      
        data.append('informe[]', file);
      }
      try {
        let respuesta = await axios.post(`${Global.url}/saveInformes`, data ,{
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
          getInformes()
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

    <Modal onClick={handleModalClick} show={show3} onHide={handleClose3} className='modal-dialog-centered'>
        <Modal.Header closeButton>
          <Modal.Title>Subir Informes</Modal.Title>
        </Modal.Header>
        {cargando == false ?
          <Modal.Body>
              <div className="image-upload-wrap">
                  <input
                      className="file-upload-input"
                      type="file"
                      multiple
                      accept="*"
                      onChange={handleSubirInformes}
                  />
                  <div className="image-upload-wrap__text-information">
                      <img src={upload} alt="" />
                  </div>
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
              <p style={{color: 'green',fontWeight: 'bold' ,fontSize: '22px'}}>Se subieron correctamente los archivos</p>
              : uplo == "error" ?
              <p style={{color: 'red',fontWeight: 'bold' ,fontSize: '22px'}}>Error al subir los archivos</p>
              :""
            }
            <Button variant="secondary" onClick={handleClose3}>
              Cerrar
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
  );
};
export default ModalInformes;