import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'SnapSpace-Client';
  
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.isValidToken(true)
    this.authService.isLoggedIn.subscribe(isLoggedIn => {
      if (!isLoggedIn) this.router.navigate(['/login'])
    })
  }
}
