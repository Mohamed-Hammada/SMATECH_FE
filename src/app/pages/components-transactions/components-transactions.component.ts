import { Component, OnInit, ViewChild, SimpleChanges,ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Components, ComponentTransaction, TransactionType } from 'src/app/models/all.model';
import { NotificationService } from 'src/app/_helpers/notification.service';
import { DialogService } from 'src/app/_helpers/dialog.service';

import { CreateUpdateComponentTransactionComponent } from './create-update-component-transaction/create-update-component-transaction.component';
import { ComponentTransactionService } from 'src/app/services/component-transactions.service';
import { ImageDialogComponent } from 'src/app/_helpers/image-dialog/image-dialog.component';

@Component({
  selector: 'app-components-transactions',
  templateUrl: './components-transactions.component.html',
  styleUrls: ['./components-transactions.component.css']
})
export class ComponentsTransactionsComponent {
  transactions: ComponentTransaction[] = [];
  currentPage: number = 1;
  totalPages: number = -1;
  pageSize: number = 5;
  pageSizeOptions: number[] = [5,10,15,20,50,100,200,500];
  totalRecords: number = -1;
  displayedColumns: string[] = [ 'component',
   'TransactionQuantity', 'TransactionUnitPrice' , 'LatestUnitPrice' , "transactionDate", "component_image", 'actions'];
  searchKey: string = '';
  dataArray: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private componentTransactionService: ComponentTransactionService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.componentTransactionService.getComponentTransactions(this.currentPage, this.pageSize).subscribe(
      (data: any) => {
       
         this.prepareLoadData(data)
        
      },
      error => {
        this.notificationService.warn(error.message);
      }
    );
  }


prepareLoadData(data:any):void{
  if(!data) { return}
  this.transactions = data.data;
  this.totalPages = data['total_pages'];

  this.totalRecords = data['total_count']
  this.currentPage = data['page']
  this.totalPages = data['total_pages'];
  this.pageSize = data['size']
  this.dataArray.data = this.transactions;

  if (this.paginator) {
    this.paginator.pageIndex = this.currentPage - 1;
    this.paginator.pageSize = this.pageSize;
    this.paginator.length = this.totalRecords;
    this.cdr.detectChanges(); // Trigger change detection
  }
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
    this.componentTransactionService.initializeFormGroup();
    this.openTransactionDialog();
  }

  onEdit(row: any): void {
    this.componentTransactionService.initializeFormGroup();
    this.componentTransactionService.populateForm(this.transactions.filter(e=>e.id===row.id)[0]);
    this.openTransactionDialog();
  }

  private openTransactionDialog(): void {
    const dialogConfig = this.getDialogConfig();
    const dialogRef = this.dialog.open(CreateUpdateComponentTransactionComponent, dialogConfig);
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
          this.componentTransactionService.deleteById($key).subscribe(
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
    this.componentTransactionService.searchByString(this.currentPage, this.pageSize,this.searchKey).subscribe(
      (data: any) => {
       
         this.prepareLoadData(data)
     
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
