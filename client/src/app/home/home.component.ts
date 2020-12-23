import { Component, OnInit } from '@angular/core';
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

  loading: boolean = false

  ngOnInit(): void {
  }

  testLogin() {
    this.loading = true
    this.apiService.testLogin().then(() => {
      this.loading = false
      this.errorService.showSimpleSnackBar('Logged In')
    }).catch(err => {
      this.loading = false
      this.errorService.showError(err)
    })    
  }

  logout() {
    this.authService.logout()
  }

}
