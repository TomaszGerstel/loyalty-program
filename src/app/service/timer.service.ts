import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TimerService {
  private startTime: number | null = null;

  start() {
    this.startTime = performance.now();
  }

  stop(): number {
    if (!this.startTime) return 0;
    const duration = (performance.now() - this.startTime) / 1000;
    this.startTime = null;
    return parseFloat(duration.toFixed(2));
  }

  getElapsed(): number {
    if (!this.startTime) return 0;
    const duration = (performance.now() - this.startTime) / 1000;
    return parseFloat(duration.toFixed(2));
  }

  isRunning() {
    return this.startTime !== null;
  }
}
