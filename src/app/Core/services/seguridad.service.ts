import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class SeguridadService {

  private http = inject(HttpClient);
  private router = inject(Router); 
  private login_url = "http://gestordocumental.somee.com/api/Autenticación/login";

  private tokenKey = 'authToken'; // Diego no pudo


  constructor() { }

  /*
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
  */


  public loggin(correo: string, password: string): Observable<any> {
    // Configurar los parámetros
    const params = new HttpParams().set('Correo', correo).set('Password', password);
  
    // Realizar la solicitud POST y capturar la respuesta y errores
    return this.http.post(this.login_url, null, { params }).pipe(
      tap(response => {
        console.log('Respuesta de login:', response);




        // Aquí puedes almacenar información en el localStorage o realizar otras acciones   usar ele metodo isAuthenticatedP para eso
        localStorage.setItem('isAuthenticatedP', 'true'); // Ejemplo de almacenamiento




      }),
      catchError(error => {
        // Captura el error aquí, por ejemplo, un error 404
        if (error.status === 404) {
          console.error('Error 404: El recurso no fue encontrado');
        } else {
          console.error('Error en la solicitud:', error);
        }
        // Puedes decidir si deseas lanzar el error para que sea capturado en el componente
        return throwError(error); // Re-lanza el error si deseas manejarlo en el componente
      })
    );
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
      if (user === 'admin@gmail.com' && password === '123') {
        observer.next({ message: 'Login exitoso' });
        observer.complete();
      } else {
        observer.error({ error: 'Credenciales incorrectas' });
      }
    });
  }

  isAuthenticatedP(): boolean {

    //Si la

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

