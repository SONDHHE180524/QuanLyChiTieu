import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-cute_mint flex items-center justify-center p-6 font-sans">
      <div class="max-w-md w-full bg-white rounded-5xl shadow-2xl shadow-teal-200/50 border-8 border-white overflow-hidden transform hover:scale-[1.01] transition-transform duration-500">
        <!-- Header -->
        <div class="bg-cute_pink p-10 text-white text-center relative overflow-hidden">
          <div class="relative z-10">
            <div class="bg-white/30 p-4 rounded-3xl w-fit mx-auto mb-6 backdrop-blur-md border border-white/20 rotate-6 shadow-lg">
              <lucide-icon name="user-plus" [size]="40" class="fill-current"></lucide-icon>
            </div>
            <h2 class="text-3xl font-black tracking-tighter mb-2">Đăng ký thành viên!</h2>
            <p class="text-white/80 font-bold text-sm uppercase tracking-widest leading-none">Bắt đầu hành trình tiết kiệm nha</p>
          </div>
          
          <!-- Decorative Elements -->
          <div class="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div class="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-300/20 rounded-full blur-xl"></div>
        </div>

        <!-- Form -->
        <div class="p-10">
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1 px-1">Tên của bạn nè</label>
              <div class="relative group">
                <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-cute_pink transition-colors">
                  <lucide-icon name="user" [size]="18"></lucide-icon>
                </span>
                <input 
                  type="text" 
                  formControlName="fullName"
                  class="w-full pl-10 pr-4 py-3 bg-slate-50 border-4 border-slate-100 rounded-3xl focus:border-cute_pink outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner"
                  placeholder="Nguyễn Văn A"
                >
              </div>
              <div *ngIf="f['fullName'].touched && f['fullName'].errors" class="text-[10px] font-black text-danger mt-1 px-2 uppercase tracking-tighter">
                <span *ngIf="f['fullName'].errors['required']">Tên bạn là gì nhỉ?</span>
              </div>
            </div>

            <div>
              <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1 px-1">Địa chỉ Email</label>
              <div class="relative group">
                <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-cute_pink transition-colors">
                  <lucide-icon name="mail" [size]="18"></lucide-icon>
                </span>
                <input 
                  type="email" 
                  formControlName="email"
                  class="w-full pl-10 pr-4 py-3 bg-slate-50 border-4 border-slate-100 rounded-3xl focus:border-cute_pink outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner"
                  placeholder="name@example.com"
                >
              </div>
              <div *ngIf="f['email'].touched && f['email'].errors" class="text-[10px] font-black text-danger mt-1 px-2 uppercase tracking-tighter">
                <span *ngIf="f['email'].errors['required']">Cần email để liên lạc nè!</span>
                <span *ngIf="f['email'].errors['email']">Email chưa đúng rùi ạ!</span>
              </div>
            </div>

            <div>
              <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1 px-1">Mật khẩu mới</label>
              <div class="relative group">
                <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-cute_pink transition-colors">
                  <lucide-icon name="lock" [size]="18"></lucide-icon>
                </span>
                <input 
                  [type]="showPassword ? 'text' : 'password'" 
                  formControlName="password"
                  class="w-full pl-10 pr-12 py-3 bg-slate-50 border-4 border-slate-100 rounded-3xl focus:border-cute_pink outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner"
                  placeholder="••••••••"
                >
                <button 
                  type="button"
                  (click)="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-cute_pink transition-colors"
                >
                  <lucide-icon [name]="showPassword ? 'eye-off' : 'eye'" [size]="18"></lucide-icon>
                </button>
              </div>
              <div *ngIf="f['password'].touched && f['password'].errors" class="text-[10px] font-black text-danger mt-1 px-2 uppercase tracking-tighter">
                <span *ngIf="f['password'].errors['required']">Nhập mật khẩu nha!</span>
                <span *ngIf="f['password'].errors['minlength']">Mật khẩu ít nhất 6 ký tự nè!</span>
              </div>
            </div>

            <div>
              <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1 px-1">Xác nhận mật khẩu</label>
              <div class="relative group">
                <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-cute_pink transition-colors">
                  <lucide-icon name="lock-keyhole" [size]="18"></lucide-icon>
                </span>
                <input 
                  type="password" 
                  formControlName="confirmPassword"
                  class="w-full pl-10 pr-4 py-3 bg-slate-50 border-4 border-slate-100 rounded-3xl focus:border-cute_pink outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner"
                  placeholder="••••••••"
                >
              </div>
              <div *ngIf="f['confirmPassword'].touched && f['confirmPassword'].errors" class="text-[10px] font-black text-danger mt-1 px-2 uppercase tracking-tighter">
                <span *ngIf="f['confirmPassword'].errors['required']">Đừng quên dòng này!</span>
                <span *ngIf="f['confirmPassword'].errors['mustMatch']">Mật khẩu không giống nhau rùi...</span>
              </div>
            </div>

            <button 
              type="submit" 
              [disabled]="registerForm.invalid || loading"
              class="w-full bg-cute_pink hover:bg-pink-500 text-white font-black py-4 rounded-3xl transition-all transform hover:scale-[1.03] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-pink-100 mt-6 text-lg tracking-tight"
            >
              <span *ngIf="!loading">Đăng ký ngay ạ ✨</span>
              <span *ngIf="loading" class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang chuẩn bị...
              </span>
            </button>

            <div *ngIf="error" class="bg-danger/10 text-danger text-[11px] font-bold p-4 rounded-2xl border-2 border-danger/20 text-center animate-shake mt-4">
              {{ error }}
            </div>
            
            <div *ngIf="success" class="bg-secondary/10 text-secondary text-[11px] font-bold p-4 rounded-2xl border-2 border-secondary/20 text-center mt-4">
              Đăng ký thành công rùi nha! Đang chuyển hướng... ✨
            </div>
          </form>

          <div class="mt-8 pt-6 border-t-2 border-slate-50 text-center">
            <p class="text-sm font-bold text-slate-400">
              Có tài khoản rùi? 
              <a routerLink="/login" class="font-black text-cute_purple hover:underline ml-1">Đăng nhập ạ!</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-shake {
      animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
    @keyframes shake {
      10%, 90% { transform: translate3d(-1px, 0, 0); }
      20%, 80% { transform: translate3d(2px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
      40%, 60% { transform: translate3d(4px, 0, 0); }
    }
    :host {
      display: block;
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  loading = false;
  error = '';
  success = false;
  showPassword = false;

  constructor() {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.mustMatch('password', 'confirmPassword')
    });
  }

  get f() { return this.registerForm.controls; }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.error = '';

    const { fullName, email, password } = this.registerForm.value;
    
    this.authService.register(fullName, email, password).subscribe({
      next: () => {
        this.success = true;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: err => {
        this.error = 'Có chút lỗi khi đăng ký, bạn thử lại sau nha!';
        this.loading = false;
      }
    });
  }
}
