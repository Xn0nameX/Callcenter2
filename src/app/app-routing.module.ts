import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ReportingComponent} from "./reporting/reporting.component";

const routes: Routes = [

  { path: 'reports', component: ReportingComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
