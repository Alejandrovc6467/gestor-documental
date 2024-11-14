import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SeguridadService } from '../../Core/services/seguridad.service';



@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit{

  seguridadService = inject(SeguridadService);
  
  ngOnInit(): void {
    this.initSidebar();
  }

  logout(): void {
    this.seguridadService.logout();
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

    
    // LINK ACTIVE
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


