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
    return router.navigate(['/acceso-denegado']); // Redirigir a una página de acceso denegado, esta pagina no existe por, como no es una ruta conocida me envia al loggin automaticamente, pero podria hacer una para esto
  }

  return true;


};
