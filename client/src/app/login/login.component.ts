import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ErrorService } from '../services/error.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService, private router: Router, private errorService: ErrorService) { }

  loading: boolean = false

  subscriptions: Subscription[] = []

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.subscriptions.push(this.authService.isLoggedIn.subscribe(isLoggedIn => {
      if (isLoggedIn) this.router.navigate(['/home'])
    }))
  }

  login() {
    if (this.loginForm.valid) {
      this.loading = true
      this.authService.login(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value).then(() => {
        this.loading = false
        this.router.navigate(['/home'])
      }).catch(err => {
        this.loading = false
        this.errorService.showError(err)
      })
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }
}
