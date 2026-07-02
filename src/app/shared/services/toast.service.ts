import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
export interface Toast {

  message: string;

  type: 'success' | 'error';

}
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toast = new BehaviorSubject<Toast | null>(null);
  toast$ = this.toast.asObservable();
  constructor() { }
  success(message: string) {

    this.toast.next({
      message,
      type: 'success'
    });

    setTimeout(() => {
      this.toast.next(null);
    }, 3000);

  }

  error(message: string) {

    this.toast.next({
      message,
      type: 'error'
    });

    setTimeout(() => {
      this.toast.next(null);
    }, 3000);

  }
}
