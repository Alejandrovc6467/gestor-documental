import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SeguridadService } from '../services/seguridad.service';

export const administradorGuard: CanActivateFn = (route, state) => {

  /** hacer un guard nuevo (un archivo) para cada rol, y hacerlo similar a este */

  const seguridadService = inject(SeguridadService);
  const router = inject(Router);


  //quitar P  este es solo para pruebas
  if(seguridadService.isAuthenticatedP()){
    return true;
  }else{
    return router.navigate(['/iniciosesionprincipal']);
  }


};
