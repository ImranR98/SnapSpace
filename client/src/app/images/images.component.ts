import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { Image } from 'models'
import { ApiService } from '../services/api.service'
import { ErrorService } from '../services/error.service'
import { MediaChange, MediaObserver } from '@angular/flex-layout'
import { FormArray, FormControl, FormGroup } from '@angular/forms'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnInit, OnDestroy {

  thumbnails: Image[] = []

  loading: boolean = false
  changing: boolean = false

  @Input() imageIds: string[] | null = null
  @Input() limited: boolean = true

  checkboxesForm: FormGroup = new FormGroup({
    checkboxes: new FormArray([])
  })

  columnNum = 3

  selection: boolean[] = []

  subscriptions: Subscription[] = []

  constructor(private apiService: ApiService, private errorService: ErrorService, media: MediaObserver) {
    this.subscriptions.push(media.asObservable().subscribe((change: MediaChange[]) => {
      if (change[0].mqAlias == 'xs') {
        this.columnNum = 2
      } else if (change[0].mqAlias == 'sm') {
        this.columnNum = 3
      } else if (change[0].mqAlias == 'md') {
        this.columnNum = 4
      } else if (change[0].mqAlias == 'lg') {
        this.columnNum = 6
      } else if (change[0].mqAlias == 'xl') {
        this.columnNum = 7
      } else {
        this.columnNum = 8
      }
    }))
  }

  ngOnInit(): void {
    this.loadImages()
    this.subscriptions.push(this.checkboxesForm.valueChanges.subscribe(val => {
      this.selection = val?.checkboxes
    }))
  }

  get numSelected() {
    return this.selection.filter(sel => sel == true).length
  }

  check(e: Event) {
    e.stopPropagation()
  }

  loadImages() {
    this.loading = true
    this.apiService.images(this.imageIds, this.limited).then((thumbnails) => {
      this.loading = false
      this.thumbnails = <Image[]>thumbnails
      let checkboxes = this.checkboxesForm.get('checkboxes') as FormArray
      checkboxes.clear()
      this.thumbnails.forEach(thumbnail => {
        checkboxes.push(new FormControl(false))
      })
    }).catch(err => {
      this.loading = false
      this.errorService.showError(err)
      this.thumbnails = []
      let checkboxes = this.checkboxesForm.get('checkboxes') as FormArray
      checkboxes.clear()
    })
  }

  deleteSelected() {
    let imagesToDelete: string[] = []
    for (let i = 0; i < this.selection.length; i++) {
      if (this.selection[i] == true) if (this.thumbnails[i]?._id) imagesToDelete.push(<string>this.thumbnails[i]._id)
    }
    if (confirm(`Delete these ${imagesToDelete.length} images?`)) {
      this.changing = true
      this.apiService.deleteFunc(imagesToDelete).then(() => {
        this.changing = false
        this.errorService.showSimpleSnackBar('Deleted')
        this.loadImages()
      }).catch(err => {
        this.changing = false
        this.errorService.showError(err)
      })
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

}
