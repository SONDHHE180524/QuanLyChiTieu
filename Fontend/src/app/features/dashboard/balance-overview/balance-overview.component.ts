import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ThongKeDashboard } from '../../../core/services/transaction.service';

@Component({
  selector: 'app-balance-overview',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
      <!-- Total Balance Card -->
      <div class="bg-cute_pink rounded-4xl p-8 text-white shadow-xl shadow-pink-200/50 relative overflow-hidden group transition-all duration-300 hover:-translate-y-2">
        <div class="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/20 blur-3xl transform group-hover:scale-125 transition-transform duration-700"></div>
        <div class="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-pink-300/30 blur-2xl"></div>
        
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-6">
            <div class="space-y-1">
              <h3 class="text-white/90 font-medium text-lg">Số Dư Hiện Tại</h3>
              <p class="text-white/70 text-sm">Cập nhật lúc {{ today | date:'HH:mm' }}</p>
            </div>
            <div class="p-3 bg-white/30 rounded-2xl backdrop-blur-md border border-white/20">
              <lucide-icon name="wallet" [size]="28" class="text-white"></lucide-icon>
            </div>
          </div>
          <p class="text-4xl font-black tracking-tight mb-4">{{ (stats?.soDu || 0) | number:'1.0-0' }} đ</p>
          <div class="inline-flex items-center text-xs font-semibold bg-white/20 px-4 py-2 rounded-2xl backdrop-blur-md border border-white/10 uppercase tracking-widest leading-none">
            Ví của tôi
          </div>
        </div>
      </div>

      <!-- Income Card -->
      <div class="bg-white rounded-4xl p-8 border-4 border-secondary/20 shadow-xl shadow-secondary/10 relative overflow-hidden group transition-all duration-300 hover:-translate-y-2">
        <div class="absolute -top-4 -right-4 w-24 h-24 bg-secondary/5 rounded-full blur-xl group-hover:bg-secondary/10 transition-colors"></div>
        <div class="flex items-center justify-between mb-6">
          <div class="space-y-1">
            <h3 class="text-slate-400 font-bold uppercase tracking-wider text-xs">Tổng Thu Nhập</h3>
            <p class="text-slate-800 text-3xl font-black">{{ (stats?.tongThu || 0) | number:'1.0-0' }} đ</p>
          </div>
          <div class="p-4 bg-secondary/20 rounded-3xl text-secondary rotate-3 group-hover:rotate-12 transition-transform shadow-inner">
            <lucide-icon name="trending-up" [size]="28"></lucide-icon>
          </div>
        </div>
        <div class="flex items-center gap-2 text-sm text-secondary font-bold bg-secondary/10 w-fit px-4 py-2 rounded-2xl">
          <lucide-icon name="sparkles" [size]="16"></lucide-icon>
          <span>Làm tốt lắm!</span>
        </div>
      </div>

      <!-- Expense Card -->
      <div class="bg-white rounded-4xl p-8 border-4 border-danger/20 shadow-xl shadow-danger/10 relative overflow-hidden group transition-all duration-300 hover:-translate-y-2">
        <div class="absolute -top-4 -right-4 w-24 h-24 bg-danger/5 rounded-full blur-xl group-hover:bg-danger/10 transition-colors"></div>
        <div class="flex items-center justify-between mb-6">
          <div class="space-y-1">
            <h3 class="text-slate-400 font-bold uppercase tracking-wider text-xs">Tổng Chi Tiêu</h3>
            <p class="text-slate-800 text-3xl font-black">{{ (stats?.tongChi || 0) | number:'1.0-0' }} đ</p>
          </div>
          <div class="p-4 bg-danger/20 rounded-3xl text-danger -rotate-3 group-hover:-rotate-12 transition-transform shadow-inner">
            <lucide-icon name="trending-down" [size]="28"></lucide-icon>
          </div>
        </div>
        <div class="flex items-center gap-2 text-sm text-danger font-bold bg-danger/10 w-fit px-4 py-2 rounded-2xl">
          <lucide-icon name="alert-circle" [size]="16"></lucide-icon>
          <span>Tiết kiệm chút nhé</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class BalanceOverviewComponent {
  @Input() stats?: ThongKeDashboard;
  today = new Date();
}
