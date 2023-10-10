import { Component, OnInit, ViewChild, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Components, Card, TransactionType, CardStatus, Department, ERole } from 'src/app/models/all.model';
import { NotificationService } from 'src/app/_helpers/notification.service';
import { DialogService } from 'src/app/_helpers/dialog.service';


import { ImageDialogComponent } from 'src/app/_helpers/image-dialog/image-dialog.component';
import { UserRepairActionService } from 'src/app/services/user-repair-action.service';
import { MatSelectChange } from '@angular/material/select';
import { StorageService } from 'src/app/_services/storage.service';
import { CreateUpdateTechStateComponent } from './create-update-tech-state/create-update-tech-state.component';


@Component({
  selector: 'app-tech-state',
  templateUrl: './tech-state.component.html',
  styleUrls: ['./tech-state.component.css']
})
export class TechStateComponent {

  cards: Card[] = [];
  currentPage: number = 1;
  totalPages: number = -1;
  pageSize: number = 10;

  cardStatuses: string[] = [
    CardStatus.UNDER_REPAIR_PENDING_ASSIGNMENT,
    CardStatus.UNDER_REPAIR,
    CardStatus.READY_FOR_DELIVERY,
    CardStatus.WAITING_SPARE_PARTS,
    CardStatus.TECHNICALLY_REJECTED,
    CardStatus.DELIVERY_PENDING,
    CardStatus.UNDER_TEST,
    CardStatus.RETURN_NEEDS_FIX
  ];

  selectedCardStatuses: CardStatus[] = [];


  displayedColumns: string[] = [
    'serial_no',
    'issue_description',
    'card_state',
    'no_of_card_pieces',
    'component_image',
    'createdAt',
    'actions'
  ];

  searchKey: string = '';
  dataArray: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private dialogService: DialogService,
    public storageService: StorageService,
    private userRepairActionService: UserRepairActionService
  ) {

    if (this.storageService.hasRole(ERole.ROLE_ADMIN) ||
      this.storageService.hasRole(ERole.ROLE_REPAIR_TECHNICIAN_HEAD)) {
      this.displayedColumns.push('assign_to');
    }
  }

  ngOnInit(): void {
    // debugger
    this.selectedCardStatuses.push(CardStatus.UNDER_REPAIR_PENDING_ASSIGNMENT);
    this.loadData();
  }
  onCardStatusChange(event: MatSelectChange) {
    this.selectedCardStatuses = event.value;
  }

  loadData(): void {
    this.userRepairActionService.getUserRepairActionsByCardStatusAndUserAndDepartment(this.currentPage, this.pageSize, this.selectedCardStatuses, Department.ACCOUNT).subscribe(
      (data: any) => {
        if (data) {
          this.cards = data.data;
          this.totalPages = data['total_pages'];
          this.initializeTable(data.data);
        }
      },
      error => {
        this.notificationService.warn(error.message);
      }
    );
  }

  private initializeTable(transactions: Card[]): void {
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
    this.userRepairActionService.initializeFormGroup();
    this.openTransactionDialog();
  }

  onEdit(row: any): void {
    this.userRepairActionService.initializeFormGroup();
    this.userRepairActionService.populateForm(this.cards.filter(e => e.id === row.id)[0]);
    this.openTransactionDialog();
  }

  private openTransactionDialog(): void {
    const dialogConfig = this.getDialogConfig();
    const dialogRef = this.dialog.open(CreateUpdateTechStateComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      this.loadData();
    });
  }

  private getDialogConfig(): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    return dialogConfig;
  }

  onDelete($key: any): void {
    this.dialogService.openConfirmDialog('Are You Sure?')
      .afterClosed().subscribe((res: any) => {
        if (res) {
          this.userRepairActionService.deleteById($key).subscribe(
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
