import { Routes } from '@angular/router';

import { DocumentosComponent } from './pages/documentos/documentos.component';
import { OficinasComponent } from './pages/oficinas/oficinas.component';
import { NormasComponent } from './pages/normas/normas.component';
import { ConsultasComponent } from './pages/consultas/consultas.component';
import { EtapasComponent } from './pages/etapas/etapas.component';
import { ClasificacionesComponent } from './pages/clasificaciones/clasificaciones.component';
import { SubclasificacionesComponent } from './pages/subclasificaciones/subclasificaciones.component';
import { CategoriasComponent } from './pages/categorias/categorias.component';
import { DoctosComponent } from './pages/doctos/doctos.component';
import { DocumentoversionesComponent } from './pages/documentoversiones/documentoversiones.component';
import { NormaetapasComponent } from './pages/normaetapas/normaetapas.component';
import { PruebaComponent } from './pages/prueba/prueba.component';
import { TipodocumentosComponent } from './pages/tipodocumentos/tipodocumentos.component';
import { UsuarionormaComponent } from './pages/usuarionorma/usuarionorma.component';
import { RolesComponent } from './pages/roles/roles.component';
import { IniciosesionprincipalComponent } from './pages/iniciosesionprincipal/iniciosesionprincipal.component';



export const routes: Routes = [

    //inicie en Consultas por default
    {path:'', component:ConsultasComponent},

   
    
    {path: 'consultas', component:ConsultasComponent},
    {path: 'documentos', component:DocumentosComponent},
    {path: 'documentos/versiones/:id', component:DocumentoversionesComponent},
    {path: 'oficinas', component:OficinasComponent},
    {path: 'normas', component:NormasComponent},
    {path: 'normas/etapas/:id', component:NormaetapasComponent},
    {path: 'etapas', component:EtapasComponent},
    {path: 'clasificaciones', component:ClasificacionesComponent},
    {path: 'subclasificaciones', component:SubclasificacionesComponent},
    {path: 'categorias', component:CategoriasComponent},
    {path: 'doctos', component:DoctosComponent},
    {path: 'tipodocumentos', component:TipodocumentosComponent},
    {path: 'usuarionorma', component:UsuarionormaComponent},
    {path: 'roles', component:RolesComponent},



    
    {path: 'pruebas', component:PruebaComponent},



    {path: 'iniciosesionprincipal', component:IniciosesionprincipalComponent},
    //si la ruta  no existe redirecciona a consultas
    {path: '**', component:ConsultasComponent},
  


];

// el path ** siempre debe de ir al final, ya que si va al principio pues no importa la ruta que pongas siempre entrara en **, porque lee desde arriba
// enotnces por eso hay que ponerla al fondo, porque si no encuentra nada entre al **
// con {path '**', redirecTo: ''} lo redireccion a la raiz, como lo tengo pues lo envio a un componente, podria crearme uno de 404 no fount, pero mas adelante
