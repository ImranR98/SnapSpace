import { Route } from '@angular/compiler/src/core';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { ActivatedRoute, Router } from '@angular/router';
import { Image } from 'models';
import { Subscription } from 'rxjs';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { ErrorService } from '../services/error.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit, OnDestroy {

  @Input() id: string = ''

  maxWidth = 600

  subscriptions: Subscription[] = []

  constructor(private apiService: ApiService, private errorService: ErrorService, private router: Router, private route: ActivatedRoute, media: MediaObserver, private authService: AuthService) {
    this.subscriptions.push(media.asObservable().subscribe((change: MediaChange[]) => {
      if (change[0].mqAlias == 'xs') {
        this.maxWidth = 600
      } else if (change[0].mqAlias == 'sm') {
        this.maxWidth = 500
      } else if (change[0].mqAlias == 'md') {
        this.maxWidth = 850
      } else if (change[0].mqAlias == 'lg') {
        this.maxWidth = 1150
      } else if (change[0].mqAlias == 'xl') {
        this.maxWidth = 1800
      } else {
        this.maxWidth = 2000
      }
    }))
  }

  ngOnInit(): void {
    this.subscriptions.push(this.route.params.subscribe(params => {
      if (!params.id) this.router.navigate(['/home'])
      this.id = params.id
    }))
    this.loadImage()
  }

  loading: boolean = false

  image: Image | null = null

  owner: string = ''

  loadImage() {
    this.loading = true
    this.apiService.images([this.id]).then((image: any) => {
      this.loading = false
      this.image = image[0]
      if (this.image?.owner == this.authService.getUserId()) {
        this.owner = 'You'
      } else {
        this.apiService.email(this.authService.getUserId()).then(email => {
          this.owner = email.email
        }).catch(err => {
          console.log(err)
        })
      }
    }).catch(err => {
      this.loading = false
      this.errorService.showError(err)
      this.router.navigate(['/home'])
    })
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

}
