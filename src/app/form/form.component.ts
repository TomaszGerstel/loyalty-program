import { Component } from '@angular/core';
import { TimerService } from '../service/timer.service';
import { StorageService } from '../service/storage.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  standalone: false
})
export class FormComponent {
  activePrefix: string | null = null;
  activeOperator: string | null = null;

  rows = [
    { id: 1, boxes: ['', '', '', '', ''], locked: 2 },
    { id: 2, boxes: ['06', '90'], locked: 2 },
    { id: 3, boxes: ['07', '96'], locked: 2 }
  ];

  lastResult: { phoneNumber: string; duration: number } | null = null;

  constructor(private timer: TimerService, private storage: StorageService) {}

  selectPrefix(prefix: string) {
    this.reset();
    this.activePrefix = prefix;
    this.rows[0].boxes[0] = prefix;
  }

  selectOperator(operator: string) {
    if (!this.activePrefix) {
      alert('Please select a prefix first');
      return;
    }
    this.rows[2].boxes = ['', ''];
    this.activeOperator = operator;
    this.rows[0].boxes[1] = operator;
  }

  onKeyPressed(digit: string) {

    if (this.rows[0].boxes.every(b => (b || '').length === 2)) {
      // all number boxes filled
      return;
    }

    if (digit === 'BACK') {
      this.handleBackspace();
      return;
    }

    if (!this.activePrefix) {
      alert('Please select a prefix first');
      return;
    }

    const mainRow = this.rows[0];
    const startIndex = mainRow.locked;

    // Start timer when first key pressed
    if (!this.timer.isRunning()) this.timer.start();

    if (!this.activeOperator) {
      // no operator selected > fill custom operator (row 1, box 2)
      const customRow = this.rows[0];
      const current = customRow.boxes[1] || '';
      if (current.length < 2) {
        customRow.boxes[1] = current + digit;
        return; // don't start filling number until operator ready
      }
    }

    // Fill number boxes (main row, last 3 boxes)
    const targetIndex = mainRow.boxes.findIndex((b, i) => i >= startIndex && (b || '').length < 2);
    if (targetIndex !== -1) {
      mainRow.boxes[targetIndex] = (mainRow.boxes[targetIndex] || '') + digit;
    }

    // check if number entry complete
    const numberReady = mainRow.boxes.slice(startIndex).every(b => (b || '').length === 2);
    const operatorReady = this.activeOperator || (this.rows[0].boxes[1]?.length === 2);

    if (numberReady && operatorReady) {
      const duration = this.timer.stop();
      const prefix = this.activePrefix;
      const operator = this.activeOperator || this.rows[0].boxes[1];
      const rest = mainRow.boxes.slice(startIndex).join('');
      const result = `${prefix}${operator}${rest}`;

      this.storage.saveEntry(result, duration);
      this.lastResult = { phoneNumber: result, duration };

      // alert(`✅ ${result} entered in ${duration.toFixed(2)}s`);
    }
  }

  reset() {
    this.activePrefix = null;
    this.activeOperator = null;
    this.rows[0].boxes = ['', '', '', '', ''];
    this.lastResult = null;
    this.timer.start();
  }

  handleBackspace() {
    const mainRow = this.rows[0];
    const startIndex = mainRow.locked;

    // remove from number boxes first
    for (let i = mainRow.boxes.length - 1; i >= startIndex; i--) {
      if (mainRow.boxes[i]) {
        mainRow.boxes[i] = mainRow.boxes[i].slice(0, -1);
        if (!mainRow.boxes[i]) mainRow.boxes[i] = '';
        return;
      }
    }

    // if no operator selected, backspace custom operator
    if (this.rows[0].boxes[1]) {
      const cur = this.rows[0].boxes[1];
      this.rows[0].boxes[1] = cur.slice(0, -1);
      this.activeOperator = null;
    }
    else { // backspace prefix
      this.activePrefix = null;
      this.rows[0].boxes[0] = '';
    }
  }
}

