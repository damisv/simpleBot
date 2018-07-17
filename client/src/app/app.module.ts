import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppComponent, LoginComponent } from './components';
import {AppRoutingModule, MaterialModule} from './modules';
import {AuthService, DialogService, ThemeService} from './services';
import {SimpleDialogComponent, DialogComponent} from "./components/dialog/";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SimpleDialogComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers: [
    ThemeService,
    AuthService,
    DialogService
  ],
  entryComponents: [ SimpleDialogComponent, DialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
