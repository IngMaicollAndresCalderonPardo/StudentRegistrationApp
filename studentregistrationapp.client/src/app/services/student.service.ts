import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Student } from '../models/student';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private apiUrl = '/api/students';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  create(name: string): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, { name });
  }

  updateStudent(documentNumber: string, student: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${documentNumber}`, student);
  }

  getStudentById(documentNumber: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${documentNumber}`);
  }

  deleteStudent(documentNumber: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${documentNumber}`);
  }
}
