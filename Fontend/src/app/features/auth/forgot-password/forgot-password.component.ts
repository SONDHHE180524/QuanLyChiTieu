import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-cute_mint flex items-center justify-center p-6 font-sans">
      <div class="max-w-md w-full bg-white rounded-5xl shadow-2xl shadow-teal-200/50 border-8 border-white overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-br from-info to-cute_blue p-10 text-white text-center relative overflow-hidden">
          <div class="relative z-10 flex flex-col items-center">
            <div class="bg-white/40 p-4 rounded-[2rem] w-fit mx-auto mb-6 backdrop-blur-md border-[3px] border-white/50 rotate-3 shadow-xl hover:rotate-6 transition-all duration-300 animate-float">
               <img src="https://media.giphy.com/media/8vQSQ3cNXuDba/giphy.gif" alt="Thinking Cat" class="w-16 h-16 rounded-xl object-cover">
            </div>
            <h2 class="text-4xl font-black tracking-tighter mb-3 drop-shadow-md">Quên mật khẩu? <span class="animate-pulse inline-block">🥺</span></h2>
            <p class="text-white/90 font-bold text-[13px] uppercase tracking-[0.2em] leading-none bg-white/20 px-5 py-2 rounded-full shadow-sm backdrop-blur-sm border border-white/30">Chúng mình sẽ đổi pass cùng nha!</p>
          </div>
          
          <!-- Decorative Elements -->
          <div class="absolute w-12 h-12 text-white/40 top-4 right-6 animate-float-delayed"><lucide-icon name="cloud" [size]="48" class="fill-current"></lucide-icon></div>
          <div class="absolute w-8 h-8 text-white/40 bottom-6 left-8 animate-float"><lucide-icon name="star" [size]="32" class="fill-current"></lucide-icon></div>
          <div class="absolute -top-12 -right-12 w-48 h-48 bg-white/30 rounded-full blur-2xl animate-float"></div>
          <div class="absolute -bottom-12 -left-12 w-40 h-40 bg-blue-300/40 rounded-full blur-xl animate-float-delayed"></div>
        </div>

        <!-- Form -->
        <div class="p-10">
          <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Email tài khoản</label>
              <div class="relative group">
                <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-info transition-colors">
                  <lucide-icon name="mail" [size]="20"></lucide-icon>
                </span>
                <input 
                  type="email" 
                  formControlName="email"
                  class="w-full pl-12 pr-4 py-4 bg-slate-50 border-4 border-slate-100 rounded-3xl focus:border-info outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner"
                  placeholder="name@example.com"
                >
              </div>
              <div *ngIf="f['email'].touched && f['email'].errors" class="text-[10px] font-black text-danger mt-2 px-2 uppercase tracking-tighter">
                <span *ngIf="f['email'].errors['required']">Vui lòng nhập email nha</span>
                <span *ngIf="f['email'].errors['email']">Email chưa đúng rùi ạ</span>
              </div>
            </div>

            <button 
              type="submit" 
              [disabled]="forgotForm.invalid || loading"
              class="w-full bg-info hover:bg-blue-400 text-white font-black py-4 rounded-3xl transition-all transform hover:scale-[1.03] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-blue-100 mt-4 text-lg tracking-tight"
            >
              <span *ngIf="!loading">Gửi mã OTP cho mình ✨</span>
              <span *ngIf="loading" class="flex items-center justify-center gap-3">
                <svg class="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang gửi...
              </span>
            </button>

            <div *ngIf="error" class="bg-danger/10 text-danger text-[11px] font-bold p-4 rounded-2xl border-2 border-danger/20 text-center animate-shake mt-4">
              {{ error }}
            </div>
            
            <div *ngIf="message" class="bg-secondary/10 text-secondary text-[11px] font-bold p-4 rounded-2xl border-2 border-secondary/20 text-center mt-4 text-teal-700">
              {{ message }}
            </div>
          </form>

          <div class="mt-10 pt-8 border-t-2 border-slate-50 text-center">
            <a routerLink="/login" class="text-sm font-black text-slate-400 hover:text-info flex items-center justify-center gap-2 transition-colors">
              <lucide-icon name="arrow-left-circle" [size]="20"></lucide-icon>
              Quay về đăng nhập
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-float { animation: float 6s ease-in-out infinite; }
    .animate-float-delayed { animation: float 6s ease-in-out 3s infinite; }
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-15px) rotate(8deg); }
    }
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
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  forgotForm: FormGroup;
  loading = false;
  error = '';
  message = '';

  constructor() {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() { return this.forgotForm.controls; }

  onSubmit() {
    if (this.forgotForm.invalid) return;

    this.loading = true;
    this.error = '';
    this.message = '';

    const email = this.forgotForm.value.email;
    
    this.authService.forgotPassword(email).subscribe({
      next: (res) => {
        this.message = res.message;
        setTimeout(() => {
          this.router.navigate(['/reset-password'], { queryParams: { email } });
        }, 2000);
      },
      error: err => {
        this.error = err.error || 'Email không tồn tại hoặc lỗi hệ thống rồi ạ.';
        this.loading = false;
      }
    });
  }
}
