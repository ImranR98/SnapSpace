import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent implements OnInit, OnDestroy {

  @Input() title: string = 'SnapSpace'
  @Input() secondRouterLink: string = ''
  @Input() secondRouterLinkTitle: string = ''

  constructor(private authService: AuthService, private router: Router) { }

  isLoggedIn: boolean = false

  subscriptions: Subscription[] = []

  ngOnInit(): void {
    this.subscriptions.push(this.authService.isLoggedIn.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn))
  }

  logout() {
    this.authService.logout()
    this.router.navigate(['/welcome'])
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

}
