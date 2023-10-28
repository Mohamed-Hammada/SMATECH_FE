import { Component, OnInit, Input } from '@angular/core';
import { UserRepairAction } from 'src/app/models/all.model';


@Component({
  selector: 'app-tech-state-card-details',
  templateUrl: './tech-state-card-details.component.html',
  styleUrls: ['./tech-state-card-details.component.css']
})
export class TechStateCardDetailsComponent {

  @Input() cardDetail!: UserRepairAction;

  constructor() { }

  ngOnInit(): void {
  }

  onEdit(): void {
    // Implement edit functionality
  }

  onViewImage(): void {
    // Implement view image functionality
  }


}
