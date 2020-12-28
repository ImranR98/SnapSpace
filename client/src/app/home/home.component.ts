import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { ErrorService } from '../services/error.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService, private apiService: ApiService, private router: Router, private errorService: ErrorService) { }

  minimumPasswordCharacters: number = 8

  loading: boolean = false

  isLoggedIn: boolean = false

  authForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  })

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn)
  }

  getTimePhrase = (now: Date = new Date()) => {
    if (now.getHours() == 0 || now.getHours() >= 18) return 'Evening'
    if (now.getHours() >= 12) return 'Afternoon'
    return 'Morning'
  }

  login() {
    if (this.authForm.valid && !this.loading && this.authForm.controls['password'].value.length >= this.minimumPasswordCharacters) {
      this.loading = true
      this.authService.login(this.authForm.controls['email'].value, this.authForm.controls['password'].value).then(() => {
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.errorService.showError(err)
      })
    }
  }

  register() {
    if (this.authForm.valid && !this.loading && this.authForm.controls['password'].value.length >= this.minimumPasswordCharacters) {
      this.loading = true
      this.apiService.register(this.authForm.controls['email'].value, this.authForm.controls['password'].value).then(() => {
        this.loading = false
        this.errorService.showSimpleSnackBar('Check your email for a link to confirm registration')
      }).catch(err => {
        this.loading = false
        this.errorService.showError(err)
      })
    } else if (this.authForm.controls['password'].value.length > 8) {
      this.errorService.showSimpleSnackBar('Password must be over ' + this.minimumPasswordCharacters + ' characters')
    }
  }

}
