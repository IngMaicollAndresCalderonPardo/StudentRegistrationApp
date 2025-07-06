import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Student } from '../models/student';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _currentUserDocument?: string;
  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('userDocument'));

  loggedIn$ = this.loggedIn.asObservable();

  get currentUserDocument(): string | null {
    return this._currentUserDocument ?? localStorage.getItem('userDocument');
  }

  set currentUserDocument(value: string | null) {
    this._currentUserDocument = value ?? undefined;

    if (value) {
      localStorage.setItem('userDocument', value);
    } else {
      localStorage.removeItem('userDocument');
    }
  }

  private apiUrl = '/api/students';
  private authUrl = '/api/auth/Login';


  constructor(private http: HttpClient) { }

  register(student: Student): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student);
  }

  login(documentNumber: string, password: string): Observable<{ message: string; cedula: string }> {
    return this.http.post<{ message: string; cedula: string }>(
      this.authUrl, { username: documentNumber, password }

    ).pipe(
      tap(res => {
        console.log('Login response:', res);
        this.currentUserDocument = res.cedula;
        this.loggedIn.next(true);
      })
    );
  }

  logout() {
    localStorage.clear();
    this.loggedIn.next(false); // <-- 🔔 emitir logout
  }

}
