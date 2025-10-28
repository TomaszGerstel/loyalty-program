import { Component } from '@angular/core';
import { TimerService } from './service/timer.service';
import { StorageService } from './service/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent {
  activePrefix: string | null = null;
  activeOperator: string | null = null;

  rows = [
    { id: 1, boxes: ['06', '90', '', '', ''], locked: 2 },
    { id: 2, boxes: ['07', '96'], locked: 2 },
    { id: 3, boxes: ['', ''], locked: 1 }
  ];

  lastResult: { phoneNumber: string; duration: number } | null = null;

  constructor(private timer: TimerService, private storage: StorageService) {}

  selectPrefix(prefix: string) {
    this.reset();
    this.activePrefix = prefix;
  }

  selectOperator(operator: string) {
    this.rows[2].boxes = ['', ''];
    this.activeOperator = operator;
  }

  onKeyPressed(digit: string) {

    if (this.rows[0].boxes.slice(2).every(b => (b || '').length === 2)) {
      // all number boxes filled
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
      // no operator selected > fill custom operator (row 3, box 1)
      const customRow = this.rows[2];
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
    const operatorReady = this.activeOperator || (this.rows[2].boxes[1]?.length === 2);

    if (numberReady && operatorReady) {
      const duration = this.timer.stop();
      const prefix = this.activePrefix;
      const operator = this.activeOperator || this.rows[2].boxes[1];
      const rest = mainRow.boxes.slice(startIndex).join('');
      const result = `${prefix}${operator}${rest}`;

      this.storage.saveEntry(result, duration);
      this.lastResult = { phoneNumber: result, duration };

      // alert(`✅ ${result} entered in ${duration.toFixed(2)}s`);

      // reset
      // for (let i = startIndex; i < mainRow.boxes.length; i++) mainRow.boxes[i] = '';
      // this.rows[2].boxes[1] = '';
    }
  }

  reset() {
    this.activePrefix = null;
    this.activeOperator = null;
    // this.timer.reset();
    this.rows[0].boxes = ['06', '90', '', '', ''];
    this.rows[2].boxes = ['', ''];
    this.lastResult = null;
  }
}
