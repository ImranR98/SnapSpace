import { Component, OnInit } from '@angular/core';
import { AppError, AppErrorCodes, Image, instanceOfImages } from 'models';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { ErrorService } from '../services/error.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService, private apiService: ApiService, private errorService: ErrorService) { }

  images: Image[] = []

  loading: boolean = false

  ngOnInit(): void {
    this.apiService.images().then((images) => {
      if (instanceOfImages(images)) this.images = images
      else this.images = []
    }).catch(err => {
      this.errorService.showError(err)
    })
  }

  logout() {
    this.authService.logout()
  }

}
