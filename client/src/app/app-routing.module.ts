import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ImageComponent } from './image/image.component';
import { LoginComponent } from './login/login.component';
import { MyImagesComponent } from './my-images/my-images.component';
import { PublicImagesComponent } from './public-images/public-images.component';
import { RegisterComponent } from './register/register.component';
import { AuthService } from './services/auth.service';
import { SharedWithMeImagesComponent } from './shared-with-me-images/shared-with-me-images.component';
import { UploadComponent } from './upload/upload.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'upload',
    component: UploadComponent,
    canActivate: [AuthService]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthService]
  },
  {
    path: 'images/mine',
    component: MyImagesComponent,
    canActivate: [AuthService]
  },
  {
    path: 'images/public',
    component: PublicImagesComponent,
    canActivate: [AuthService]
  },
  {
    path: 'images/sharedWithMe',
    component: SharedWithMeImagesComponent,
    canActivate: [AuthService]
  },
  {
    path: 'images/:id',
    component: ImageComponent,
    canActivate: [AuthService]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
