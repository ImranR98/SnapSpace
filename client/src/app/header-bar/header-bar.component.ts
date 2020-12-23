import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent implements OnInit {

  @Input() title: string = 'SnapSpace'
  @Input() secondRouterLink: string = ''
  @Input() secondRouterLinkTitle: string = ''

  constructor(private authService: AuthService) { }

  isLoggedIn: boolean = false

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn)
  }

  logout() {
    this.authService.logout()
  }

}
