import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { KeypadComponent } from "./keypad/keypad.component";
import { BrowserModule } from "@angular/platform-browser";
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { EntryRowComponent } from "./entry-row/entry-row.component";

@NgModule({
  declarations: [
    AppComponent,
    KeypadComponent,
    EntryRowComponent
  ],
  imports: [
    BrowserModule,
    MatToolbarModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }