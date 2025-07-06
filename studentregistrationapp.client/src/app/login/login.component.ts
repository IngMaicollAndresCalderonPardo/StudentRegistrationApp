import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm = new FormGroup({
    documentNumber: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  hidePassword = true;
  errorMessage = '';
  isLoading = false;

  constructor(private auth: AuthService, private router: Router) { }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // Fuerza a mostrar errores en el HTML
      return;
    }

    this.isLoading = true;
    const { documentNumber, password } = this.loginForm.value;

    this.auth.login(documentNumber!, password!).subscribe({
      next: () => {
        this.isLoading = false;
        console.log('AuthService.currentUserDocument =', this.auth.currentUserDocument);
        localStorage.setItem('userId', documentNumber!);
        this.router.navigate(['/home']);
      },
      error: err => {
        this.isLoading = false;
        this.errorMessage = err.error || 'Datos incorrectos';
      }
    });
  }


  onRegister() {
    this.router.navigate(['/register']);
  }
}
