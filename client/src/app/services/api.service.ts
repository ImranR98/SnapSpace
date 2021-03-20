import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppError, AppErrorCodes, Image } from 'models';
import { environment } from 'src/environments/environment';

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
    return this.http.post(environment.apiUrl + '/api/register', { email, password }).toPromise()
  }

  confirmRegistration(registrationKey: string) {
    return this.http.post(environment.apiUrl + '/api/confirmRegistration', { registrationKey }).toPromise()
  }

  upload(files: FileList | null, others: boolean | string[] = false) {
    if (!files) throw new AppError(AppErrorCodes.NO_FILES_UPLOADED)
    let currentBlock = 0
    let formDataArray: FormData[] = [new FormData()]
    formDataArray[currentBlock].append('others', JSON.stringify(others))
    for (let i = 0; i < files.length; i++) {
      if (i % 5 == 0 && i != 0) {
        currentBlock++
        formDataArray.push(new FormData())
        formDataArray[currentBlock].append('others', JSON.stringify(others))
      }
      let file = files.item(i)
      if (file) formDataArray[currentBlock].append('files', file, file.name)
    }
    let promises: Promise<Object>[] = []
    formDataArray.forEach(formData => promises.push(this.http.post(environment.apiUrl + '/api/upload', formData).toPromise()))
    return Promise.all(promises)
  }

  images(imageIds: string[] | null = null, limited: boolean = false) {
    let param1 = imageIds ? '?images=' + imageIds.join(',') : ''
    let param2 = limited ? (param1.length > 0 ? '&' : '?') + 'limited=true' : ''
    return this.http.get(environment.apiUrl + '/api/images' + param1 + param2).toPromise() as Promise<Image[]>
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
    return this.http.get(environment.apiUrl + '/api/images/mine' + param1 + param2).toPromise() as Promise<Image[]>
  }

  publicImages(imageIds: string[] | null = null, limited: boolean = false) {
    let param1 = imageIds ? '?images=' + imageIds.join(',') : ''
    let param2 = limited ? (param1.length > 0 ? '&' : '?') + 'limited=true' : ''
    return this.http.get(environment.apiUrl + '/api/images/public' + param1 + param2).toPromise() as Promise<Image[]>
  }

  imagesSharedWithMe(imageIds: string[] | null = null, limited: boolean = false) {
    let param1 = imageIds ? '?images=' + imageIds.join(',') : ''
    let param2 = limited ? (param1.length > 0 ? '&' : '?') + 'limited=true' : ''
    return this.http.get(environment.apiUrl + '/api/images/sharedWithMe' + param1 + param2).toPromise() as Promise<Image[]>
  }

  deleteFunc(imageIds: string[]) {
    return this.http.post(environment.apiUrl + '/api/delete', { images: imageIds }).toPromise()
  }

  email(userId: string) {
    return this.http.get(environment.apiUrl + `/api/email?user=${userId}`).toPromise() as Promise<{ email: string }>
  }

  updateSharing(imageIds: string[], others: boolean | string[]) {
    return this.http.post(environment.apiUrl + `/api/updateSharing`, { images: imageIds, others }).toPromise() as Promise<{ email: string }>
  }
}
