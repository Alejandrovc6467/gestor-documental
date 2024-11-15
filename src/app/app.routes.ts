import { Routes } from '@angular/router';

import { DocumentosComponent } from './pages/documentos/documentos.component';
import { NormasComponent } from './pages/normas/normas.component';
import { EtapasComponent } from './pages/etapas/etapas.component';
import { ClasificacionesComponent } from './pages/clasificaciones/clasificaciones.component';
import { SubclasificacionesComponent } from './pages/subclasificaciones/subclasificaciones.component';
import { CategoriasComponent } from './pages/categorias/categorias.component';
import { DoctosComponent } from './pages/doctos/doctos.component';
import { DocumentoversionesComponent } from './pages/documentoversiones/documentoversiones.component';
import { TipodocumentosComponent } from './pages/tipodocumentos/tipodocumentos.component';
import { IniciosesionprincipalComponent } from './pages/iniciosesionprincipal/iniciosesionprincipal.component';
import { FiltroHorizontalComponent } from './pages/filtro-horizontal/filtro-horizontal.component';
import { FiltroVerticalComponent } from './pages/filtro-vertical/filtro-vertical.component';
import { FiltroHorizontalProcesoComponent } from './pages/filtro-horizontal-proceso/filtro-horizontal-proceso.component';
import { ReporteBitacoraDeMovimientosComponent } from './pages/Reportes/reporte-bitacora-de-movimientos/reporte-bitacora-de-movimientos.component';
import { ReporteControlDeVersionesComponent } from './pages/Reportes/reporte-control-de-versiones/reporte-control-de-versiones.component';
import { ReporteDocumentosAntiguosComponent } from './pages/Reportes/reporte-documentos-antiguos/reporte-documentos-antiguos.component';
import { ReporteMaestroDeDocumentosComponent } from './pages/Reportes/reporte-maestro-de-documentos/reporte-maestro-de-documentos.component';
import { ReporteMaestroDeDocumentosPorNormaComponent } from './pages/Reportes/reporte-maestro-de-documentos-por-norma/reporte-maestro-de-documentos-por-norma.component';
import { ReporteDescargaDeDocumentosComponent } from './pages/Reportes/reporte-descarga-de-documentos/reporte-descarga-de-documentos.component';
import { ReporteDocumentosSinMovimientosComponent } from './pages/Reportes/reporte-documentos-sin-movimientos/reporte-documentos-sin-movimientos.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { IniciosesionoficinasComponent } from './pages/iniciosesionoficinas/iniciosesionoficinas.component';
import { administradorGuard } from './Core/guards/administrador.guard';



//  { path: 'oficinas', component: OficinasComponent, canActivate:[administradorGuard]},

export const routes: Routes = [

    //inicie en FiltroHorizontalComponent por default
    {path:'',
    component:SidebarComponent,
    children: [
            {path: 'consultas/filtroHorizontal', component:FiltroHorizontalComponent, canActivate:[administradorGuard], data:{roles:['1', '2','3','4']}},
            {path: 'consultas/filtroProceso', component:FiltroHorizontalProcesoComponent, canActivate:[administradorGuard], data:{roles:['1', '2','3','4']}},
            {path: 'consultas/filtroVertical', component:FiltroVerticalComponent, canActivate:[administradorGuard], data:{roles:['1', '2','3','4']}},

            {path: 'documentos', component:DocumentosComponent, canActivate:[administradorGuard], data:{roles:['1', '2','3']}},
            {path: 'documentos/versiones/:id', component:DocumentoversionesComponent , canActivate:[administradorGuard], data:{roles:['1', '2','3']}},
            {path: 'normas', component:NormasComponent, canActivate:[administradorGuard], data:{roles:['1']}},
            {path: 'etapas', component:EtapasComponent , canActivate:[administradorGuard], data:{roles:['1', '2','3']}},
            {path: 'clasificaciones', component:ClasificacionesComponent, canActivate:[administradorGuard], data:{roles:['1', '2','3']}},
            {path: 'subclasificaciones', component:SubclasificacionesComponent , canActivate:[administradorGuard], data:{roles:['1', '2','3']}},
            {path: 'categorias', component:CategoriasComponent , canActivate:[administradorGuard], data:{roles:['1']}},
            {path: 'doctos', component:DoctosComponent , canActivate:[administradorGuard], data:{roles:['1', '2','3']}},
            {path: 'tipodocumentos', component:TipodocumentosComponent , canActivate:[administradorGuard], data:{roles:['1', '2','3']}},
        
            {path: 'reporteBitacoraMovimientos', component:ReporteBitacoraDeMovimientosComponent , canActivate:[administradorGuard], data:{roles:['1', '2','3']}},
            {path: 'reporteControlDeVersiones', component:ReporteControlDeVersionesComponent , canActivate:[administradorGuard], data:{roles:['1', '2','3']}},
            {path: 'reporteDocumentosAntiguos', component:ReporteDocumentosAntiguosComponent , canActivate:[administradorGuard], data:{roles:['1', '2','3']}},
            {path: 'reporteMaestroDeDocumentos', component:ReporteMaestroDeDocumentosComponent , canActivate:[administradorGuard], data:{roles:['1', '2','3']}},
            {path: 'reporteMaestroDeDocumentosPorNorma', component:ReporteMaestroDeDocumentosPorNormaComponent , canActivate:[administradorGuard], data:{roles:['1', '2','3']}},
            {path: 'reporteDescargaDeDocumentos', component:ReporteDescargaDeDocumentosComponent , canActivate:[administradorGuard], data:{roles:['1', '2','3']}},
            {path: 'reporteDocumentosSinMovimientos', component:ReporteDocumentosSinMovimientosComponent , canActivate:[administradorGuard], data:{roles:['1', '2','3']}},

            { path: '', redirectTo: 'consultas/filtroHorizontal', pathMatch: 'full' }
       
        ]
    },



    {path: 'iniciosesionprincipal', component:IniciosesionprincipalComponent},
    {path: 'iniciosesionoficinas', component:IniciosesionoficinasComponent, canActivate:[administradorGuard], data:{roles:['1', '2','3', '4']}}, //este debe llevar el canActive puede ser cualquiera de los que haga pero que se auntentifique primero

    //si la ruta  no existe redirecciona a usuarios, obvio si no esta autenticado pues nunca entra aqui y lo manda al loggin
    {path: '**', redirectTo:'consultas/filtroHorizontal'},
  


];

// el path ** siempre debe de ir al final, ya que si va al principio pues no importa la ruta que pongas siempre entrara en **, porque lee desde arriba
// enotnces por eso hay que ponerla al fondo, porque si no encuentra nada entre al **
// con {path '**', redirecTo: ''} lo redireccion a la raiz, como lo tengo pues lo envio a un componente, podria crearme uno de 404 no fount, pero mas adelante
