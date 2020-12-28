import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { MatIconRegistry } from '@angular/material/icon'
import { DomSanitizer } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { fader } from './route-animations'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fader]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'SnapSpace';

  subscriptions: Subscription[] = []

  constructor(private authService: AuthService, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) { }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  ngOnInit() {
    this.authService.isValidToken(true)
    this.matIconRegistry.addSvgIcon(
      "cancel",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/cancel.svg")
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }
}
