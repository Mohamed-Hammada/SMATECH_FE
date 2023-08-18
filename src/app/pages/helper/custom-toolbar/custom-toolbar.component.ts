import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-toolbar',
  templateUrl: './custom-toolbar.component.html',
  styleUrls: ['./custom-toolbar.component.css']
})
export class CustomToolbarComponent {
  // Define an Input property named title
  @Input() title: string = '';

  constructor() { }
}
