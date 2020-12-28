import { BrowserModule } from '@angular/platform-browser';
import { Injector, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { AuthInterceptor } from './HttpInterceptor';
import { HomeComponent } from './home/home.component';
import { FlexLayoutModule } from '@angular/flex-layout'
import { ReactiveFormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatButtonModule } from '@angular/material/button'
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { UploadComponent } from './upload/upload.component';
import { HeaderBarComponent } from './header-bar/header-bar.component';
import { ImagesComponent } from './images/images.component'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ImageComponent } from './image/image.component';
import { MyImagesComponent } from './my-images/my-images.component';
import { SharedWithMeImagesComponent } from './shared-with-me-images/shared-with-me-images.component';
import { PublicImagesComponent } from './public-images/public-images.component';
import { ConfirmRegistrationComponent } from './confirm-registration/confirm-registration.component'
import { MatTabsModule } from '@angular/material/tabs'
import { MatChipsModule } from '@angular/material/chips'
import { MatIconModule } from '@angular/material/icon';
import { WelcomeComponent } from './welcome/welcome.component'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UploadComponent,
    HeaderBarComponent,
    ImagesComponent,
    ImageComponent,
    MyImagesComponent,
    SharedWithMeImagesComponent,
    PublicImagesComponent,
    ConfirmRegistrationComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDividerModule,
    MatGridListModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatTabsModule,
    MatChipsModule,
    MatIconModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
    deps: [Injector]
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
