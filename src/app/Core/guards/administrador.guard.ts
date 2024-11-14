import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SeguridadService } from '../services/seguridad.service';

export const administradorGuard: CanActivateFn = (route, state) => {


  const seguridadService = inject(SeguridadService);
  const router = inject(Router);
  
  if (!seguridadService.isAuthenticated()) {
    return router.navigate(['/iniciosesionprincipal']);
  }
  
  const allowedRoles = route.data['roles'] as string[];
  if (!allowedRoles || allowedRoles.length === 0) {
    return true; // Si no hay roles específicos, permitir acceso
  }

  if (!seguridadService.hasRole(allowedRoles)) {
    return router.navigate(['/acceso-denegado']); // Redirigir a una página de acceso denegado
  }

  return true;








  // hacer un guard nuevo (un archivo) para cada rol, y hacerlo similar a este

  
  /*
  const seguridadService = inject(SeguridadService);
  const router = inject(Router);

  //quitar  este es solo para pruebas
  if(seguridadService.isAuthenticated()){
    return true;
  }else{
    return router.navigate(['/iniciosesionprincipal']);
  }
    */



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
