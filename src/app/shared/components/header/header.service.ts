import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private _showHeader = new BehaviorSubject<boolean>(false);
  isShowHeader$ = this._showHeader.asObservable();

  showHeader(value: boolean): void {
    this._showHeader.next(value);
  }
}
