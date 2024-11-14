import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SeguridadService } from '../services/seguridad.service';

export const administradorGuard: CanActivateFn = (route, state) => {


  // hacer un guard nuevo (un archivo) para cada rol, y hacerlo similar a este

  
  const seguridadService = inject(SeguridadService);
  const router = inject(Router);

  //quitar  este es solo para pruebas
  if(seguridadService.isAuthenticated()){
    return true;
  }else{
    return router.navigate(['/iniciosesionprincipal']);
  }



  /*
  const seguridadService = inject(SeguridadService);
  const router = inject(Router);

  // Obtener los roles permitidos desde los datos de la ruta
  const rolesPermitidos = route.data['rolesPermitidos'] as string[];

  // Verificar si el usuario tiene alguno de los roles permitidos
  if (rolesPermitidos.some(rol => seguridadService.isUserInRole(rol))) {
    return true;
  } else {
    return router.navigate(['/iniciosesionprincipal']);
  }
    */






};
