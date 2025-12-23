import { Component } from '@angular/core';
import { Pocha } from './pocha/pocha';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [Pocha],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  constructor(private title: Title) {
    this.title.setTitle('PochApp');
  }
}
