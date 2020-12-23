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

  thumbnails: Image[] = []

  loading: boolean = false

  ngOnInit(): void {
    this.apiService.images(null, true).then((thumbnails) => {
      this.thumbnails = <Image[]>thumbnails
    }).catch(err => {
      this.errorService.showError(err)
    })
  }

  logout() {
    this.authService.logout()
  }

}
