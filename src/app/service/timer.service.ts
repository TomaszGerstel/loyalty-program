import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TimerService {
  private startTime: number | null = null;

  start() {
    this.startTime = performance.now();
    console.log("timer started");
  }

  stop(): number {
    if (!this.startTime) return 0;
    const duration = (performance.now() - this.startTime) / 1000;
    this.startTime = null;
    console.log("timer stopped");
    return parseFloat(duration.toFixed(3));
  }

  getElapsed(): number {
    if (!this.startTime) return 0;
    const duration = (performance.now() - this.startTime) / 1000;
    return parseFloat(duration.toFixed(3));
  }

  isRunning() {
    return this.startTime !== null;
  }
}
