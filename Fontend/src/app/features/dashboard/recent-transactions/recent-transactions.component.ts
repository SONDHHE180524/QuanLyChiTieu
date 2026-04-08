import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { TransactionService, GiaoDich } from '../../../core/services/transaction.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-recent-transactions',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="bg-white rounded-4xl p-8 border-4 border-cute_mint shadow-xl shadow-emerald-50/50">
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h2 class="text-2xl font-black text-slate-800 flex items-center gap-3">
          <div class="p-2 bg-cute_mint rounded-2xl shadow-inner -rotate-3">
            <lucide-icon name="history" [size]="24" class="text-emerald-600"></lucide-icon>
          </div>
          Lịch Sử Gần Đây
        </h2>

        <!-- Filter Tabs - Senior Style -->
        <div class="flex p-1.5 bg-slate-100 rounded-2xl border-2 border-slate-200/30">
          <button 
            (click)="setFilter('All')"
            class="px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300"
            [ngClass]="filterType === 'All' ? 'bg-white text-slate-800 shadow-md' : 'text-slate-400 hover:text-slate-600'">
            Tất cả
          </button>
          <button 
            (click)="setFilter('Thu')"
            class="px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300"
            [ngClass]="filterType === 'Thu' ? 'bg-secondary text-white shadow-md' : 'text-slate-400 hover:text-emerald-600'">
            Thu
          </button>
          <button 
            (click)="setFilter('Chi')"
            class="px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300"
            [ngClass]="filterType === 'Chi' ? 'bg-danger text-white shadow-md' : 'text-slate-400 hover:text-rose-600'">
            Chi
          </button>
        </div>
      </div>

      <div class="space-y-4">
        <div *ngIf="paginatedTransactions.length === 0" class="flex flex-col items-center justify-center py-12 text-slate-400 italic">
           <lucide-icon name="ghost" [size]="64" class="mb-4 opacity-20"></lucide-icon>
           <p class="font-bold">Hổng có giao dịch nào hết trơn!</p>
        </div>

        <div 
          *ngFor="let item of paginatedTransactions" 
          class="group flex items-center justify-between p-5 rounded-3xl border-4 border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all duration-500 hover:scale-[1.02]"
        >
          <div class="flex items-center gap-5">
            <div 
              class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-500"
              [ngClass]="item.loai === 'Thu' ? 'bg-secondary/10 text-secondary shadow-emerald-100' : 'bg-danger/10 text-danger shadow-rose-100'"
            >
              <lucide-icon [name]="item.loai === 'Thu' ? 'sparkles' : 'shopping-bag'" [size]="24"></lucide-icon>
            </div>
            <div>
              <h3 class="font-black text-slate-800 text-lg group-hover:text-info transition-colors">{{ item.tenDanhMuc }}</h3>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg bg-slate-100 text-slate-400">
                  {{ item.note || item.tenDanhMuc }}
                </span>
                <span class="text-slate-300">•</span>
                <span class="text-[10px] font-bold text-slate-400">
                  {{ item.transactionDate | date:'dd/MM/yyyy' }}
                </span>
              </div>
            </div>
          </div>
          <div class="text-right">
            <div 
              class="text-xl font-black tracking-tight"
              [ngClass]="item.loai === 'Thu' ? 'text-secondary' : 'text-danger'"
            >
              {{ item.loai === 'Thu' ? '+' : '-' }}{{ item.amount | number }} đ
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination Controls - Senior Upgrade -->
      <div class="mt-8 pt-6 border-t-2 border-dashed border-slate-100 flex items-center justify-between" *ngIf="totalPages > 1">
        <button 
          (click)="prevPage()" 
          [disabled]="currentPage === 1"
          class="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 text-slate-500"
        >
          <lucide-icon name="chevron-left" [size]="18"></lucide-icon>
          Trước
        </button>
        
        <div class="flex items-center gap-3">
          <span class="text-xs font-black text-slate-300">TRANG</span>
          <span class="w-8 h-8 flex items-center justify-center bg-cute_mint text-emerald-700 rounded-lg text-sm font-black shadow-inner">
            {{ currentPage }}
          </span>
          <span class="text-xs font-black text-slate-300">/</span>
          <span class="text-sm font-black text-slate-500">{{ totalPages }}</span>
        </div>

        <button 
          (click)="nextPage()" 
          [disabled]="currentPage === totalPages"
          class="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 text-slate-500 text-right"
        >
          Sau
          <lucide-icon name="chevron-right" [size]="18"></lucide-icon>
        </button>
      </div>
    </div>
  `
})
export class RecentTransactionsComponent implements OnInit {
  private transactionService = inject(TransactionService);
  private authService = inject(AuthService);

  transactions: GiaoDich[] = [];
  filterType: 'All' | 'Thu' | 'Chi' = 'All';
  
  currentPage = 1;
  pageSize = 10;

  ngOnInit() {
    this.refresh();
  }

  // Lọc theo loại trước
  private get baseFilteredTransactions() {
    if (this.filterType === 'All') return this.transactions;
    return this.transactions.filter(t => t.loai === this.filterType);
  }

  // Sau đó lấy danh sách phân trang
  get paginatedTransactions() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.baseFilteredTransactions.slice(start, end);
  }

  get totalPages() {
    return Math.ceil(this.baseFilteredTransactions.length / this.pageSize);
  }

  setFilter(type: 'All' | 'Thu' | 'Chi') {
    this.filterType = type;
    this.currentPage = 1; // Reset về trang 1 khi lọc
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  refresh() {
    const user = this.authService.currentUserValue;
    if (user && user.userId) {
      this.transactionService.getLichSuGiaoDich(user.userId).subscribe({
        next: (data: GiaoDich[]) => {
          this.transactions = data; // Không slice nữa, để client phân trang
          this.currentPage = 1;
        },
        error: (err: any) => console.error(err)
      });
    }
  }
}
