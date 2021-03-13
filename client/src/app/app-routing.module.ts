import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfirmRegistrationComponent } from './confirm-registration/confirm-registration.component';
import { HomeComponent } from './home/home.component';
import { ImageComponent } from './image/image.component';
import { MyImagesComponent } from './my-images/my-images.component';
import { PublicImagesComponent } from './public-images/public-images.component';
import { AuthService } from './services/auth.service';
import { SharedWithMeImagesComponent } from './shared-with-me-images/shared-with-me-images.component';
import { UploadComponent } from './upload/upload.component';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
    data: { animation: 'welcome' }
  },
  {
    path: 'confirmRegistration',
    component: ConfirmRegistrationComponent,
    data: { animation: 'confirmRegistration' }
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthService],
    data: { animation: 'home' }
  },
  {
    path: 'upload',
    component: UploadComponent,
    canActivate: [AuthService],
    data: { animation: 'upload' }
  },
  {
    path: 'images/mine',
    component: MyImagesComponent,
    canActivate: [AuthService],
    data: { animation: 'images/mine' }
  },
  {
    path: 'images/public',
    component: PublicImagesComponent,
    data: { animation: 'images/public' }
  },
  {
    path: 'images/sharedWithMe',
    component: SharedWithMeImagesComponent,
    canActivate: [AuthService],
    data: { animation: 'images/sharedWithMe' }
  },
  {
    path: 'images/:id',
    component: ImageComponent,
    data: { animation: 'images/:id' }
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
