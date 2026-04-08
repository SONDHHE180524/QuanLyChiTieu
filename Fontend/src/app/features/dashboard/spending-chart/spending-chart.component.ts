import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { LucideAngularModule } from 'lucide-angular';
import { ThongKeDashboard } from '../../../core/services/transaction.service';

@Component({
  selector: 'app-spending-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, LucideAngularModule],
  template: `
    <div class="bg-white rounded-4xl p-8 border-4 border-warning shadow-xl shadow-orange-50/50 h-full flex flex-col">
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h2 class="text-2xl font-black text-slate-800 flex items-center gap-3">
          <div class="p-2 bg-warning rounded-2xl shadow-inner rotate-6 text-orange-500">
            <lucide-icon [name]="activeTab === 'trend' ? 'trending-up' : 'pie-chart'" [size]="24"></lucide-icon>
          </div>
          {{ activeTab === 'trend' ? 'Xu Hướng Thu Chi' : 'Phân Tích Chi Tiêu' }}
        </h2>
        
        <div class="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 self-start">
          <button 
            (click)="activeTab = 'trend'"
            [class.bg-white]="activeTab === 'trend'"
            [class.shadow-sm]="activeTab === 'trend'"
            class="px-4 py-2 rounded-xl text-xs font-black transition-all duration-300"
            [class.text-slate-800]="activeTab === 'trend'"
            [class.text-slate-400]="activeTab !== 'trend'">
            Theo tháng
          </button>
          <button 
            (click)="activeTab = 'category'"
            [class.bg-white]="activeTab === 'category'"
            [class.shadow-sm]="activeTab === 'category'"
            class="px-4 py-2 rounded-xl text-xs font-black transition-all duration-300"
            [class.text-slate-800]="activeTab === 'category'"
            [class.text-slate-400]="activeTab !== 'category'">
            Danh mục
          </button>
        </div>
      </div>

      <!-- Line Chart Section -->
      <div *ngIf="activeTab === 'trend'" class="flex-1 min-h-[300px]">
        <canvas baseChart
          [data]="lineChartData"
          [options]="lineChartOptions"
          [type]="'line'">
        </canvas>
      </div>

      <!-- Pie Chart Section -->
      <div *ngIf="activeTab === 'category'" class="flex-1 flex flex-col">
        <div class="flex-1 flex justify-center items-center min-h-[250px] relative group">
          <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
            <div class="w-[55%] flex flex-col items-center justify-center text-center">
              <p class="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Tổng chi</p>
              <p class="text-base md:text-lg lg:text-xl font-black text-slate-800 tracking-tighter leading-none break-words w-full">
                {{ totalExpense | number:'1.0-0' }}đ
              </p>
            </div>
          </div>
          <canvas baseChart
            class="transform group-hover:scale-105 transition-transform duration-500"
            [data]="pieChartData"
            [type]="'doughnut'"
            [options]="pieChartOptions">
          </canvas>
        </div>
        
        <div class="mt-6 grid grid-cols-2 gap-3">
          <div *ngFor="let item of legendItems" class="bg-slate-50 p-3 rounded-2xl border-2 border-transparent hover:border-slate-200 transition-all">
            <div class="flex items-center gap-2 mb-1">
              <span [style.backgroundColor]="item.color" class="w-3 h-3 rounded-full shadow-inner"></span>
              <span class="text-[10px] text-slate-500 font-bold uppercase truncate">{{ item.label }}</span>
            </div>
            <p class="font-black text-slate-800 text-sm">{{ item.value | number:'1.0-0' }}đ</p>
          </div>
        </div>
      </div>
      
      <div *ngIf="!stats || (activeTab === 'category' && legendItems.length === 0)" class="flex-1 flex items-center justify-center italic text-slate-400">
        Chưa có dữ liệu thống kê...
      </div>
    </div>
  `
})
export class SpendingChartComponent implements OnChanges {
  @Input() stats?: ThongKeDashboard;
  
  activeTab: 'trend' | 'category' = 'trend';
  totalExpense = 0;
  legendItems: any[] = [];

  // Line Chart Config
  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: []
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: { tension: 0.4 },
      point: { radius: 4, hoverRadius: 6 }
    },
    plugins: {
      legend: { position: 'top', labels: { usePointStyle: true, font: { weight: 'bold' } } },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1e293b',
        bodyColor: '#1e293b',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true
      }
    },
    scales: {
      y: { beginAtZero: true, grid: { display: false } },
      x: { grid: { display: false } }
    }
  };

  // Pie Chart Config
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } }
  };
  
  public pieChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: [], borderWidth: 4, borderColor: '#ffffff', borderRadius: 5 }]
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['stats'] && this.stats) {
      this.updateCharts();
    }
  }

  private updateCharts() {
    if (!this.stats) return;

    // Update Line Chart (Monthly Trend)
    this.lineChartData = {
      labels: this.stats.xuHuongHangThang.map(m => m.monthName),
      datasets: [
        {
          data: this.stats.xuHuongHangThang.map(m => m.income),
          label: 'Thu nhập',
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true
        },
        {
          data: this.stats.xuHuongHangThang.map(m => m.expense),
          label: 'Chi tiêu',
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true
        }
      ]
    };

    // Update Pie Chart (Category Distribution)
    this.totalExpense = this.stats.tongChi;
    this.legendItems = this.stats.phanBoChiTieu.map(c => ({
      label: c.tenDanhMuc,
      value: c.amount,
      color: c.color
    }));

    this.pieChartData = {
      labels: this.stats.phanBoChiTieu.map(c => c.tenDanhMuc),
      datasets: [{
        data: this.stats.phanBoChiTieu.map(c => c.amount),
        backgroundColor: this.stats.phanBoChiTieu.map(c => c.color),
        borderWidth: 6,
        borderColor: '#ffffff',
        borderRadius: 8,
        hoverOffset: 10
      }]
    };
  }
}
