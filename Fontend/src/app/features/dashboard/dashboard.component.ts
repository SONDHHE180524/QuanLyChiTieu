import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { BalanceOverviewComponent } from './balance-overview/balance-overview.component';
import { QuickAddComponent } from './quick-add/quick-add.component';
import { RecentTransactionsComponent } from './recent-transactions/recent-transactions.component';
import { TransactionService, ThongKeDashboard } from '../../core/services/transaction.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule,
    BalanceOverviewComponent,
    QuickAddComponent,
    RecentTransactionsComponent,
  ],
  template: `
    <div class="max-w-[1600px] mx-auto p-4 md:p-8 space-y-10">
      
      <!-- Top Section: Balance Overview -->
      <app-balance-overview [stats]="dashboardStats"></app-balance-overview>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <!-- Left Column: Quick Add -->
        <div class="lg:col-span-4 space-y-10">
          <app-quick-add (transactionAdded)="onTransactionAdded()"></app-quick-add>
          
          <!-- Tip Card Thay cho biểu đồ -->
          <div class="bg-gradient-to-br from-cute_pink to-pink-500 rounded-4xl p-8 text-white shadow-xl shadow-pink-100 relative overflow-hidden group">
            <div class="relative z-10">
              <h3 class="text-xl font-black mb-2">Mẹo nhỏ!</h3>
              <p class="text-white/80 text-sm font-medium leading-relaxed">Xem chi tiết phân tích chi tiêu của bạn tại trang <a routerLink="/thong-ke" class="underline font-bold hover:text-white">Thống kê</a> để có cái nhìn toàn diện hơn nhé!</p>
            </div>
            <lucide-icon name="sparkles" [size]="80" class="absolute -right-4 -bottom-4 text-white/10 rotate-12 group-hover:scale-120 transition-transform"></lucide-icon>
          </div>
        </div>

        <!-- Right Column: Recent Transactions -->
        <div class="lg:col-span-8">
          <app-recent-transactions #recentTransactions></app-recent-transactions>
        </div>

      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private transactionService = inject(TransactionService);
  private authService = inject(AuthService);

  @ViewChild('recentTransactions') recentTransactions!: RecentTransactionsComponent;

  dashboardStats?: ThongKeDashboard;

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    const user = this.authService.currentUserValue;
    if (user && user.userId) {
      this.transactionService.getThongKeDashboard(user.userId).subscribe({
        next: (data) => {
          this.dashboardStats = data;
        },
        error: (err) => console.error('Lỗi lấy thống kê dashboard:', err)
      });
    }
  }

  onTransactionAdded() {
    this.loadDashboardData();
    this.recentTransactions?.refresh();
  }
}
