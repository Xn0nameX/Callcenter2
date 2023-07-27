import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReportingComponent } from './reporting/reporting.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { FormsModule } from '@angular/forms';
import { Moment } from 'moment';
import * as moment from 'moment';

@NgModule({
  declarations: [
    AppComponent,
    ReportingComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
