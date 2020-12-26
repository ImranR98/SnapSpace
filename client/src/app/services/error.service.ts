import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { instanceOfAppError, AppErrorCodes } from 'models'
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private snackBar: MatSnackBar, private apiService: ApiService) { }

  subscriptions: Subscription[] = []

  showSimpleSnackBar(message: string) {
    this.snackBar.dismiss()
    this.snackBar.open(message, 'Okay', {
      duration: 5000
    })
  }

  getAppErrorMessage(appErrorCode: AppErrorCodes) {
    switch (appErrorCode) {
      case AppErrorCodes.SERVER_ERROR:
        return 'Internal server error'
        break;
      case AppErrorCodes.MISSING_ARGUMENT:
        return 'Missing argument'
        break;
      case AppErrorCodes.INVALID_ARGUMENT:
        return 'Invalid argument'
        break;
      case AppErrorCodes.INVALID_USER:
        return 'User data not valid'
        break;
      case AppErrorCodes.EMAIL_IN_USE:
        return 'The email is already in use'
        break;
      case AppErrorCodes.NO_FILES_UPLOADED:
        return 'No files uploaded'
        break;
      case AppErrorCodes.INVALID_IMAGE:
        return 'Invalid image'
        break;
      case AppErrorCodes.EMAIL_UNVERIFIED:
        return 'Invalid not verified'
        break;
      case AppErrorCodes.WRONG_PASSWORD:
        return 'Wrong password'
        break;
      case AppErrorCodes.USER_NOT_FOUND:
        return 'User not found'
        break;
      case AppErrorCodes.ALREADY_REGISTERED:
        return 'Already registered'
        break;
      case AppErrorCodes.INVALID_REGISTRATION_KEY:
        return 'Invalid registration key'
        break;
      default:
        return 'Unknown application error'
        break;
    }
  }

  standardizeError(error: any, actionable: boolean = false) {
    let standardError: { message: string, actionable: boolean, fixedCallback: any } = { message: 'Unknown Error', actionable: actionable, fixedCallback: null }

    if (error instanceof HttpErrorResponse) {
      if (error.status == 404) {
        standardError.message = error.statusText
      } else if (instanceOfAppError(error.error)) {
        standardError.message = this.getAppErrorMessage(error.error.code)
      } else if (error.status == 200) {
        // GET requests to a non-existent route may result in the hosted app HTML itself being returned with a 200 status
        // It would result in an error since it's not valid JSON
        standardError.message = '404 - Not Found'
      } else {
        standardError.message = error.statusText
      }
    }

    if (typeof error == 'string') {
      standardError.message = error
    }

    return standardError
  }

  showError(originalError: any, callback: Function | null = null, duration: number = 5000) {
    console.log(originalError)
    let error = this.standardizeError(originalError, (!!callback))
    this.snackBar.dismiss()
    let actionText = 'Okay'
    if (callback) {
      actionText = 'Retry'
    }
    if (duration) {
      this.subscriptions.push(this.snackBar.open(error.message, actionText, { duration: duration }).onAction().subscribe(() => {
        if (callback) {
          callback()
        }
      }))
    } else {
      this.subscriptions.push(this.snackBar.open(error.message, actionText).onAction().subscribe(() => {
        if (callback) {
          callback()
        }
      }))
    }
    if (error.fixedCallback) {
      error.fixedCallback()
    }
  }

  clearError() {
    this.snackBar.dismiss()
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }
}
