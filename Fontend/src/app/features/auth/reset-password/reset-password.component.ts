import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-cute_mint flex items-center justify-center p-6 font-sans">
      <div class="max-w-md w-full bg-white rounded-5xl shadow-2xl shadow-teal-200/50 border-8 border-white overflow-hidden">
        <!-- Header -->
        <div class="bg-secondary p-10 text-white text-center relative overflow-hidden">
          <div class="relative z-10">
            <div class="bg-white/30 p-4 rounded-3xl w-fit mx-auto mb-6 backdrop-blur-md border border-white/20 rotate-6 shadow-lg">
              <lucide-icon name="shield-check" [size]="40" class="fill-current"></lucide-icon>
            </div>
            <h2 class="text-3xl font-black tracking-tighter mb-2">Đặt lại mật khẩu</h2>
            <p class="text-white/80 font-bold text-sm uppercase tracking-widest leading-none">Chỉ một bước nữa thôi!</p>
          </div>
          <div class="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        <!-- Form -->
        <div class="p-10">
          <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1 px-1">Mã xác thực OTP</label>
              <div class="relative group">
                <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-secondary transition-colors">
                  <lucide-icon name="fingerprint" [size]="20"></lucide-icon>
                </span>
                <input 
                  type="text" 
                  formControlName="otpCode"
                  class="w-full pl-12 pr-4 py-3 bg-slate-50 border-4 border-slate-100 rounded-3xl focus:border-secondary outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner tracking-[0.3em]"
                  placeholder="000000"
                  maxlength="6"
                >
              </div>
              <div *ngIf="f['otpCode'].touched && f['otpCode'].errors" class="text-[10px] font-black text-danger mt-1 px-2 uppercase tracking-tighter">
                <span *ngIf="f['otpCode'].errors['required']">Mã OTP ở đâu rùi nhỉ?</span>
                <span *ngIf="f['otpCode'].errors['pattern']">Mã phải có đủ 6 chữ số nha!</span>
              </div>
            </div>

            <div>
              <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1 px-1">Mật khẩu mới</label>
              <div class="relative group">
                <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-secondary transition-colors">
                  <lucide-icon name="key" [size]="20"></lucide-icon>
                </span>
                <input 
                  [type]="showPassword ? 'text' : 'password'" 
                  formControlName="newPassword"
                  class="w-full pl-12 pr-12 py-3 bg-slate-50 border-4 border-slate-100 rounded-3xl focus:border-secondary outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner"
                  placeholder="••••••••"
                >
                <button 
                  type="button"
                  (click)="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-secondary transition-colors"
                >
                  <lucide-icon [name]="showPassword ? 'eye-off' : 'eye'" [size]="20"></lucide-icon>
                </button>
              </div>
              <div *ngIf="f['newPassword'].touched && f['newPassword'].errors" class="text-[10px] font-black text-danger mt-1 px-2 uppercase tracking-tighter">
                <span *ngIf="f['newPassword'].errors['required']">Nhập mật khẩu mới nè!</span>
                <span *ngIf="f['newPassword'].errors['minlength']">Ít nhất 6 chữ cái nha!</span>
              </div>
            </div>

            <div>
              <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1 px-1">Xác nhận lại nha</label>
              <div class="relative group">
                <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-secondary transition-colors">
                  <lucide-icon name="check-circle-2" [size]="20"></lucide-icon>
                </span>
                <input 
                  type="password" 
                  formControlName="confirmPassword"
                  class="w-full pl-12 pr-4 py-3 bg-slate-50 border-4 border-slate-100 rounded-3xl focus:border-secondary outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner"
                  placeholder="••••••••"
                >
              </div>
              <div *ngIf="f['confirmPassword'].touched && f['confirmPassword'].errors" class="text-[10px] font-black text-danger mt-1 px-2 uppercase tracking-tighter">
                <span *ngIf="f['confirmPassword'].errors['required']">Dòng này cũng quan trọng nè!</span>
                <span *ngIf="f['confirmPassword'].errors['mustMatch']">Mật khẩu chưa giống nhau rùi...</span>
              </div>
            </div>

            <button 
              type="submit" 
              [disabled]="resetForm.invalid || loading"
              class="w-full bg-secondary hover:bg-teal-500 text-white font-black py-4 rounded-3xl transition-all transform hover:scale-[1.03] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-teal-100 mt-6 text-lg tracking-tight"
            >
              <span *ngIf="!loading">Đổi mật khẩu ngay!</span>
              <span *ngIf="loading" class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang thay đổi...
              </span>
            </button>

            <div *ngIf="error" class="bg-danger/10 text-danger text-[11px] font-bold p-4 rounded-2xl border-2 border-danger/20 text-center animate-shake mt-4">
              {{ error }}
            </div>
            
            <div *ngIf="success" class="bg-secondary/10 text-secondary text-[11px] font-bold p-4 rounded-2xl border-2 border-secondary/20 text-center mt-4">
              Xong rùi nha! Đang về trang đăng nhập... ✨
            </div>
          </form>

          <div class="mt-8 pt-6 border-t-2 border-slate-50 text-center">
            <a routerLink="/login" class="text-sm font-black text-slate-400 hover:text-secondary flex items-center justify-center gap-2 transition-colors">
              Quay lại đăng nhập ạ
            </a>
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
  `]
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  resetForm: FormGroup;
  loading = false;
  error = '';
  success = false;
  showPassword = false;
  email = '';

  constructor() {
    this.resetForm = this.fb.group({
      otpCode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.mustMatch('newPassword', 'confirmPassword')
    });
  }

  ngOnInit() {
    this.email = this.route.snapshot.queryParams['email'] || '';
    if (!this.email) {
      this.router.navigate(['/forgot-password']);
    }
  }

  get f() { return this.resetForm.controls; }

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
    if (this.resetForm.invalid) return;

    this.loading = true;
    this.error = '';

    const { otpCode, newPassword } = this.resetForm.value;
    
    this.authService.resetPassword(this.email, otpCode, newPassword).subscribe({
      next: () => {
        this.success = true;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2500);
      },
      error: err => {
        this.error = 'Mã OTP hổng đúng hoặc hết hạn mất tiêu rùi...';
        this.loading = false;
      }
    });
  }
}
