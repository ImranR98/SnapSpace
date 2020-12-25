import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ErrorService } from '../services/error.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  constructor(private apiService: ApiService, private errorService: ErrorService) { }

  loading: boolean = false

  files: FileList | null = null

  uploadForm = new FormGroup({
    files: new FormControl('', Validators.required)
  });

  ngOnInit(): void {
  }

  onChange(event: any) {
    this.files = event.target.files;
  }

  upload() {
    if (this.uploadForm.valid && !this.loading) {
      this.loading = true
      this.apiService.upload(this.files).then(() => {
        this.loading = false
        this.errorService.showSimpleSnackBar('Uploaded')
        this.uploadForm.reset()
      }).catch(err => {
        this.loading = false
        this.errorService.showError(err)
      })
    }
  }
}
