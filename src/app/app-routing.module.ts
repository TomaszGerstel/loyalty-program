import { RouterModule, Routes } from '@angular/router';
import { SummaryComponent } from './summary/summary.component';
import { NgModule } from '@angular/core';
import { FormComponent } from './form/form.component';

const routes: Routes = [
  { path: '', component: FormComponent },
  { path: 'summary', component: SummaryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}