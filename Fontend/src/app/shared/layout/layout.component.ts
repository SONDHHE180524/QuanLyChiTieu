import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { ToastComponent } from '../components/toast/toast.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, ToastComponent],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col">
      <!-- Header -->
      <header class="bg-white/80 backdrop-blur-md border-b-2 border-slate-100/50 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <!-- Logo Section -->
          <div class="flex items-center gap-8">
            <div class="flex items-center gap-3 cursor-pointer group" routerLink="/">
              <div class="p-2.5 bg-danger rounded-2xl shadow-lg shadow-rose-200 group-hover:rotate-12 transition-all duration-500">
                <lucide-icon name="heart" [size]="28" class="text-white fill-white"></lucide-icon>
              </div>
              <div class="flex flex-col">
                <span class="text-xl font-black text-slate-800 leading-none tracking-tighter">SmartFamily</span>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Expense Tracker</span>
              </div>
            </div>

            <!-- Main Nav -->
            <nav class="hidden lg:flex items-center gap-2 pl-8 border-l-2 border-slate-100">
               <a 
                routerLink="/" 
                routerLinkActive="bg-slate-100 text-slate-800" 
                [routerLinkActiveOptions]="{exact: true}"
                class="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-sm font-black text-slate-400 hover:text-slate-600 transition-all active:scale-95"
               >
                 <lucide-icon name="layout" [size]="18"></lucide-icon>
                 Tổng quan
               </a>
               <a 
                routerLink="/thong-ke" 
                routerLinkActive="bg-slate-100 text-slate-800" 
                class="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-sm font-black text-slate-400 hover:text-slate-600 transition-all active:scale-95"
               >
                 <lucide-icon name="pie-chart" [size]="18"></lucide-icon>
                 Thống kê
               </a>
            </nav>
          </div>

          <!-- User Profile & Actions -->
          <div class="flex items-center gap-6" *ngIf="authService.currentUser$ | async as user">
            <div class="hidden md:flex flex-col items-end cursor-pointer group" routerLink="/profile">
              <span class="text-sm font-black text-slate-700 leading-none mb-1 group-hover:text-cute_pink transition-colors">{{ user.fullName }}</span>
              <span class="text-[10px] font-bold text-teal-500 bg-teal-50 px-2 py-0.5 rounded-full uppercase tracking-tighter border border-teal-100">Gia đình là số 1</span>
            </div>
            
            <div 
              routerLink="/profile"
              class="h-12 w-12 bg-cute_purple rounded-2xl flex justify-center items-center overflow-hidden border-4 border-white shadow-xl shadow-purple-50 ring-2 ring-slate-100/50 cursor-pointer hover:scale-110 transition-all active:scale-95 group"
            >
              <img *ngIf="user.avatarUrl; else noAvatar" [src]="baseUrl + user.avatarUrl" class="w-full h-full object-cover">
              <ng-template #noAvatar>
                <lucide-icon name="user" class="text-purple-600 group-hover:scale-110 transition-transform" [size]="24"></lucide-icon>
              </ng-template>
            </div>

            <button 
              (click)="logout()"
              class="p-3 text-slate-400 hover:text-danger hover:bg-danger/10 rounded-2xl transition-all duration-300 group relative"
              title="Đăng xuất"
            >
              <lucide-icon name="power" [size]="24" class="group-hover:rotate-90 transition-transform"></lucide-icon>
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-grow pt-4 md:pt-10 lg:pt-24 pb-[120px] lg:pb-12">
        <router-outlet></router-outlet>
      </main>

      <!-- Mobile Bottom Navigation (Only visible on small screens) -->
      <nav class="lg:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white/90 backdrop-blur-xl border-t border-slate-100 px-6 pt-3 pb-8 flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <a 
          routerLink="/" 
          routerLinkActive="text-cute_blue scale-110 -translate-y-2 after:scale-100" 
          [routerLinkActiveOptions]="{exact: true}" 
          class="relative flex flex-col items-center gap-1.5 text-slate-400 transition-all duration-300 w-16 after:content-[''] after:absolute after:-bottom-3 after:w-1.5 after:h-1.5 after:bg-cute_blue after:rounded-full after:scale-0 after:transition-transform"
        >
          <lucide-icon name="layout" [size]="22"></lucide-icon>
          <span class="text-[10px] font-black tracking-tighter">Tổng quan</span>
        </a>
        
        <a 
          routerLink="/thong-ke" 
          routerLinkActive="text-warning scale-110 -translate-y-2 after:scale-100" 
          class="relative flex flex-col items-center gap-1.5 text-slate-400 transition-all duration-300 w-16 after:content-[''] after:absolute after:-bottom-3 after:w-1.5 after:h-1.5 after:bg-warning after:rounded-full after:scale-0 after:transition-transform"
        >
          <lucide-icon name="pie-chart" [size]="22"></lucide-icon>
          <span class="text-[10px] font-black tracking-tighter">Thống kê</span>
        </a>
        
        <a 
          routerLink="/profile" 
          routerLinkActive="text-cute_purple scale-110 -translate-y-2 after:scale-100" 
          class="relative flex flex-col items-center gap-1.5 text-slate-400 transition-all duration-300 w-16 after:content-[''] after:absolute after:-bottom-3 after:w-1.5 after:h-1.5 after:bg-cute_purple after:rounded-full after:scale-0 after:transition-transform"
        >
          <lucide-icon name="user" [size]="22"></lucide-icon>
          <span class="text-[10px] font-black tracking-tighter">Hồ sơ</span>
        </a>
      </nav>

      <!-- Global Toasts -->
      <app-toast></app-toast>
    </div>
  `
})
export class LayoutComponent implements OnInit {
  authService = inject(AuthService);

  get baseUrl() {
    return environment.apiUrl.replace('/api', '');
  }

  ngOnInit() {}

  logout() {
    this.authService.logout();
  }
}
