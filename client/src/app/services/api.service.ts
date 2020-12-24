import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppError, AppErrorCodes } from 'models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  register(email: string, password: string) {
    return this.http.post('/api/register', { email, password }).toPromise()
  }

  upload(files: FileList | null, others: boolean | string[] = false) {
    if (!files) throw new AppError(AppErrorCodes.NO_FILES_UPLOADED)
    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      let file = files.item(i)
      if (file) formData.append('files', file, file.name)
    }
    formData.append('others', JSON.stringify(others))
    return this.http.post('/api/upload', formData).toPromise()
  }

  images(imageIds: string[] | null = null, limited: boolean = false) {
    let param1 = imageIds ? '?images=' + JSON.stringify(imageIds) : ''
    let param2 = limited ? (param1.length > 0 ? '&' : '?') + 'limited=true' : ''
    return this.http.get('/api/images' + param1 + param2).toPromise()
  }

  deleteFunc(imageIds: string[]) {
    return this.http.post('/api/delete', { images: imageIds }).toPromise()
  }
}
