import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from '../models/subject';
import { Observable } from 'rxjs';

interface EnrollRequest {
  documentNumber: string;
  subjects: number[];
}

@Injectable({
  providedIn: 'root'
})

export class CoursesService {
  private apiUrl = '/api/subjects';

  constructor(private http: HttpClient) { }

  getAllSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.apiUrl}`);
  }

  hasRegisteredCourses(document: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/HasRegisteredCourses/${document}`);
  }

  getCoursesOfStudent(doc: string): Observable<{ MateriaId: number; ProfesorId: number }[]> {
    return this.http.get<{ MateriaId: number; ProfesorId: number }[]>(`${this.apiUrl}/CoursesofStudents/${doc}`);
  }

  registerCourses(documentNumber: string, subjects: number[]) {
    const payload = { documentNumber, subjects };
    return this.http.post('/api/subjects/RegisterCourses', payload);
  }

  getStudentsForCourse(MateriaId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/StudentforCourses/${MateriaId}`);
  }

  getSubjectsByStudent(documentNumber: string): Observable<Subject[]> {
    return this.http.get<Subject[]>(`/api/subjects/GetSubjectsForStudent/${documentNumber}`);
  }

  deleteSubjectFromStudent(documentNumber: string, subjectId: number) {
    return this.http.delete(`/api/subjects/DeleteSubject/${documentNumber}/${subjectId}`);
  }

}


