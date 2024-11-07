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



export const routes: Routes = [

    //inicie en FiltroHorizontalComponent por default
    {path:'',
    component:SidebarComponent,
    children: [
            {path: 'consultas/filtroHorizontal', component:FiltroHorizontalComponent},
            {path: 'consultas/filtroProceso', component:FiltroHorizontalProcesoComponent},
            {path: 'consultas/filtroVertical', component:FiltroVerticalComponent},
            {path: 'documentos', component:DocumentosComponent},
            {path: 'documentos/versiones/:id', component:DocumentoversionesComponent},
            {path: 'normas', component:NormasComponent},
            {path: 'etapas', component:EtapasComponent},
            {path: 'clasificaciones', component:ClasificacionesComponent},
            {path: 'subclasificaciones', component:SubclasificacionesComponent},
            {path: 'categorias', component:CategoriasComponent},
            {path: 'doctos', component:DoctosComponent},
            {path: 'tipodocumentos', component:TipodocumentosComponent},
        
            {path: 'reporteBitacoraMovimientos', component:ReporteBitacoraDeMovimientosComponent},
            {path: 'reporteControlDeVersiones', component:ReporteControlDeVersionesComponent},
            {path: 'reporteDocumentosAntiguos', component:ReporteDocumentosAntiguosComponent},
            {path: 'reporteMaestroDeDocumentos', component:ReporteMaestroDeDocumentosComponent},
            {path: 'reporteMaestroDeDocumentosPorNorma', component:ReporteMaestroDeDocumentosPorNormaComponent},
            {path: 'reporteDescargaDeDocumentos', component:ReporteDescargaDeDocumentosComponent},
            {path: 'reporteDocumentosSinMovimientos', component:ReporteDocumentosSinMovimientosComponent},

            { path: '', redirectTo: 'consultas/filtroHorizontal', pathMatch: 'full' }
       
        ]
    },



    {path: 'iniciosesionprincipal', component:IniciosesionprincipalComponent},

    //si la ruta  no existe redirecciona a usuarios, obvio si no esta autenticado pues nunca entra aqui y lo manda al loggin
    {path: '**', redirectTo:'consultas/filtroHorizontal'},
  


];

// el path ** siempre debe de ir al final, ya que si va al principio pues no importa la ruta que pongas siempre entrara en **, porque lee desde arriba
// enotnces por eso hay que ponerla al fondo, porque si no encuentra nada entre al **
// con {path '**', redirecTo: ''} lo redireccion a la raiz, como lo tengo pues lo envio a un componente, podria crearme uno de 404 no fount, pero mas adelante
