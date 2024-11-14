import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class SeguridadService {

  private http = inject(HttpClient);
  private router = inject(Router); 
  private login_url = "http://gestordocumental.somee.com/api/ejemplo";
  private tokenKey = 'authToken'; // Diego no pudo


  constructor() { }

  loggin(user: string, password: string):   Observable<any>{
    return this.http.post<any>(this.login_url, {user, password}).pipe(
      tap(response => {
        if(response.token){
          console.log(response.token);
          this.setToken(response.token);
        }
      })
    )
  }

  private setToken(token: string):void{
    localStorage.setItem(this.tokenKey, token);
  }

  private getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if(!token){
      return false;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() < exp;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/iniciosesionprincipal']);
  }

  //aqui hacer un setRol, setearlo en el login, que reciba el JWT y de ahi lo tomo
  //getRol() 

  
  //para pruebas ********************************************************************
  loggin2(user: string, password: string): Observable<any> {
    localStorage.setItem('miUser', user);
    localStorage.setItem('miPassword', password);
  
    return new Observable(observer => {
      // Verificar si las credenciales son correctas
      if (user === 'admin@gmail.com' && password === '123456789') {
        observer.next({ message: 'Login exitoso' });
        observer.complete();
      } else {
        observer.error({ error: 'Credenciales incorrectas' });
      }
    });
  }

  isAuthenticatedP(): boolean {
    const user = localStorage.getItem('miUser');
    const password = localStorage.getItem('miPassword');

    return user == 'admin@gmail.com' && password == "123456789";
  }

  logout2(): void {
    localStorage.removeItem('miUser');
    localStorage.removeItem('miPassword');
    this.router.navigate(['/iniciosesionprincipal']);
  }


}

