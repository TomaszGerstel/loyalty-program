import { Component, OnInit } from '@angular/core';
import { StorageService } from '../service/storage.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
  standalone: false
})
export class SummaryComponent implements OnInit {
  entries: { phoneNumber: string; duration: number }[] = [];
  average = 0;

  constructor(private storage: StorageService) {}

  ngOnInit() {
    this.entries = this.storage.getEntries();
    if (this.entries.length) {
      const total = this.entries.reduce((sum, e) => sum + e.duration, 0);
      this.average = total / this.entries.length;
    }
  }

  clear() {
    this.storage.clear();
    this.entries = [];
    this.average = 0;
  }
}