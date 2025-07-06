import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  standalone: true,
  imports: [ReactiveFormsModule],

})
export class StudentFormComponent {
  studentForm = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  constructor(
    private svc: StudentService,
    private router: Router
  ) { }

  onSubmit() {
    if (this.studentForm.invalid) return;
    this.svc.create(this.studentForm.value.name!)
      .subscribe({
        next: () => this.router.navigate(['/students']),
        error: () => alert('Error al crear estudiante')
      });
  }
}
