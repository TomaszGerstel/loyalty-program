import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-keypad',
  templateUrl: './keypad.component.html',
  styleUrls: ['./keypad.component.scss'],
  standalone: false
})
export class KeypadComponent {
  @Output() keyPressed = new EventEmitter<string>();
  keys = ['1','2','3','4','5','6','7','8','9','0'];

  pressKey(key: string) {
    this.keyPressed.emit(key);
  }
}
