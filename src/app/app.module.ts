import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { KeypadComponent } from "./keypad/keypad.component";
import { BrowserModule } from "@angular/platform-browser";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { SummaryComponent } from "./summary/summary.component";
import { FormComponent } from "./form/form.component";
import { AppRoutingModule } from "./app-routing.module";
import { MatButtonModule, MatFabButton } from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    KeypadComponent,
    SummaryComponent,
    FormComponent
  ],
  imports: [
    BrowserModule,
    MatToolbarModule,
    FormsModule,
    MatTableModule,
    AppRoutingModule,
    MatButtonModule,
    MatFabButton
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }