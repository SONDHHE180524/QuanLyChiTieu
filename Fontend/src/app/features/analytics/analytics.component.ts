import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpendingChartComponent } from '../dashboard/spending-chart/spending-chart.component';
import { TransactionService, ThongKeDashboard } from '../../core/services/transaction.service';
import { AuthService } from '../../core/services/auth.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, SpendingChartComponent, LucideAngularModule],
  template: `
    <div class="max-w-[1600px] mx-auto p-4 md:p-12 space-y-10">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-2">
          <div class="flex items-center gap-3 text-pink-500 font-black uppercase tracking-[0.3em] text-xs">
            <span class="w-8 h-1 bg-pink-500 rounded-full"></span>
            Phân tích dữ liệu
          </div>
          <h1 class="text-4xl md:text-5xl font-black text-slate-800 tracking-tighter">
            Thống Kê <span class="text-cute_pink">Tài Chính</span>
          </h1>
          <p class="text-slate-400 font-medium">Cái nhìn chi tiết về dòng tiền của gia đình bạn trong năm nay.</p>
        </div>

        <div class="flex items-center gap-4 bg-white p-2 rounded-3xl shadow-sm border-2 border-slate-50">
           <div class="p-4 bg-teal-50 text-teal-600 rounded-2xl">
             <lucide-icon name="calendar" [size]="24"></lucide-icon>
           </div>
           <div class="pr-6">
             <p class="text-[10px] font-bold text-slate-400 uppercase">Năm báo cáo</p>
             <p class="text-xl font-black text-slate-800">2026</p>
           </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-10">
        <!-- Main Chart Container - Kích thước lớn -->
        <div class="w-full min-h-[600px]">
          <app-spending-chart [stats]="dashboardStats"></app-spending-chart>
        </div>

        <!-- Extra Insights or Summary Cards could go here -->
         <div class="grid grid-cols-1 md:grid-cols-2 gap-8" *ngIf="dashboardStats">
            <div class="bg-indigo-600 rounded-4xl p-8 text-white shadow-xl shadow-indigo-100 flex items-center justify-between group overflow-hidden relative">
               <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
               <div class="relative z-10">
                 <p class="text-indigo-100 font-bold uppercase tracking-widest text-xs mb-2">Tỷ lệ Tiết kiệm</p>
                 <p class="text-4xl font-black">{{ (dashboardStats.soDu / (dashboardStats.tongThu || 1) * 100) | number:'1.0-1' }}%</p>
               </div>
               <lucide-icon name="sparkles" [size]="48" class="text-white/20 relative z-10"></lucide-icon>
            </div>

            <div class="bg-slate-800 rounded-4xl p-8 text-white shadow-xl shadow-slate-200 flex items-center justify-between group overflow-hidden relative">
               <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
               <div class="relative z-10">
                 <p class="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Trung bình chi mỗi tháng</p>
                 <p class="text-4xl font-black">{{ (dashboardStats.tongChi / 12) | number:'1.0-0' }}đ</p>
               </div>
               <lucide-icon name="trending-down" [size]="48" class="text-white/20 relative z-10"></lucide-icon>
            </div>
         </div>
      </div>
    </div>
  `
})
export class AnalyticsComponent implements OnInit {
  private transactionService = inject(TransactionService);
  private authService = inject(AuthService);

  dashboardStats?: ThongKeDashboard;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const user = this.authService.currentUserValue;
    if (user && user.userId) {
      this.transactionService.getThongKeDashboard(user.userId).subscribe({
        next: (data) => {
          this.dashboardStats = data;
        },
        error: (err) => console.error('Lỗi lấy dữ liệu thống kê:', err)
      });
    }
  }
}
