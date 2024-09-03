import { Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { PruebaComponent } from './prueba/prueba.component';
import { LogueoComponent } from './logueo/logueo.component';

export const routes: Routes = [

    {path:'', component:InicioComponent},
    {path: 'documentos/prueba', component:PruebaComponent},
    {path: 'logueo', component:LogueoComponent}
  


];
