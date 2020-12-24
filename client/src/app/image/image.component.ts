import { Route } from '@angular/compiler/src/core';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { FormControl, FormGroup } from '@angular/forms';
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

  sharingForm: FormGroup = new FormGroup({
    public: new FormControl(''),
    people: new FormControl('')
  })

  constructor(private apiService: ApiService, private errorService: ErrorService, private router: Router, private route: ActivatedRoute, media: MediaObserver, private authService: AuthService) {
    this.subscriptions.push(media.asObservable().subscribe((change: MediaChange[]) => {
      if (change[0].mqAlias == 'xs') {
        this.maxWidth = 600
      } else if (change[0].mqAlias == 'sm') {
        this.maxWidth = 380
      } else if (change[0].mqAlias == 'md') {
        this.maxWidth = 740
      } else if (change[0].mqAlias == 'lg') {
        this.maxWidth = 1060
      } else if (change[0].mqAlias == 'xl') {
        this.maxWidth = 1720
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
  changing: boolean = false

  image: Image | null = null

  owner: string = ''
  isOwner: boolean = false

  loadImage() {
    this.loading = true
    this.apiService.images([this.id]).then((image: Image[]) => {
      this.loading = false
      this.image = image[0]
      this.isOwner = (this.image?.owner == this.authService.getUserId())
      this.apiService.email(this.image.owner).then(email => {
        this.owner = email.email
      }).catch(err => {
        console.log(err)
      })
      this.setSharing(this.image.others)
    }).catch(err => {
      this.loading = false
      this.errorService.showError(err)
      this.router.navigate(['/home'])
    })
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

  getEmails() {
    if ((<string>this.sharingForm.controls['people'].value).trim().length > 0) return (<string>this.sharingForm.controls['people'].value).split(',')
    else return []
  }

  setSharing(others: boolean | string[]) {
    if (Array.isArray(others)) {
      this.sharingForm.controls['people'].setValue(others.join(','))
      this.sharingForm.controls['public'].setValue(false)
    } else {
      this.sharingForm.controls['public'].setValue(others)
    }
  }

  emailsValid() {
    let emails = this.getEmails()
    let emailRegex = new RegExp('.*@.*\..*')
    for (let i = 0; i < emails.length; i++) {
      if (!emailRegex.test(emails[i])) return false
    }
    return true
  }

  updateSharing() {
    if (this.image?._id && this.sharingForm.valid && this.emailsValid() && !this.loading && !this.changing) {
      let others: boolean | string[]
      if (this.sharingForm.controls['public'].value) others = true
      else if (this.getEmails().length > 0) others = this.getEmails()
      else others = false
      this.changing = true
      this.apiService.updateSharing([this.image._id], others).then(() => {
        this.changing = false
        this.setSharing(others)
        this.errorService.showSimpleSnackBar('Sharing options updated')
      }).catch(err => {
        this.changing = false
        this.errorService.showError(err)
      })
    } else if (!this.emailsValid) {
      this.errorService.showSimpleSnackBar('One or more sharing emails are invalid')
    }
  }

}
