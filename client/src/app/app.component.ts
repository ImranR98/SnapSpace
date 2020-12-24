import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'SnapSpace';

  subscriptions: Subscription[] = []

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.isValidToken(true)
    this.subscriptions.push(this.authService.isLoggedIn.subscribe(isLoggedIn => {
      if (!isLoggedIn) this.router.navigate(['/login'])
    }))
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }
}
