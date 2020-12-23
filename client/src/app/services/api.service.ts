import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  testLogin() {
    return this.http.get('/api/testLogin').toPromise()
  }

  register(email: string, password: string) {
    return this.http.post('/api/register', { email, password }).toPromise()
  }

  upload(files: FileList, others: boolean | string[] = false) {
    return this.http.post('/api/register', { files, others }).toPromise()
  }

  images() {
    return this.http.get('/api/images').toPromise()
  }
}
