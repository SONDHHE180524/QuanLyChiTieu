import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="max-w-[900px] mx-auto p-6 md:p-12">
      <!-- Profile Header -->
      <div class="relative mb-24">
        <!-- Banner -->
        <div class="h-56 w-full bg-gradient-to-br from-cute_pink via-primary to-cute_purple rounded-[3rem] shadow-2xl shadow-pink-100/50 overflow-hidden relative border-4 border-white">
           <div class="absolute inset-0 opacity-30 pointer-events-none">
             <div class="absolute top-0 left-0 w-80 h-80 bg-white rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3"></div>
             <div class="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full blur-[100px] translate-x-1/3 translate-y-1/3"></div>
           </div>
        </div>
        
        <!-- Avatar & Name Info -->
        <div class="absolute -bottom-20 left-10 md:left-16 flex items-center md:items-end gap-8 md:gap-12">
          <!-- Avatar Container -->
          <div class="w-36 h-36 md:w-48 md:h-48 bg-white/80 backdrop-blur-md rounded-[2.5rem] p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative group border-4 border-white transition-all duration-500 hover:scale-105 active:scale-95">
            <div 
              (click)="fileInput.click()"
              class="w-full h-full bg-slate-50 rounded-[2rem] flex items-center justify-center overflow-hidden relative cursor-pointer group-hover:brightness-95 transition-all"
            >
              <img 
                *ngIf="getAvatarUrl() as url; else noAvatar" 
                [src]="url" 
                class="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
              >
              <ng-template #noAvatar>
                <lucide-icon name="user" class="text-slate-300" [size]="64"></lucide-icon>
              </ng-template>

              <!-- Upload Overlay -->
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center text-white p-4">
                <div class="p-3 bg-white/20 rounded-2xl backdrop-blur-md mb-2">
                  <lucide-icon [name]="isUploadingAvatar ? 'sparkles' : 'camera'" [class.animate-spin]="isUploadingAvatar" [size]="24"></lucide-icon>
                </div>
                <span class="text-[10px] font-black uppercase tracking-[0.2em] text-center">{{ isUploadingAvatar ? 'Đang tải...' : 'Đổi ảnh' }}</span>
              </div>
            </div>
            <input #fileInput type="file" (change)="onFileSelected($event)" accept="image/*" class="hidden">
          </div>

          <!-- Text Info -->
          <div class="mb-6 md:mb-10">
            <h1 class="text-4xl md:text-5xl font-black text-slate-800 tracking-tighter mb-2 drop-shadow-sm">
              {{ profile?.fullName }}
            </h1>
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 bg-white/80 backdrop-blur-sm border-2 border-slate-100 rounded-full text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.15em] shadow-sm">
                {{ profile?.email }}
              </span>
              <div class="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 gap-8 mt-32">
        <div class="bg-white rounded-[3rem] p-8 md:p-12 border-4 border-slate-50 shadow-2xl shadow-slate-200/40 relative overflow-hidden group">
          <!-- Decorative element -->
          <div class="absolute top-0 right-0 w-32 h-32 bg-cute_blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
          <h2 class="text-2xl font-black text-slate-800 mb-10 flex items-center gap-4">
            <div class="p-3 bg-cute_blue/20 rounded-2xl shadow-sm">
              <lucide-icon name="key-round" [size]="24" class="text-blue-600"></lucide-icon>
            </div>
            Thông tin cá nhân
          </h2>

          <form (submit)="onUpdate()" class="space-y-10">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <!-- Full Name -->
              <div class="space-y-3">
                <label class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">Tên hiển thị</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none group-focus-within:scale-110 transition-transform">
                    <lucide-icon name="user" [size]="20" class="text-slate-400 group-focus-within:text-cute_pink transition-colors"></lucide-icon>
                  </div>
                  <input 
                    name="fullName"
                    [(ngModel)]="editData.fullName"
                    type="text" 
                    placeholder="Họ tên của bạn..." 
                    class="block w-full pl-14 pr-6 py-5 border-4 border-slate-50 rounded-3xl focus:ring-4 focus:ring-cute_blue/20 focus:border-cute_blue transition-all font-bold text-slate-800 bg-slate-50 placeholder:text-slate-300 outline-none shadow-inner">
                </div>
              </div>

              <!-- Email (Read Only) -->
              <div class="space-y-3">
                <label class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">Email <span class="text-[10px] text-slate-300 lowercase font-bold ml-1">(không thể đổi)</span></label>
                <div class="relative group opacity-60">
                  <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <lucide-icon name="mail" [size]="20" class="text-slate-400"></lucide-icon>
                  </div>
                  <input 
                    [value]="profile?.email"
                    type="email" 
                    readonly
                    class="block w-full pl-14 pr-6 py-5 border-4 border-slate-50 rounded-3xl font-bold text-slate-400 bg-slate-50 outline-none cursor-not-allowed">
                </div>
              </div>

              <!-- Member Since -->
              <div class="space-y-3" *ngIf="profile?.createdAt">
                <label class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">Ngày tham gia</label>
                <div class="relative group opacity-60">
                  <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <lucide-icon name="calendar" [size]="20" class="text-slate-400"></lucide-icon>
                  </div>
                  <input 
                    [value]="profile?.createdAt | date:'dd/MM/yyyy'"
                    type="text" 
                    readonly
                    class="block w-full pl-14 pr-6 py-5 border-4 border-slate-50 rounded-3xl font-bold text-slate-400 bg-slate-50 outline-none cursor-not-allowed">
                </div>
              </div>
            </div>

            <div class="flex justify-end pt-6 border-t border-slate-50">
              <button 
                type="submit" 
                [disabled]="isUpdating || !editData.fullName"
                class="flex items-center gap-4 py-5 px-12 rounded-[2rem] bg-slate-800 hover:bg-slate-900 text-white font-black text-lg transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-slate-300 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:shadow-none">
                <lucide-icon [name]="isUpdating ? 'sparkles' : 'check-circle-2'" [size]="24" [class.animate-spin]="isUpdating"></lucide-icon>
                {{ isUpdating ? 'Đang cập nhật...' : 'Lưu Thay Đổi' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  profile: any;
  editData = {
    fullName: ''
  };
  isUpdating = false;
  isUploadingAvatar = false;

  get baseUrl() {
    return environment.apiUrl.replace('/api', '');
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    const user = this.authService.currentUserValue;
    if (user && user.userId) {
      this.authService.getUserProfile(user.userId).subscribe({
        next: (data) => {
          this.profile = data;
          this.editData.fullName = data.fullName;
        },
        error: (err) => console.error('Lỗi khi lấy hồ sơ:', err)
      });
    }
  }

  getAvatarUrl() {
    if (this.profile?.avatarUrl) {
      return this.baseUrl + this.profile.avatarUrl;
    }
    return null;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const user = this.authService.currentUserValue;
    if (!user) return;

    this.isUploadingAvatar = true;
    this.authService.uploadAvatar(user.userId, file).subscribe({
      next: (res) => {
        this.isUploadingAvatar = false;
        this.loadProfile(); // Refresh profile to see new avatar
        this.toastService.success('Tải ảnh đại diện lên thành công! ✨');
      },
      error: (err) => {
        this.isUploadingAvatar = false;
        console.error('Lỗi upload avatar:', err);
        this.toastService.error('Có lỗi xảy ra khi tải ảnh lên.');
      }
    });
  }

  onUpdate() {
    const user = this.authService.currentUserValue;
    if (!user || !this.editData.fullName) return;

    this.isUpdating = true;
    this.authService.updateProfile(user.userId, this.editData.fullName).subscribe({
      next: () => {
        this.isUpdating = false;
        this.loadProfile();
        this.toastService.success('Đã cập nhật hồ sơ thành công! ✨');
      },
      error: (err) => {
        console.error(err);
        this.isUpdating = false;
        this.toastService.error('Có lỗi xảy ra khi cập nhật hồ sơ.');
      }
    });
  }
}
