import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet, RouterModule, Router } from '@angular/router';
import { SeguridadService } from '../../Core/services/seguridad.service';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatIconModule, RouterModule, CommonModule ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit{

  router = inject(Router);

  seguridadService = inject(SeguridadService);
  rolIdLogin: number = 0;

  
  ngOnInit(): void {
    this.rolIdLogin = Number(localStorage.getItem('rolID'));
    this.initSidebar();
  }

  logout(): void {
    this.seguridadService.logout();
  }

  // este lo hize especialmente para que me mantenga "Consultas" activo aun asi este en filtroVertical o filtroProceso, esto porque son rutas hijas
  // si no tuviera rutas hijas esto no es necesario
  isActiveRoute(routes: string[]): boolean {
    const currentRoute = this.router.url;
    return routes.some(route => currentRoute.includes(route));
  }
 

  //configuaraciones del sidebar
  initSidebar() {
    /*===== EXPANDER MENU  =====*/ 
    const showMenu = ()=>{
      const toggle = document.getElementById('nav-toggle'),
      navbar = document.getElementById('navbar'),
      bodypadding = document.getElementById('body-pd')

      if(toggle && navbar){
        toggle.addEventListener('click', ()=>{
          navbar.classList.toggle('expander')

          bodypadding?.classList.toggle('body-pd')
        })
      }
    }
    showMenu()

    
    // LINK ACTIVE      -   Esto ya no es necesario ya que estoy utilizando el routerLinkActive="active" en las etiqutas "a",  la clase que si le tengo que poner a la etiquetas "a" es nav__link para darle estilo, per pero como digo esto ya no es necesario, ya que esto hace la logica de quitar y poner el active, pero eso ya lo hace el roterLinkActive de Angular
    const linkColor = document.querySelectorAll('.nav__link');
    const colorLink = (event: Event) => {
      linkColor.forEach(l => l.classList.remove('active'));
      (event.currentTarget as HTMLElement).classList.add('active');
    };
    linkColor.forEach(l => l.addEventListener('click', colorLink));
    
    

    
    // COLLAPSE MENU  
    const linkCollapse = document.getElementsByClassName('collapse__link');
    for (let i = 0; i < linkCollapse.length; i++) {
      linkCollapse[i].addEventListener('click', (event: Event) => {
        const collapseMenu = (event.currentTarget as HTMLElement).nextElementSibling as HTMLElement;
        collapseMenu.classList.toggle('showCollapse');

        const rotate = collapseMenu.previousElementSibling as HTMLElement;
        rotate.classList.toggle('rotate');
      });
    }


  }
  

}


