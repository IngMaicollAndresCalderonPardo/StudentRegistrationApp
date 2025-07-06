import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { StudentService } from '../services/student.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {
  form!: FormGroup;
  studentId: number = 0;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const id = this.authService.currentUserDocument || localStorage.getItem('studentId');
    if (!id) {
      alert('No hay sesión activa');
      this.authService.logout(); // o redirige a login
      return;
    }

    this.studentId = +id;

    this.studentService.getStudentById(this.studentId.toString()).subscribe({
      next: (student) => {
        if (!student) {
          alert('Estudiante no encontrado. Redirigiendo...');
          localStorage.clear();
          window.location.href = '/login';
          return;
        }

        this.form = this.fb.group({
          name: [student.name, Validators.required],
          lastname: [student.lastname, Validators.required],
          email: [student.email, [Validators.required, Validators.email]],
          cellphone: [student.cellphone, [Validators.required, Validators.pattern(/^\d{10}$/)]],
          address: [student.address, Validators.required]
        });
      },
      error: (err) => {
        alert('No se pudieron cargar los datos del perfil.');
        localStorage.clear();
        window.location.href = '/login';
      }
    });

  }

  onSubmit() {
    if (this.form.invalid) return;

    const student = {
      ...this.form.value,
      documentNumber: this.studentId.toString()
    };

    this.studentService.updateStudent(student.documentNumber, student)
      .subscribe({
        next: () => alert('Datos actualizados correctamente'),
        error: (err) => alert('Error al actualizar: ' + (err.error?.Message || err.message))
      });
  }

  onDelete() {
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.');
    if (!confirmDelete) return;

    this.studentService.deleteStudent(this.studentId.toString()).subscribe({
      next: () => {
        alert('Cuenta eliminada exitosamente');
        localStorage.clear();
        window.location.href = '/login';
      },
      error: (err) => alert('Error al eliminar la cuenta: ' + err.message)
    });
  }

}
