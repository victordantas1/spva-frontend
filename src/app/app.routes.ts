import { Routes } from '@angular/router';
import {JobListComponent} from '../job-list/job-list.component';
import {LoginComponent} from '../login/login.component';
import {RegisterComponent} from '../register/register.component';
import {JobDetailComponent} from '../job-detail/job-detail.component';
import {ProfileComponent} from '../profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'jobs', component: JobListComponent },
  { path: 'register', component: RegisterComponent },
  {path: 'profile/:id', component: ProfileComponent },
  {path: 'job-details/:id', component: JobDetailComponent },
  { path: '**', redirectTo: 'login' } // rota coringa
];

