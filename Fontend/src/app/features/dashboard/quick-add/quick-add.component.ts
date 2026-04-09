import { Component, OnInit, inject, Output, EventEmitter, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { DanhMucService, Category } from '../../../core/services/danhmuc.service';
import { TransactionService, TaoGiaoDichRequest } from '../../../core/services/transaction.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-quick-add',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  template: `
    <div class="bg-white rounded-4xl p-8 border-4 border-cute_purple shadow-xl shadow-purple-100/50">
      <!-- Type Toggle -->
      <div class="flex p-2 bg-slate-100 rounded-3xl mb-8 border-2 border-slate-200/50 shadow-inner">
        <button 
          (click)="type = 'Chi'; updateFilteredCategories()"
          class="flex-1 py-3 text-sm font-bold rounded-2xl transition-all duration-300 transform"
          [ngClass]="type === 'Chi' ? 'bg-danger text-white shadow-lg scale-105' : 'text-slate-500 hover:bg-slate-200'">
          Khoản Chi
        </button>
        <button 
          (click)="type = 'Thu'; updateFilteredCategories()"
          class="flex-1 py-3 text-sm font-bold rounded-2xl transition-all duration-300 transform"
          [ngClass]="type === 'Thu' ? 'bg-secondary text-white shadow-lg scale-105' : 'text-slate-500 hover:bg-slate-200'">
          Khoản Thu
        </button>
      </div>

      <form (submit)="onSubmit()" class="space-y-6">
        <!-- Amount -->
        <div>
          <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Số tiền (VNĐ)</label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:scale-125 transition-transform">
              <lucide-icon name="banknote" [size]="20" class="text-slate-400"></lucide-icon>
            </div>
            <input 
              name="amount"
              [(ngModel)]="formData.amount"
              type="number" 
              placeholder="0" 
              class="block w-full pl-12 pr-4 py-4 border-4 border-slate-100 rounded-3xl focus:ring-0 focus:border-cute_blue transition-all text-lg font-bold text-slate-800 bg-slate-50 outline-none shadow-inner">
          </div>
        </div>

        <!-- Category Section -->
        <div class="space-y-3 relative" #dropdownContainer>
          <div class="flex items-center justify-between px-1">
            <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Danh mục</label>
            <div class="flex items-center gap-2">
              <button 
                type="button"
                (click)="isManaging = true"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all active:scale-95"
              >
                <lucide-icon name="settings" [size]="14"></lucide-icon>
                <span class="text-[10px] font-bold uppercase tracking-tighter">Quản lý</span>
              </button>
              <button 
                *ngIf="!isAddingCategory"
                type="button"
                (click)="toggleAddingCategory()"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-info/10 text-info hover:bg-info/20 transition-all active:scale-95"
              >
                <lucide-icon name="plus-circle" [size]="14"></lucide-icon>
                <span class="text-[10px] font-bold uppercase tracking-tighter">Thêm mới</span>
              </button>
            </div>
          </div>

          <!-- Custom Dropdown Selector -->
          <div class="relative">
            <!-- Dropdown Trigger Button -->
            <div 
              (click)="isDropdownOpen = !isDropdownOpen"
              class="w-full pl-12 pr-12 py-4 border-4 border-slate-100 rounded-3xl bg-slate-50 flex items-center justify-between cursor-pointer transition-all hover:border-cute_blue group relative z-10"
              [ngClass]="{'border-cute_blue shadow-lg shadow-blue-50': isDropdownOpen}"
            >
              <div class="absolute left-4 pointer-events-none group-hover:rotate-12 transition-transform">
                <lucide-icon name="tag" [size]="20" class="text-slate-400"></lucide-icon>
              </div>
              <span class="font-bold text-slate-800 pointer-events-none select-none">{{ getSelectedCategoryName() || 'Chọn danh mục nè...' }}</span>
              <lucide-icon name="chevron-down" [size]="20" class="text-slate-400 transition-transform pointer-events-none" [ngClass]="{'rotate-180 text-cute_blue': isDropdownOpen}"></lucide-icon>
            </div>

            <div *ngIf="isDropdownOpen" class="absolute top-full left-0 right-0 mt-3 bg-white border-4 border-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] z-[99] py-4 max-h-[400px] overflow-y-auto animate-drop-fade custom-scrollbar">
              <div *ngFor="let cat of filteredCategories" class="px-4 py-1 flex items-center justify-between group/item">
                <div 
                  (click)="selectCategory(cat.id)"
                  class="flex-1 flex items-center gap-3 px-5 py-3 rounded-2xl cursor-pointer"
                  [ngClass]="formData.categoryId === cat.id ? 'bg-cute_blue/10 text-slate-800 shadow-sm' : 'hover:bg-slate-50 text-slate-600'"
                >
                    <div class="w-2 h-2 rounded-full" [ngClass]="type === 'Chi' ? 'bg-danger' : 'bg-secondary'"></div>
                    <span class="font-bold text-sm">{{ cat.name }}</span>
                    <lucide-icon *ngIf="formData.categoryId === cat.id" name="check-circle-2" [size]="16" class="text-cute_blue"></lucide-icon>
                </div>
                <button 
                  *ngIf="!cat.isDefault"
                  (click)="deleteCategory($event, cat)"
                  class="p-2 text-slate-300 hover:text-danger hover:bg-danger/10 rounded-xl opacity-0 group-hover/item:opacity-100 transition-all pointer-events-auto mr-4"
                >
                  <lucide-icon name="trash-2" [size]="18"></lucide-icon>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Date & Note -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Ngày giao dịch</label>
            <input 
              name="transactionDate"
              [(ngModel)]="formData.transactionDate"
              type="date" 
              [min]="minDate"
              [max]="maxDate"
              class="block w-full px-4 py-4 border-4 border-slate-100 rounded-3xl focus:ring-0 focus:border-cute_blue transition-all font-bold text-slate-800 bg-slate-50 outline-none text-sm cursor-pointer shadow-inner">
          </div>
          <div>
            <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Ghi chú (nếu có)</label>
            <input 
              name="note"
              [(ngModel)]="formData.note"
              type="text" 
              placeholder="Ghi gì đó..." 
              class="block w-full px-4 py-4 border-4 border-slate-100 rounded-3xl focus:ring-0 focus:border-cute_blue transition-all font-bold text-slate-800 bg-slate-50 outline-none text-sm shadow-inner">
          </div>
        </div>

        <button 
          type="submit" 
          [disabled]="isAddingCategory || isSavingCategory"
          class="mt-6 w-full flex justify-center items-center gap-3 py-5 px-6 rounded-3xl bg-slate-800 hover:bg-slate-900 text-white font-black text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-slate-200 disabled:opacity-50 disabled:scale-100">
          <lucide-icon name="check-circle-2" [size]="24"></lucide-icon>
          Lưu Giao Dịch
        </button>
      </form>
    </div>

    <!-- Category Management Modal -->
    <div *ngIf="isManaging" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm" [@fadeInOut]>
      <div class="bg-white w-full max-w-4xl max-h-[85vh] rounded-[3.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.25)] border-8 border-white overflow-hidden flex flex-col" [@modalSlide]>
        <!-- Modal Header -->
        <div class="p-10 border-b-2 border-slate-50 flex justify-between items-center bg-slate-50/30 backdrop-blur-md text-slate-800">
          <div class="flex items-center gap-5">
             <div class="p-4 bg-slate-800 rounded-[1.5rem] shadow-xl shadow-slate-200">
               <lucide-icon name="settings" class="text-white" [size]="28"></lucide-icon>
             </div>
             <div>
               <h2 class="text-3xl font-black tracking-tighter">Quản lý danh mục</h2>
               <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Dọn dẹp hệ thống của bạn ✨</p>
             </div>
          </div>
          <button (click)="isManaging = false" class="p-4 hover:bg-slate-100 rounded-2xl transition-all active:scale-90 group text-slate-400">
            <lucide-icon name="x" class="group-hover:text-danger group-hover:rotate-90 transition-all font-bold" [size]="28"></lucide-icon>
          </button>
        </div>

        <!-- Modal Content (Two Columns) -->
        <div class="flex-grow p-10 overflow-y-auto custom-scrollbar">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            <!-- Expense column -->
            <div>
               <div class="flex items-center gap-3 mb-8 px-2">
                 <div class="w-10 h-10 bg-danger/10 rounded-2xl flex items-center justify-center border-2 border-danger/10 shadow-sm">
                   <lucide-icon name="trending-down" class="text-danger" [size]="20"></lucide-icon>
                 </div>
                 <h3 class="text-xl font-black text-danger tracking-tight">Khoản Chi</h3>
               </div>
               <div class="space-y-3">
                 <div *ngFor="let cat of getCategoriesByType('Chi')" class="group flex items-center justify-between p-4 bg-slate-50/50 border-2 border-slate-100/50 rounded-2xl hover:bg-white hover:border-danger/20 transition-all hover:shadow-xl hover:shadow-danger/5">
                   <span class="font-bold text-slate-700 tracking-tight">{{ cat.name }}</span>
                   <button *ngIf="!cat.isDefault" (click)="deleteCategory($event, cat)" class="p-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-danger hover:bg-danger/10 rounded-xl transition-all">
                     <lucide-icon name="trash-2" [size]="18"></lucide-icon>
                   </button>
                   <span *ngIf="cat.isDefault" class="text-[8px] font-black text-slate-300 uppercase tracking-widest px-2 py-1 bg-slate-100 rounded-lg">Mặc định</span>
                 </div>
               </div>
            </div>

            <!-- Income column -->
            <div>
               <div class="flex items-center gap-3 mb-8 px-2">
                 <div class="w-10 h-10 bg-secondary/10 rounded-2xl flex items-center justify-center border-2 border-secondary/10 shadow-sm">
                   <lucide-icon name="trending-up" class="text-secondary" [size]="20"></lucide-icon>
                 </div>
                 <h3 class="text-xl font-black text-secondary tracking-tight">Khoản Thu</h3>
               </div>
               <div class="space-y-3">
                 <div *ngFor="let cat of getCategoriesByType('Thu')" class="group flex items-center justify-between p-4 bg-slate-50/50 border-2 border-slate-100/50 rounded-2xl hover:bg-white hover:border-secondary/20 transition-all hover:shadow-xl hover:shadow-secondary/5">
                   <span class="font-bold text-slate-700 tracking-tight">{{ cat.name }}</span>
                   <button *ngIf="!cat.isDefault" (click)="deleteCategory($event, cat)" class="p-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-danger hover:bg-danger/10 rounded-xl transition-all">
                     <lucide-icon name="trash-2" [size]="18"></lucide-icon>
                   </button>
                   <span *ngIf="cat.isDefault" class="text-[8px] font-black text-slate-300 uppercase tracking-widest px-2 py-1 bg-slate-100 rounded-lg">Mặc định</span>
                 </div>
               </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="p-8 border-t-2 border-slate-50 bg-slate-50/50 text-center">
          <p class="text-xs font-bold text-slate-400 tracking-tight">Nhấn <lucide-icon name="trash-2" [size]="14" class="inline mb-1"></lucide-icon> để xóa vĩnh viễn danh mục khỏi hệ thống.</p>
        </div>
      </div>
    </div>

    <!-- Add Category Modal -->
    <div *ngIf="isAddingCategory" class="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md" [@fadeInOut]>
      <div class="bg-white w-full max-w-md rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.3)] border-8 border-white overflow-hidden flex flex-col" [@modalSlide]>
        <div class="p-8 border-b-2 border-slate-50 flex justify-between items-center bg-teal-50/30">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-info rounded-2xl shadow-lg shadow-blue-100">
              <lucide-icon name="plus-circle" class="text-white" [size]="24"></lucide-icon>
            </div>
            <h2 class="text-2xl font-black tracking-tight text-slate-800">Thêm danh mục</h2>
          </div>
          <button (click)="toggleAddingCategory()" class="p-3 hover:bg-slate-100 rounded-xl transition-all active:scale-90">
            <lucide-icon name="x" class="text-slate-400" [size]="20"></lucide-icon>
          </button>
        </div>

        <div class="p-8 space-y-8">
          <div>
            <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Tên danh mục mới</label>
            <input 
              name="newCategoryName"
              [(ngModel)]="newCategoryName"
              type="text" 
              placeholder="Ví dụ: Ăn uống, Tiền điện..." 
              class="block w-full px-6 py-4 border-4 border-slate-100 rounded-2xl focus:ring-0 focus:border-info transition-all font-bold text-slate-800 bg-slate-50 outline-none text-base shadow-inner">
          </div>

          <div>
            <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Loại danh mục</label>
            <div class="flex p-2 bg-slate-100 rounded-2xl border-2 border-slate-200/50">
              <button 
                type="button"
                (click)="newCategoryType = 'Chi'"
                class="flex-1 py-3 text-xs font-black rounded-xl transition-all duration-300"
                [ngClass]="newCategoryType === 'Chi' ? 'bg-danger text-white shadow-md scale-105' : 'text-slate-500 hover:bg-slate-200'">
                KHOẢN CHI
              </button>
              <button 
                type="button"
                (click)="newCategoryType = 'Thu'"
                class="flex-1 py-3 text-xs font-black rounded-xl transition-all duration-300 ml-2"
                [ngClass]="newCategoryType === 'Thu' ? 'bg-secondary text-white shadow-md scale-105' : 'text-slate-500 hover:bg-slate-200'">
                KHOẢN THU
              </button>
            </div>
          </div>
        </div>

        <div class="p-8 bg-slate-50/50 border-t-2 border-slate-50">
          <button 
            (click)="addNewCategory()"
            [disabled]="!newCategoryName || isSavingCategory"
            class="w-full flex justify-center items-center gap-3 py-5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-black text-lg transition-all duration-300 transform active:scale-95 shadow-xl shadow-slate-200 disabled:opacity-50">
            <lucide-icon [name]="isSavingCategory ? 'sparkles' : 'check'" [size]="24" [class.animate-spin]="isSavingCategory"></lucide-icon>
            {{ isSavingCategory ? 'Đang lưu...' : 'Lưu Danh Mục' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Custom Confirm Delete Modal -->
    <div *ngIf="isConfirmingDelete" class="fixed inset-0 z-[130] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md" [@fadeInOut]>
      <div class="bg-white w-full max-w-sm rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.3)] border-4 border-white overflow-hidden p-8 text-center" [@modalSlide]>
        <div class="w-20 h-20 bg-danger/10 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
           <lucide-icon name="alert-circle" class="text-danger" [size]="40"></lucide-icon>
        </div>
        <h3 class="text-2xl font-black text-slate-800 mb-2">Bạn chắc chắn chứ?</h3>
        <p class="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
          Danh mục <span class="font-black text-danger">{{ categoryToDelete?.name }}</span> sẽ bị xóa vĩnh viễn khỏi hệ thống!
        </p>
        
        <div class="flex gap-4">
          <button (click)="cancelDelete()" class="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all active:scale-95">
            Hủy bỏ
          </button>
          <button (click)="confirmDelete()" class="flex-1 py-4 bg-danger hover:bg-red-600 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-danger/30">
            Xóa luôn!
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slide-down {
      from { opacity: 0; transform: translateY(-10px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .animate-slide-down {
      animation: slide-down 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes drop-fade {
      from { opacity: 0; transform: translateY(-20px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .animate-drop-fade {
      animation: drop-fade 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e2e8f0; }
  `],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('modalSlide', [
      transition(':enter', [
        style({ transform: 'translateY(100px) scale(0.9)', opacity: 0 }),
        animate('400ms cubic-bezier(0.16, 1, 0.3, 1)', style({ transform: 'translateY(0) scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateY(50px) scale(0.95)', opacity: 0 }))
      ])
    ])
  ]
})
export class QuickAddComponent implements OnInit {
  @Output() transactionAdded = new EventEmitter<void>();
  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;

  private danhmucService = inject(DanhMucService);
  private transactionService = inject(TransactionService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  type: 'Chi' | 'Thu' = 'Chi';
  categories: Category[] = [];
  filteredCategories: Category[] = [];

  // UI States
  isDropdownOpen = false;
  isManaging = false;
  isConfirmingDelete = false;
  categoryToDelete: Category | null = null;

  // Thêm danh mục mới
  isAddingCategory = false;
  isSavingCategory = false;
  newCategoryName = '';
  newCategoryType: 'Chi' | 'Thu' = 'Chi';

  formData = {
    amount: 0,
    categoryId: 0,
    transactionDate: new Date().toISOString().split('T')[0],
    note: ''
  };

  minDate = '';
  maxDate = '';

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (this.dropdownContainer && !this.dropdownContainer.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

  ngOnInit() {
    this.newCategoryType = this.type;
    this.loadCategories();
    this.initDateLimits();
  }

  initDateLimits() {
    const year = new Date().getFullYear();
    this.minDate = `${year}-01-01`;
    this.maxDate = `${year}-12-31`;
  }

  loadCategories(selectId?: number) {
    this.danhmucService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.updateFilteredCategories(selectId);
      }
    });
  }

  updateFilteredCategories(selectId?: number) {
    this.filteredCategories = this.categories.filter(c => c.type === this.type);
    if (selectId) {
      this.formData.categoryId = selectId;
    } else if (this.formData.categoryId !== 0) {
        const exists = this.filteredCategories.some(c => c.id === this.formData.categoryId);
        if (!exists) this.formData.categoryId = 0;
    }
    this.newCategoryType = this.type;
  }

  getCategoriesByType(type: 'Chi' | 'Thu') {
    return this.categories.filter(c => c.type === type);
  }

  getSelectedCategoryName(): string {
    const cat = this.categories.find(c => c.id === this.formData.categoryId);
    return cat ? cat.name : '';
  }

  selectCategory(id: number) {
    this.formData.categoryId = id;
    this.isDropdownOpen = false;
  }

  toggleAddingCategory() {
    this.isAddingCategory = !this.isAddingCategory;
    this.isDropdownOpen = false;
    if (!this.isAddingCategory) {
      this.newCategoryName = '';
      this.formData.categoryId = 0;
    }
  }

  addNewCategory() {
    if (!this.newCategoryName) return;

    this.isSavingCategory = true;
    this.danhmucService.createCategory({
      name: this.newCategoryName,
      type: this.newCategoryType
    }).subscribe({
      next: (newCat) => {
        if (newCat.type === this.type) {
          this.loadCategories(newCat.id);
        } else {
          this.loadCategories();
        }
        
        this.isAddingCategory = false;
        this.isSavingCategory = false;
        this.newCategoryName = '';
        this.toastService.success('Đã thêm danh mục mới rùi nha! ✨');
      },
      error: (err: any) => {
        this.isSavingCategory = false;
        const errorMsg = err.error?.message || err.message || 'Lỗi không xác định';
        this.toastService.error(`Lỗi khi thêm danh mục: ${errorMsg}`);
      }
    });
  }

  deleteCategory(event: Event, cat: Category) {
    event.stopPropagation();
    this.categoryToDelete = cat;
    this.isConfirmingDelete = true;
  }

  cancelDelete() {
    this.isConfirmingDelete = false;
    this.categoryToDelete = null;
  }

  confirmDelete() {
    if (!this.categoryToDelete) return;
    const cat = this.categoryToDelete;

    this.danhmucService.deleteCategory(cat.id).subscribe({
      next: () => {
        this.toastService.success(`Đã xóa danh mục "${cat.name}" thành công! ✨`);
        this.loadCategories();
        this.isConfirmingDelete = false;
        this.categoryToDelete = null;
      },
      error: (err: any) => {
        console.error(err);
        const errorMsg = err.error?.message || err.message || 'Lỗi không xác định';
        this.toastService.error(errorMsg);
        this.isConfirmingDelete = false;
        this.categoryToDelete = null;
      }
    });
  }

  onSubmit() {
    const user = this.authService.currentUserValue;
    if (!user) return;

    if (this.formData.amount <= 0 || this.formData.categoryId === 0) {
      this.toastService.info('Vui lòng nhập đầy đủ thông tin nha!');
      return;
    }

    const request: TaoGiaoDichRequest = {
      userId: user.userId,
      categoryId: Number(this.formData.categoryId),
      amount: this.formData.amount,
      transactionDate: this.formData.transactionDate,
      note: this.formData.note
    };

    this.transactionService.taoGiaoDich(request).subscribe({
      next: () => {
        this.toastService.success('Đã thêm giao dịch thành công rùi nha! ✨');
        this.resetForm();
        this.transactionAdded.emit();
      },
      error: (err: any) => {
        console.error(err);
        this.toastService.error('Có lỗi gì đó mất tiêu rồi, thử lại sau nhé!');
      }
    });
  }

  resetForm() {
    this.formData.amount = 0;
    this.formData.categoryId = 0;
    this.formData.note = '';
  }
}
