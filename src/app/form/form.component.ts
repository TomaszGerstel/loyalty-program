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
  visibleOperatorsBoxes = true;

  isComplete = false;
  isResumption = false;

  rows = [
    { id: 1, boxes: ['', '', '', '', ''], locked: 2 },
    { id: 2, boxes: ['06', '90'], locked: 2 },
    { id: 3, boxes: ['07', '96'], locked: 2 }
  ];

  lastResult: { phoneNumber: string; duration: number } | null = null;

  constructor(private timer: TimerService, private storage: StorageService) {}

  selectPrefix(prefix: string) {
    // hide incompatible operator boxes
    this.visibleOperatorsBoxes = prefix !== '07';
    this.reset();
    this.timer.start();
    this.activePrefix = prefix;
    this.rows[0].boxes[0] = prefix;
  }

  selectOperator(operator: string) {
    // Start timer when first key pressed
    if (!this.timer.isRunning()) this.timer.start();
    if (this.isComplete || this.rows[0].boxes[0].length < 2) return;
    this.activeOperator = operator;
    this.rows[0].boxes[1] = operator;
  }

  onKeyPressed(digit: string) {

    if (digit === 'BACK') {
      this.handleBackspace();
      return;
    }

    if (digit === 'RESET') {
      this.timer.stop();
      this.reset();
      return;
    }

    // if (!this.activePrefix) {
    //   alert('Please select a prefix first');
    //   return;
    // }

    if (this.rows[0].boxes.every(b => (b || '').length === 2)) {
      // all number boxes filled
      return;
    }

    const mainRow = this.rows[0];
    const startIndex = mainRow.locked;

    // Start timer when first key pressed
    if (!this.timer.isRunning()) this.timer.start();

    if (!this.activePrefix) {
      // no prefix selected > fill prefix box (row 1, box 1)
      const current = mainRow.boxes[0] || '';

      if (current.length < 2) {
        mainRow.boxes[0] = current + digit;
        this.visibleOperatorsBoxes = mainRow.boxes[0] !== '07';
        return; // don't start filling number until prefix ready
      }
    }

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
      this.completeEntry();
    }
  }

  reset() {
    this.activePrefix = null;
    this.activeOperator = null;
    this.isComplete = false;
    this.rows[0].boxes = ['', '', '', '', ''];
    this.lastResult = null;
    this.isResumption = false;
  }

  handleBackspace() {
    const mainRow = this.rows[0];
    const startIndex = mainRow.locked;

    // if user deletes after completion, reopen entry
    if (this.isComplete) {
      this.isComplete = false;
      this.isResumption = true;

    }

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
      const cur = this.rows[0].boxes[0];
      this.rows[0].boxes[0] = cur.slice(0, -1);
      this.visibleOperatorsBoxes = true;
      this.activePrefix = null;
    }

    // all boxes are empty
    if (mainRow.boxes.every(b => b === '')) {
      this.reset();
      this.timer.stop();
    }
  }

  completeEntry() {
    const mainRow = this.rows[0];
    const startIndex = mainRow.locked;
    const duration = this.timer.getElapsed();

    const prefix = this.activePrefix || mainRow.boxes[0];
    const operator = this.activeOperator || mainRow.boxes[1];
    const rest = mainRow.boxes.slice(startIndex).join('');
    const result = `${prefix}${operator}${rest}`;

    this.isComplete = true;
    this.lastResult = { phoneNumber: result, duration };

    // Override last entry for same session
    const ovverideLast = this.isResumption;
    this.storage.saveEntry(result, duration, ovverideLast);
  }
}

