import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { CoursesService } from '../services/courses.service';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule
  ],
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.css',
})

export class MyCoursesComponent implements OnInit {

  courseStudent: { estudianteNombre: string; estudianteApellido: string }[] = [];
  studentsByCourseId: { [key: number]: { estudianteNombre: string; estudianteApellido: string }[] } = {};
  userCourses: any[] = [];

  constructor(private _courses: CoursesService) { }

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this._courses.getCoursesOfStudent(userId).subscribe({
        next: (courses: any) => {
          this.userCourses = courses.$values || courses;
        },
        error: (err) => {
          console.error('Error al cargar las materias del usuario:', err);
        },
      });
    } else {
      console.error('Cédula no encontrada. El usuario debe iniciar sesión.');
    }
  }

  getStudents(materiaId: number): void {
    if (this.studentsByCourseId[materiaId]) return; // No volver a pedir si ya está

    this._courses.getStudentsForCourse(materiaId).subscribe({
      next: (response: any) => {
        const values = response?.$values ?? response;

        this.studentsByCourseId[materiaId] = values.map((s: any) => ({
          estudianteNombre: s.estudianteNombre,
          estudianteApellido: s.estudianteApellido
        }));
      },
      error: (err) => {
        console.error('Error al obtener estudiantes de la materia:', err);
      },
    });

  }


}
