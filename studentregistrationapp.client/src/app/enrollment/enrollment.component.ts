import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CoursesService } from '../services/courses.service';
import { AuthService } from '../services/auth.service';
import { Subject } from '../models/subject';

@Component({
  selector: 'app-enrollment',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatButtonModule, MatTableModule],
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.css'],
})
export class EnrollmentComponent implements OnInit {
  subjects: Subject[] = [];
  selection = new Set<number>();
  professorConflict = new Set<number>();
  userDocument = '';
  selectedCount = 0;
  alreadyRegistered = false;
  registeredSubjects: any[] = [];

  displayedColumns: string[] = ['materia', 'profesor', 'acciones'];

  constructor(private svc: CoursesService, private auth: AuthService) { }

  ngOnInit() {
    const doc = this.auth.currentUserDocument || localStorage.getItem('userDocument');
    if (!doc) {
      alert('Debe iniciar sesión para continuar');
      return;
    }

    this.userDocument = doc;

    // Cargar materias inscritas
    this.svc.getCoursesOfStudent(this.userDocument).subscribe({
      next: (materias) => {
        this.registeredSubjects = materias;

        // Si todavía puede inscribir más materias
        if (this.registeredSubjects.length < 3) {
          this.svc.getAllSubjects().subscribe((subs) => {
            this.subjects = subs;
          });
        }
      },
      error: (err) => {
        this.registeredSubjects = [];
        this.svc.getAllSubjects().subscribe((subs) => {
          this.subjects = subs;
        });
      }
    });
  }


  isSelected(s: Subject) {
    return this.selection.has(s.subjectId);
  }

  isDisabledSubject(s: Subject) {
    const allProfessorIds = this.getAllProfessorIds();

    return (
      !this.isSelected(s) &&
      (
        allProfessorIds.has(s.professorId) ||
        (this.registeredSubjects.length + this.selection.size >= 3)
      )
    );
  }


  toggleSelection(s: Subject) {
    if (this.isSelected(s)) {
      this.selection.delete(s.subjectId);
    } else {
      const allProfessorIds = this.getAllProfessorIds();

      if (this.selection.size + this.registeredSubjects.length >= 3) {
        alert('Solo puedes inscribir un máximo de 3 materias.');
        return;
      }

      if (allProfessorIds.has(s.professorId)) {
        alert('Ya tienes una materia registrada con este profesor.');
        return;
      }

      this.selection.add(s.subjectId);
    }

    this.selectedCount = this.selection.size;
  }


  onSubmit() {
    //if (this.selectedCount !== 3) {
    //  alert('Debes seleccionar exactamente 3 materias para inscribirte.');
    //  return;
    //}
    if (this.selectedCount === 0) {
      alert('Debes seleccionar al menos una materia para inscribirte.');
      return;
    }


    this.svc.registerCourses(this.userDocument, Array.from(this.selection)).subscribe({
      next: () => {
        alert('Materias inscritas exitosamente');
        window.location.reload(); // recarga para actualizar estado
      },
      error: (err) => {
        alert('Error al inscribir: ' + (err.error?.Message || err.message));
      },
    });
  }

  removeSubject(materiaId: number) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta materia?')) return;

    this.svc.deleteSubjectFromStudent(this.userDocument, materiaId).subscribe({
      next: () => {
        // 1. Eliminar la materia de la lista actual
        this.registeredSubjects = this.registeredSubjects.filter(
          (m) => m.materiaId !== materiaId
        );

        // 2. Si quedan menos de 3 materias, volver a mostrar formulario
        if (this.registeredSubjects.length < 3) {
          this.alreadyRegistered = false;

          // 3. Volver a traer materias disponibles
          this.svc.getAllSubjects().subscribe((subs) => {
            this.subjects = subs;

            // 4. limpiar selección previa
            this.selection.clear();
            this.professorConflict.clear();
            this.selectedCount = 0;
          });
        }
      },
      error: (err) => {
        console.error('Error al eliminar materia', err);
        alert('No se pudo eliminar la materia.');
      },
    });
  }

  getAllProfessorIds(): Set<number> {
    const profs = new Set<number>();

    // Profesores ya inscritos
    this.registeredSubjects.forEach(sub => profs.add(sub.profesorId));

    // Profesores de materias seleccionadas
    this.selection.forEach(subjectId => {
      const subject = this.subjects.find(s => s.subjectId === subjectId);
      if (subject) {
        profs.add(subject.professorId);
      }
    });

    return profs;
  }

}
