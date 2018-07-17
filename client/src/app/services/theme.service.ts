import {Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum MaterialTheme {
  light = 'light-theme',
  dark = 'dark-theme'
}

@Injectable()
export class ThemeService {
  private _currentTheme = new BehaviorSubject<MaterialTheme>(MaterialTheme.dark);
  currentTheme = this._currentTheme.asObservable();

  constructor() {}

  public changeThemeTo(theme: MaterialTheme) {
    this._currentTheme.next(theme);
  }
}
