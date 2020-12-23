import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import jwt_decode from 'jwt-decode'
import * as moment from 'moment'
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  isLoggedIn = new BehaviorSubject(false)

  // Validate the password and get a JSON Web Token to authenticate future requests
  async login(email: string, password: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        let response: { jwtToken: string } = <any>(await (this.http.post('/api/login', { email, password }, this.httpOptions).toPromise()))
        localStorage.setItem('jwt_token', response.jwtToken)
        let tokenDecoded = jwt_decode(response.jwtToken)
        localStorage.setItem('jwt_token_decoded', JSON.stringify(tokenDecoded))
        this.isLoggedIn.next(true)
        resolve()
      } catch (err) {
        this.logout()
        reject()
      }
    })
  }

  // Used for App routing, every time an attempt is made to access a protected route
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.isValidToken()
  }

  // Check the JWT and logout if it is expired or doesn't exist
  isValidToken(updateIfTrue: boolean = false) {
    let JWTDecoded: any = JSON.parse(localStorage.getItem("jwt_token_decoded") || '{}')
    let JWTExpiry = moment.unix(JWTDecoded.exp || null)
    let valid: boolean = (moment().isBefore(JWTExpiry))
    if (!valid) {
      this.logout()
    } else if (updateIfTrue) {
      this.isLoggedIn.next(true)
    }
    return valid
  }

  // Clear the JWT and redirect to home page
  logout() {
    this.isLoggedIn.next(false)
    localStorage.removeItem('jwt_token')
    localStorage.removeItem("jwt_token_decoded")
  }
}
