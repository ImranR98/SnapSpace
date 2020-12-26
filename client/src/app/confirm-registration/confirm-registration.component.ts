import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { config, Subscription } from 'rxjs';
import { ApiService } from '../services/api.service';
import { ErrorService } from '../services/error.service';

@Component({
  selector: 'app-confirm-registration',
  templateUrl: './confirm-registration.component.html',
  styleUrls: ['./confirm-registration.component.scss']
})
export class ConfirmRegistrationComponent implements OnInit {

  subscriptions: Subscription[] = []

  constructor(private apiService: ApiService, private errorService: ErrorService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscriptions.push(this.route.queryParams.subscribe(params => {
      if (!params.registrationKey) this.router.navigate(['/login'])
      this.apiService.confirmRegistration(params.registrationKey).then(() => {
        this.errorService.showSimpleSnackBar('Welcome! You can now login')
        this.router.navigate(['/login'])
      }).catch(err => {
        this.errorService.showError(err)
        this.router.navigate(['/login'])
      })
    }))
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

}
