import React from 'react';
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import { PrivateLayout } from '../components/private/PrivateLayout';
import { Login } from '../components/public/Login';
import { AuthProvider } from '../context/AuthProvider';
import ListaClinica from '../components/private/tables/clinica/ListaClinica';
import EditarClinica from '../components/private/tables/clinica/EditarClinica';
import AgregarCliente from '../components/private/tables/clientes-odontologos/AgregarCliente';
import EditarOdontologo from '../components/private/tables/clientes-odontologos/EditarOdontologo';
import EditarPaciente from '../components/private/tables/clientes-odontologos/EditarPaciente';
import ListaOrdenVirtual from '../components/private/tables/orden_virtual/ListaOrdenVirtual';
import ValidarOrdenVirtual from '../components/private/tables/orden_virtual/ValidarOrdenVirtual';
import AgregarOrdenVirtual from '../components/private/tables/orden_virtual/AgregarOrdenVirtual';
import AgregarClinica from '../components/private/tables/clinica/AgregarClinica';
import ListaServicios from '../components/private/tables/servicios/ListaServicios';
import AgregarServicio from '../components/private/tables/servicios/AgregarServicio';
import EditarServicio from '../components/private/tables/servicios/EditarServicio';
import AgregarItem from '../components/private/tables/servicios/AgregarItem';
import EditarItem from '../components/private/tables/servicios/EditarItem';
import EditarOrdenVirtual from '../components/private/tables/orden_virtual/EditarOrdenVirtual';
import ArchivosEstudio from '../components/private/tables/archivos/ArchivosEstudio';
import { Reportes } from '../components/private/tables/reportes/Reportes';
import { PacientesClinicas } from '../components/private/tables/reportes/PacientesClinicas';
import { PacientesOdontologos } from '../components/private/tables/reportes/PacientesOdontologos';
import { IngresosMensuales } from '../components/private/tables/reportes/IngresosMensuales';
import EditarInsumo from '../components/private/tables/servicios/EditarInsumo';
import { ComisionOdontologos } from '../components/private/tables/reportes/ComisionOdontologos';
import ListaEgresos from '../components/private/tables/egresos/ListaEgresos';
import AgregarEgresos from '../components/private/tables/egresos/AgregarEgresos';
import EditarEgresos from '../components/private/tables/egresos/EditarEgresos';
import { EgresosMensuales } from '../components/private/tables/reportes/EgresosMensuales';
import ListaUsuarios from '../components/private/tables/usuarios/ListaUsuarios';
import AgregarUsuario from '../components/private/tables/usuarios/AgregarUsuario';
import EditarUsuario from '../components/private/tables/usuarios/EditarUsuario';
import ListaPacientes from '../components/private/tables/clientes-odontologos/ListaPacientes';
import ListaOdontologos from '../components/private/tables/clientes-odontologos/ListaOdontologos';
import ListaTipos from '../components/private/tables/servicios/ListaTipos';
import ListaCarpetas from '../components/private/tables/servicios/ListaCarpetas';

export const Routing = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
             <Route index element={<Login/>}></Route>
            <Route path='/login' element={<Login/>}></Route>
            <Route path='admin' element={<PrivateLayout/>}>
                <Route index element={<ListaClinica/>}/>
                {/* CLINICA */}
                <Route path='clinicas' element={<ListaClinica/>}/>
                <Route path='clinicas/agregar' element={<AgregarClinica/>}/>     
                <Route path='clinicas/editar/:id' element={<EditarClinica/>}/>     
                {/* PACIENTES / ODONTOLOGOS */}
                <Route path='clientes' element={<ListaPacientes/>}/>
                <Route path='clientes/odontologos' element={<ListaOdontologos/>}/>
                <Route path='clientes/agregar/:id_rol' element={<AgregarCliente/>}/>
                <Route path='clientes/editar/paciente/:id' element={<EditarPaciente/>}/>
                <Route path='clientes/editar/odontologos/:id' element={<EditarOdontologo/>}/>

                {/* EXAMENES */}
                <Route path='examenes' element={<ListaServicios/>}/>
                <Route path='examenes/agregar' element={<AgregarItem/>}/>
                <Route path='examenes/editar/:id' element={<EditarItem/>}/>

                {/* TIPOS DE EXAMEN */}
                <Route path='tipos-examen' element={<ListaTipos/>}/>
                <Route path='tipos-examen/agregar' element={<AgregarServicio/>}/>
                <Route path='tipos-examen/editar/:id' element={<EditarServicio/>}/>     

                {/* CARPETAS */}
                <Route path='carpetas' element={<ListaCarpetas/>}/>     
                <Route path='carpetas/editar/:id' element={<EditarInsumo/>}/>     
                
                {/* ORDEN VIRTUAL */}
                <Route path='ordenVirtual' element={<ListaOrdenVirtual/>}/>
                <Route path='ordenVirtual/validar' element={<ValidarOrdenVirtual/>}/>
                <Route path='ordenVirtual/agregar' element={<AgregarOrdenVirtual/>}/>
                <Route path='ordenVirtual/editar/:id' element={<EditarOrdenVirtual/>}/>
                {/* ORDEN VIRTUAL */}
                <Route path='archivosEstudio/:id' element={<ArchivosEstudio/>}/>
                {/* REPORTES */}
                <Route path='reportes' element={<Reportes/>}/>
                <Route path='reportes/pacientes-clinicas' element={<PacientesClinicas/>}/>
                <Route path='reportes/pacientes-odontologos' element={<PacientesOdontologos/>}/>
                <Route path='reportes/ingresos-mensuales' element={<IngresosMensuales/>}/>
                <Route path='reportes/egresos-mensuales' element={<EgresosMensuales/>}/>
                <Route path='reportes/comision-odontologos' element={<ComisionOdontologos/>}/>
                {/* EGRESOS */}
                <Route path='egresos' element={<ListaEgresos/>}/>
                <Route path='egresos/agregar' element={<AgregarEgresos/>}/>
                <Route path='egresos/editar/:id' element={<EditarEgresos/>}/>
                {/* USUARIOS */}
                <Route path='usuarioss' element={<ListaUsuarios/>}/>
                <Route path='usuarioss/agregar' element={<AgregarUsuario/>}/>
                <Route path='usuarioss/editar/:id' element={<EditarUsuario/>}/>

            </Route>
            <Route path='*' element={
                <>
                    <p>
                        <h1>ERROR 404</h1>
                    </p>
                </>
            } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    )
}
