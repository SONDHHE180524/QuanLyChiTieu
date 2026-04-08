import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  LucideAngularModule,
  LogOut, Wallet, User, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  ArrowRightLeft, DollarSign, Calendar, Tag, CreditCard, ShoppingBag, Coffee,
  Home, Zap, Plus, X, Mail, Lock, UserPlus, Eye, EyeOff,
  Heart, Power, Sparkles, AlertCircle, Banknote, ChevronDown, History, Ghost,
  PieChart, KeyRound, ShieldCheck, Fingerprint, CheckCircle2, ArrowRightCircle, ArrowLeftCircle,
  Layout, ChevronLeft, ChevronRight, Camera, Settings, Trash2, PlusCircle
} from 'lucide-angular';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideCharts(withDefaultRegisterables()),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    importProvidersFrom(LucideAngularModule.pick({
      LogOut, Wallet, User, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
      ArrowRightLeft, DollarSign, Calendar, Tag, CreditCard, ShoppingBag, Coffee,
      Home, Zap, Plus, X, Mail, Lock, UserPlus, Eye, EyeOff,
      Heart, Power, Sparkles, AlertCircle, Banknote, ChevronDown, History, Ghost,
      PieChart, KeyRound, ShieldCheck, Fingerprint, CheckCircle2, ArrowRightCircle, ArrowLeftCircle,
      Layout, ChevronLeft, ChevronRight, Camera, Settings, Trash2, PlusCircle
    }))
  ]
};
