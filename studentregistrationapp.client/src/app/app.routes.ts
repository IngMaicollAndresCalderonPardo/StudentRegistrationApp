import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent) },
  { path: 'students', loadComponent: () => import('./student-list/student-list.component').then(m => m.StudentListComponent) },
  { path: 'students/new', loadComponent: () => import('./student-form/student-form.component').then(m => m.StudentFormComponent) },
  { path: 'enrollment', loadComponent: () => import('./enrollment/enrollment.component').then(m => m.EnrollmentComponent) },
  { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
  { path: 'mycourses', loadComponent: () => import('./my-courses/my-courses.component').then(m => m.MyCoursesComponent) },
  { path: 'profile', loadComponent: () => import('./update-profile/update-profile.component').then(m => m.UpdateProfileComponent) },

  { path: '**', redirectTo: 'login' },
];
