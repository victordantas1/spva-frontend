import { Routes } from '@angular/router';
import {JobListComponent} from './job-list/job-list.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {JobDetailComponent} from './job-detail/job-detail.component';
import {ProfileComponent} from './profile/profile.component';
import {authGuard} from '../auth.guard';
import { JobFormComponent } from './job-form/job-form.component';
import {adminGuard} from '../admin.guard';
import {JobApplicantsComponent} from './job-applicants/job-applicants.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'jobs', canActivate: [authGuard] ,component: JobListComponent },
  {
    path: 'admin/jobs/new',
    component: JobFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin/jobs/edit/:id',
    component: JobFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin/jobs/:id/candidates',
    component: JobApplicantsComponent,
    canActivate: [adminGuard]
  },
  { path: 'register', component: RegisterComponent },
  {path: 'profile/:id', canActivate: [authGuard], component: ProfileComponent },
  {path: 'job-details/:id', canActivate: [authGuard], component: JobDetailComponent },
  { path: '**', redirectTo: 'login' }
];

