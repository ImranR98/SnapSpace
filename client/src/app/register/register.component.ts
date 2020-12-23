import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { ErrorService } from '../services/error.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private authService: AuthService, private apiService: ApiService, private router: Router, private errorService: ErrorService) { }

  loading: boolean = false

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe(isLoggedIn => {
      if (isLoggedIn) this.router.navigate(['/home'])
    })
  }

  register() {
    if (this.registerForm.valid) {
      this.loading = true
      this.apiService.register(this.registerForm.controls['email'].value, this.registerForm.controls['password'].value).then(() => {
        this.loading = false
        this.router.navigate(['/home'])
      }).catch(err => {
        this.loading = false
        this.errorService.showError(err)
      })
    }
  }

}
