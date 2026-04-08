import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../../core/services/toast.service';
import { LucideAngularModule } from 'lucide-angular';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="fixed top-24 right-10 z-[100] flex flex-col gap-4 pointer-events-none">
      <div 
        *ngFor="let toast of toasts$ | async; trackBy: trackByFn"
        [@toastAnimation]
        class="pointer-events-auto min-w-[300px] max-w-md p-5 rounded-[2.5rem] shadow-2xl backdrop-blur-md flex items-center gap-4 border-4 border-white transition-all transform hover:scale-105"
        [ngClass]="{
          'bg-teal-50/90 text-teal-700': toast.type === 'success',
          'bg-rose-50/90 text-rose-700': toast.type === 'error',
          'bg-indigo-50/90 text-indigo-700': toast.type === 'info'
        }"
      >
        <!-- Icon -->
        <div 
          class="p-2.5 rounded-2xl shadow-sm"
          [ngClass]="{
            'bg-teal-500/10': toast.type === 'success',
            'bg-rose-500/10': toast.type === 'error',
            'bg-indigo-500/10': toast.type === 'info'
          }"
        >
          <lucide-icon 
            [name]="toast.type === 'success' ? 'check-circle-2' : (toast.type === 'error' ? 'alert-circle' : 'info')" 
            [size]="24"
          ></lucide-icon>
        </div>

        <!-- Message -->
        <div class="flex-grow">
          <p class="text-sm font-black tracking-tight leading-tight">{{ toast.message }}</p>
        </div>

        <!-- Close Button -->
        <button 
          (click)="toastService.remove(toast.id)"
          class="p-1 hover:bg-black/5 rounded-full transition-colors"
        >
          <lucide-icon name="x" [size]="16" class="opacity-40"></lucide-icon>
        </button>
      </div>
    </div>
  `,
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(-100%) scale(0.8)', opacity: 0 }),
        animate('400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)', style({ transform: 'translateY(0) scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.6, -0.28, 0.735, 0.045)', style({ transform: 'translateY(-100%) scale(0.8)', opacity: 0 }))
      ])
    ])
  ]
})
export class ToastComponent {
  toastService = inject(ToastService);
  toasts$ = this.toastService.toasts$;

  trackByFn(index: number, item: ToastMessage) {
    return item.id;
  }
}
