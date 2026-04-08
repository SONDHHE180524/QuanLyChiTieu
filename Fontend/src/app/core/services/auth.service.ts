import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/NguoiDung/dangnhap`, { email, password })
      .pipe(map(user => {
        // Store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  register(fullName: string, email: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/NguoiDung/dangky`, { fullName, email, password });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/NguoiDung/forgot-password`, { email });
  }

  resetPassword(email: string, otpCode: string, newPassword: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/NguoiDung/reset-password`, { email, otpCode, newPassword });
  }

  logout() {
    // Remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  getUserProfile(userId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/NguoiDung/profile/${userId}`);
  }

  updateProfile(userId: number, fullName: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/NguoiDung/profile/${userId}`, { fullName })
      .pipe(map(response => {
        // Cập nhật lại thông tin trong local storage nếu đổi tên thành công
        const user = this.currentUserValue;
        if (user) {
          user.fullName = fullName;
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return response;
      }));
  }

  uploadAvatar(userId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${environment.apiUrl}/NguoiDung/upload-avatar/${userId}`, formData)
      .pipe(map((response: any) => {
        const user = this.currentUserValue;
        if (user && response.avatarUrl) {
          user.avatarUrl = response.avatarUrl;
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return response;
      }));
  }
}
