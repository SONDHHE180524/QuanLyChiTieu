import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface GiaoDich {
  id: number;
  amount: number;
  transactionDate: string;
  note?: string;
  tenDanhMuc: string;
  loai: string;
}

export interface TaoGiaoDichRequest {
  userId: number;
  categoryId: number;
  amount: number;
  transactionDate: string;
  note?: string;
}

export interface CategoryStat {
  tenDanhMuc: string;
  amount: number;
  color: string;
}

export interface MonthlyStat {
  monthName: string;
  income: number;
  expense: number;
}

export interface ThongKeDashboard {
  tongThu: number;
  tongChi: number;
  soDu: number;
  phanBoChiTieu: CategoryStat[];
  xuHuongHangThang: MonthlyStat[];
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/GiaoDich`;

  getLichSuGiaoDich(userId: number): Observable<GiaoDich[]> {
    return this.http.get<GiaoDich[]>(`${this.apiUrl}/${userId}`);
  }

  taoGiaoDich(request: TaoGiaoDichRequest): Observable<any> {
    return this.http.post(this.apiUrl, request);
  }

  getThongKeDashboard(userId: number): Observable<ThongKeDashboard> {
    return this.http.get<ThongKeDashboard>(`${this.apiUrl}/dashboard/${userId}`);
  }
}
