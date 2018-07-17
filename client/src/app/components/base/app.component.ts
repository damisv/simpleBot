import {Component, PLATFORM_ID, Inject, HostListener} from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { OverlayContainer } from '@angular/cdk/overlay';
import {MaterialTheme, ThemeService} from '../../services/';
import {distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  // MARK: Properties
  theme = MaterialTheme.light;

  // MARK: Initialization
  constructor(private overlayContainer: OverlayContainer,
              @Inject(PLATFORM_ID) private platform: Object,
              private themeService: ThemeService) {
    themeService.currentTheme
      .pipe(distinctUntilChanged())
      .subscribe(theme => {
        this.theme = theme;
        overlayContainer.getContainerElement().classList.add(theme);
      });
  }
}
