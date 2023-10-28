# SmartTech

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.



----

Alright, let's get started on converting the table view to a card view.

### Step 1: Update HTML
Replace the `<mat-table>` component in the template with Angular Material cards. Below is a possible layout for your card:

```html
<div class="card-container" *ngFor="let row of dataArray.data">
  <mat-card (click)="onCardClick(row)">
    <mat-card-header>
      <mat-card-title>{{ row.card.serial_no }}</mat-card-title>
    </mat-card-header>
    <img mat-card-image [src]="row.card.component_image" alt="Card Image">
    <mat-card-content>
      <p>{{ row.card.issue_description }}</p>
    </mat-card-content>
    <mat-card-actions>
      <button mat-button (click)="onEdit(row)">Edit</button>
      <button mat-button (click)="onViewImage(row.card.component_image)">View</button>
      <!-- Add other actions here -->
    </mat-card-actions>
  </mat-card>
</div>

<mat-paginator showFirstLastButtons 
                          [pageSize]="pageSize" 
                          [pageSizeOptions]="pageSizeOptions" 
                          (page)="pageEvent($event)" 
                          [length]="totalRecords">
</mat-paginator>
```

### Step 2: Update CSS
To ensure that the cards look good, add some styles:

```css
.card-container {
  padding: 10px;
  display: inline-block;
}

mat-card {
  width: 300px;
  margin: 10px;
  cursor: pointer;
}
```

### Step 3: Implement onCardClick
When a card is clicked, you can navigate to a details page or show a modal with details:

```typescript
onCardClick(row: any): void {
  // Navigate to details page or show a dialog with details
  console.log(row);
}
```

### Step 4: Create a Card Details Component
You might need to create a separate component for the card details if you don't already have one. This component will show the full details of the card and action buttons. 

### Step 5: Update Routing (If needed)
If you decide to navigate to a different component for the details view, update your Angular routes to handle this navigation.

---

By following these steps, you'll replace the table with cards. Depending on your exact requirements and existing setup, you might need to make some adjustments. Make sure to test the changes thoroughly to ensure everything works as expected.


Of course! Let's create a detailed component that will be shown when a card is clicked.

### Step 1: Create a new component for the card details

You can use Angular CLI to generate a new component:

```bash
ng generate component card-details
```

### Step 2: Define the component's HTML (`card-details.component.html`)

```html
<mat-card>
  <mat-card-header>
    <mat-card-title>{{ cardDetail?.card.serial_no }}</mat-card-title>
  </mat-card-header>
  <img mat-card-image [src]="cardDetail?.card.component_image" alt="Card Image">
  <mat-card-content>
    <p>{{ cardDetail?.card.issue_description }}</p>
    <!-- Add other details here -->
  </mat-card-content>
  <mat-card-actions>
    <button mat-button (click)="onEdit()">Edit</button>
    <button mat-button (click)="onViewImage()">View Image</button>
    <!-- Add other actions here -->
  </mat-card-actions>
</mat-card>
```

### Step 3: Define the component's TypeScript (`card-details.component.ts`)

```typescript
import { Component, OnInit, Input } from '@angular/core';
import { Card } from 'path-to-your-card-model';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.css']
})
export class CardDetailsComponent implements OnInit {

  @Input() cardDetail: Card;

  constructor() { }

  ngOnInit(): void {
  }

  onEdit(): void {
    // Implement edit functionality
  }

  onViewImage(): void {
    // Implement view image functionality
  }

  // Add other methods for actions here

}
```

### Step 4: Use the `CardDetailsComponent` in your main component

In your main component, when a card is clicked, you can either navigate to a new route with the `CardDetailsComponent` or display it in a modal dialog.

For the latter, you can use Angular Material's `MatDialog`:

```typescript
// ... other imports ...
import { MatDialog } from '@angular/material/dialog';
import { CardDetailsComponent } from 'path-to-card-details-component';

// ... inside your main component class ...

onCardClick(row: any): void {
  const dialogRef = this.dialog.open(CardDetailsComponent, {
    width: '70%',
    data: { cardDetail: row }
  });
}
```

For the former, you will need to set up Angular routing and navigate to the new route passing the card data.

---

This is a basic setup for your card details component. Depending on your exact requirements, you might need to adjust or add more functionalities. Make sure to link up any required services or functionalities that are needed to fully operate on the card details.