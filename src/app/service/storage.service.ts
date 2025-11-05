import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  saveEntry(phoneNumber: string, duration: number) {
    const entry = {
      phoneNumber,
      duration,
      timestamp: new Date().toISOString(),
    };
    const entries = JSON.parse(localStorage.getItem('entries') || '[]');
    entries.push(entry);
    localStorage.setItem('entries', JSON.stringify(entries));
  }

  getEntries() {
    return JSON.parse(localStorage.getItem('entries') || '[]');
  }

  clear() {
    localStorage.removeItem('entries');
  }

}
