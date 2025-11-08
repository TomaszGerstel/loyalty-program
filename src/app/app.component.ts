import { Component, inject, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent implements AfterViewInit {
  private readonly router = inject(Router)

  title = 'loyalty-program';

  ngAfterViewInit() {
    window.addEventListener('orientationchange', () => {
      console.log('view loaded!');
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.body.style.overflowX = 'hidden';
      }, 300);
    });
  }
}
