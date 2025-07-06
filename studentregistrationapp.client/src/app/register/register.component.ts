import { Component } from '@angular/core';
import {
  FormGroup, FormControl, Validators,
  AbstractControl, ValidationErrors,
  ReactiveFormsModule
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Student } from '../models/student';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
})
export class RegisterComponent {
  hidePassword = true;
  hideConfirmPassword = true;
  documentTypes = ['CC', 'TI', 'CE'];

  registerForm = new FormGroup(
    {
      firstName: new FormControl('', [Validators.required,Validators.pattern(/^[A-Za-zÀ-ÿ\s]+$/)]),
      lastName: new FormControl('', [Validators.required,Validators.pattern(/^[A-Za-zÀ-ÿ\s]+$/)]),
      documentType: new FormControl('', Validators.required),
      documentNumber: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(16),
        Validators.pattern(/^[A-Z].*\d.*\d/)
      ]),
      confirmPassword: new FormControl('', Validators.required),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
      address: new FormControl('', Validators.required),
      birthDate: new FormGroup({
        startDate: new FormControl('', Validators.required)
      })
    },
    { validators: RegisterComponent.passwordsMatchValidator }
  );

  constructor(private auth: AuthService, private router: Router, private snackBar: MatSnackBar) { }

  static passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const passwordControl = group.get('password');
    const confirmPasswordControl = group.get('confirmPassword');

    if (!passwordControl || !confirmPasswordControl) return null;

    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;

    if (password !== confirmPassword) {
      confirmPasswordControl.setErrors({ passwordsMismatch: true });
      return { passwordsMismatch: true };
    } else {
      // Si no hay más errores aparte de passwordsMismatch, se limpian
      if (confirmPasswordControl.hasError('passwordsMismatch')) {
        const errors = { ...confirmPasswordControl.errors };
        delete errors['passwordsMismatch'];
        confirmPasswordControl.setErrors(Object.keys(errors).length ? errors : null);
      }
      return null;
    }
  }

  get passwordsDoNotMatch(): boolean {
    return this.registerForm.hasError('passwordsMismatch') &&
      this.registerForm.get('confirmPassword')?.touched!;
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const f = this.registerForm.value as any;
    const student: Student = {
      name: f.firstName,
      lastname: f.lastName,
      documentType: f.documentType,
      documentNumber: f.documentNumber,
      email: f.email,
      password: f.password,
      cellphone: f.phone,
      address: f.address,
      birthdate: f.birthDate.startDate
    };

    this.auth.register(student).subscribe({
      next: () => {
        this.snackBar.open('Usuario creado exitosamente.', 'Cerrar', { duration: 4000 });
        this.router.navigate(['/login']);
      },
      error: err => alert('Error al registrar estudiante: ' + (err.error?.Message || err.message))
    });
  }

  onCancel() {
    this.router.navigate(['/login']);
  }
}
