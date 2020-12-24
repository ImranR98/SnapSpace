import { Route } from '@angular/compiler/src/core';
import { Component, Input, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { ActivatedRoute, Router } from '@angular/router';
import { Image } from 'models';
import { ApiService } from '../services/api.service';
import { ErrorService } from '../services/error.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {

  @Input() id: string = ''

  maxWidth = 600

  constructor(private apiService: ApiService, private errorService: ErrorService, private router: Router, private route: ActivatedRoute, media: MediaObserver) {
    media.asObservable().subscribe((change: MediaChange[]) => {
      if (change[0].mqAlias == 'xs') {
        console.log('xs')
        this.maxWidth = 600
      } else if (change[0].mqAlias == 'sm') {
        console.log('sm')
        this.maxWidth = 500
      } else if (change[0].mqAlias == 'md') {
        console.log('md')
        this.maxWidth = 850
      } else if (change[0].mqAlias == 'lg') {
        console.log('lg')
        this.maxWidth = 1150
      } else if (change[0].mqAlias == 'xl') {
        console.log('xl')
        this.maxWidth = 1800
      } else {
        this.maxWidth = 2000
      }
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (!params.id) this.router.navigate(['/home'])
      this.id = params.id
    })
    this.loadImages()
  }

  loading: boolean = false

  image: Image | null = null

  loadImages() {
    this.loading = true
    this.apiService.images([this.id]).then((image: any) => {
      this.loading = false
      this.image = image[0]
    }).catch(err => {
      this.loading = false
      this.errorService.showError(err)
      this.router.navigate(['/home'])
    })
  }

}
