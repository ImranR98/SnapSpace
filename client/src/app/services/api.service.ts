import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppError, AppErrorCodes, Image } from 'models';

export enum imageRequestTypes {
  mine, public, sharedWithMe
}

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

  confirmRegistration(registrationKey: string) {
    return this.http.post('/api/confirmRegistration', { registrationKey }).toPromise()
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
    let param1 = imageIds ? '?images=' + imageIds.join(',') : ''
    let param2 = limited ? (param1.length > 0 ? '&' : '?') + 'limited=true' : ''
    return this.http.get('/api/images' + param1 + param2).toPromise() as Promise<Image[]>
  }

  imagesOfType(imageIds: string[] | null = null, limited: boolean = false, requestType: imageRequestTypes) {
    switch (requestType) {
      case imageRequestTypes.mine:
        return this.myImages(imageIds, limited)
        break;
      case imageRequestTypes.public:
        return this.publicImages(imageIds, limited)
        break;
      case imageRequestTypes.sharedWithMe:
        return this.imagesSharedWithMe(imageIds, limited)
        break;
      default:
        return this.publicImages(imageIds, limited)
        break;
    }
  }

  myImages(imageIds: string[] | null = null, limited: boolean = false) {
    let param1 = imageIds ? '?images=' + imageIds.join(',') : ''
    let param2 = limited ? (param1.length > 0 ? '&' : '?') + 'limited=true' : ''
    return this.http.get('/api/images/mine' + param1 + param2).toPromise() as Promise<Image[]>
  }

  publicImages(imageIds: string[] | null = null, limited: boolean = false) {
    let param1 = imageIds ? '?images=' + imageIds.join(',') : ''
    let param2 = limited ? (param1.length > 0 ? '&' : '?') + 'limited=true' : ''
    return this.http.get('/api/images/public' + param1 + param2).toPromise() as Promise<Image[]>
  }

  imagesSharedWithMe(imageIds: string[] | null = null, limited: boolean = false) {
    let param1 = imageIds ? '?images=' + imageIds.join(',') : ''
    let param2 = limited ? (param1.length > 0 ? '&' : '?') + 'limited=true' : ''
    return this.http.get('/api/images/sharedWithMe' + param1 + param2).toPromise() as Promise<Image[]>
  }

  deleteFunc(imageIds: string[]) {
    return this.http.post('/api/delete', { images: imageIds }).toPromise()
  }

  email(userId: string) {
    return this.http.get(`/api/email?user=${userId}`).toPromise() as Promise<{ email: string }>
  }

  updateSharing(imageIds: string[], others: boolean | string[]) {
    return this.http.post(`/api/updateSharing`, { images: imageIds, others }).toPromise() as Promise<{ email: string }>
  }
}
