import { Component, OnInit, ViewChild, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Components, ComponentTransaction, TransactionType } from 'src/app/models/all.model';
import { NotificationService } from 'src/app/_helpers/notification.service';
import { DialogService } from 'src/app/_helpers/dialog.service';

import { CreateUpdateComponentTransactionComponent } from './create-update-component-transaction/create-update-component-transaction.component';
import { ComponentTransactionService } from 'src/app/services/component-transactions.service';

@Component({
  selector: 'app-components-transactions',
  templateUrl: './components-transactions.component.html',
  styleUrls: ['./components-transactions.component.css']
})
export class ComponentsTransactionsComponent {
  transactions: ComponentTransaction[] = [];
  currentPage: number = 1;
  totalPages: number = -1;
  pageSize: number = 10;
  displayedColumns: string[] = [ 'ProductName',
   'TransactionQuantity', 'TransactionUnitPrice', 'LatestUnitPrice' , "transactionDate", 'actions'];
  searchKey: string = '';
  dataArray: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private componentTransactionService: ComponentTransactionService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.componentTransactionService.getComponentTransactions(this.currentPage, this.pageSize).subscribe(
      (data: any) => {
        if (data) {
          this.transactions = data.data;
          this.totalPages = data['total_pages'];
          this.initializeTable(data.data);
        }
      },
      error => {
        this.notificationService.warn(error.message);
      }
    );
  }

  private initializeTable(transactions: ComponentTransaction[]): void {
    this.dataArray = new MatTableDataSource(transactions);
    this.dataArray.paginator = this.paginator;
    this.dataArray.filterPredicate = (data: any, filterValue: string) => {
      return JSON.stringify(data).toLowerCase().includes(filterValue);
    };
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadData();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadData();
    }
  }

  pageChanged(event: any): void {
    this.pageSize = event.pageSize;
    if (event.pageIndex > event.previousPageIndex) {
      this.nextPage();
    } else {
      this.prevPage();
    }
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
    this.dataArray.filter = this.searchKey.trim().toLowerCase();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadData();
  }

  exportAsXLSX(): void {
    // Functionality for exporting data as XLSX file
  }

}
