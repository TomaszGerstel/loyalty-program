import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  saveEntry(phoneNumber: string, duration: number, ovverideLast = false) {
    const entry = {
      phoneNumber,
      duration,
      timestamp: new Date().toISOString(),
    };
    const entries = JSON.parse(localStorage.getItem('entries') || '[]');
    if (ovverideLast && entries.length) {
      entries[entries.length - 1] = entry;
    } else {
      entries.push(entry);
    }
    localStorage.setItem('entries', JSON.stringify(entries));
  }

  getEntries() {
    return JSON.parse(localStorage.getItem('entries') || '[]');
  }

  clear() {
    localStorage.removeItem('entries');
  }
}
