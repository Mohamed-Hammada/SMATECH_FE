import { Component, OnInit, ViewChild, SimpleChanges ,ChangeDetectorRef} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Components, Card, TransactionType } from 'src/app/models/all.model';
import { NotificationService } from 'src/app/_helpers/notification.service';
import { DialogService } from 'src/app/_helpers/dialog.service';


import { ImageDialogComponent } from 'src/app/_helpers/image-dialog/image-dialog.component';
import { CardService } from 'src/app/services/card.service';
import { CreateUpdateCardComponent } from './create-update-card/create-update-card.component';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  cards: Card[] = [];
  currentPage: number = 1;
  totalPages: number = -1;
  pageSize: number = 5;
  pageSizeOptions: number[] = [5,10,15,20,50,100,200,500];
  totalRecords: number = -1;
  displayedColumns: string[] = [
    // 'id',
    'serial_no',
    'issue_description',
    'company',
    // 'suggested_offer_repair_cost',
    // 'repair_cost',
    // 'amount_paid',
    'warranty_period_per_days',
    'card_state',
    'no_of_card_pieces',
    // 'logged_in_user',
    'deliver_card_user',

    'createdAt'
    // ,'updatedAt'
    , 'actions'
  ];

  searchKey: string = '';
  dataArray: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private cardService: CardService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.cardService.getCards(this.currentPage, this.pageSize).subscribe(
      (data: any) => {
        if (data) {
          this.cards = data.data;
          this.totalPages = data['total_pages'];
          this.totalRecords = data['total_count']
          this.currentPage = data['page']
          this.totalPages = data['total_pages'];
          this.pageSize = data['size']
          this.dataArray.data = this.cards;
          if (this.paginator) {
            this.paginator.pageIndex = this.currentPage - 1;
            this.paginator.pageSize = this.pageSize;
            this.paginator.length = this.totalRecords;
            this.cdr.detectChanges(); // Trigger change detection
          }

        }
      },
      error => {
        this.notificationService.warn(error.message);
      }
    );
  }

  prevPage(): void {

    this.currentPage--;
    this.loadData();

  }

  nextPage(): void {
    this.currentPage++;
    this.loadData();
  }

  pageEvent(event: any): void {
    debugger
    // Page size changed
    if (event.pageSize !== this.pageSize) {
      this.pageSizeChanged(event);
    }
    // Next page
    else if (event.pageIndex > event.previousPageIndex) {
      this.nextPage();
    }
    // Previous page
    else if (event.pageIndex < event.previousPageIndex) {
      this.prevPage();
    }
  }

  pageSizeChanged(event: any): void {
    this.pageSize = event.pageSize;
    this.currentPage = 1;  // Reset to the first page when changing page size
    this.loadData();
  }

  onCreate(): void {
    this.cardService.initializeFormGroup();
    this.openTransactionDialog();
  }

  onEdit(row: any): void {
    this.cardService.initializeFormGroup();
    this.cardService.populateForm(this.cards.filter(e => e.id === row.id)[0]);
    this.openTransactionDialog();
  }

  private openTransactionDialog(): void {
    const dialogConfig = this.getDialogConfig();
    const dialogRef = this.dialog.open(CreateUpdateCardComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      this.loadData();
    });
  }

  private getDialogConfig(): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    return dialogConfig;
  }

  onDelete($key: any): void {
    this.dialogService.openConfirmDialog('Are You Sure?')
      .afterClosed().subscribe((res: any) => {
        if (res) {
          this.cardService.deleteById($key).subscribe(
            () => {
              this.notificationService.success('Successfully Deleted');
              this.loadData();
            },
            error => {
              this.notificationService.warn(error.message)
            }
          );
        }
      });
  }

  onSearchClear(): void {
    this.searchKey = '';
    this.applyFilter();
  }

  applyFilter(): void {
   // this.dataArray.filter = this.searchKey.trim().toLowerCase();
   this.cardService.searchByString( this.currentPage, this.pageSize,this.searchKey).subscribe(
    (data: any) => {
      if (data) {
        this.cards = data.data;
        this.totalPages = data['total_pages'];
        this.totalRecords = data['total_count']
        this.currentPage = data['page']
        this.totalPages = data['total_pages'];
        this.pageSize = data['size']
        this.dataArray.data = this.cards;
        if (this.paginator) {
          this.paginator.pageIndex = this.currentPage - 1;
          this.paginator.pageSize = this.pageSize;
          this.paginator.length = this.totalRecords;
          this.cdr.detectChanges(); // Trigger change detection
        }

      }
    },
    error => {
      this.notificationService.warn(error.message);
    }
  );
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadData();
  }

  onViewImage(imageBase64: string) {
    // Create a new window and set its content to the base64 image
    // const imageWindow = window.open();
    // imageWindow?.document.write('<img src="' + imageBase64 + '" />');
    // imageWindow?.document.close();
    this.dialog.open(ImageDialogComponent, {
      data: { imageBase64: imageBase64 }
    });
  }

  exportAsXLSX(): void {
    // Functionality for exporting data as XLSX file
  }

}
