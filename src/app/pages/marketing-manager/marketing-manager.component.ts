import { Component, ViewChild, SimpleChanges ,ChangeDetectorRef} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Card, CardStatus, Department, ERole } from 'src/app/models/all.model';
import { NotificationService } from 'src/app/_helpers/notification.service';
import { DialogService } from 'src/app/_helpers/dialog.service';


import { ImageDialogComponent } from 'src/app/_helpers/image-dialog/image-dialog.component';
import { UserRepairActionService } from 'src/app/services/user-repair-action.service';
import { MatSelectChange } from '@angular/material/select';
import { StorageService } from 'src/app/_services/storage.service';
import { CreateUpdateMarketingManagerComponent } from './create-update-marketing-manager/create-update-marketing-manager.component';

@Component({
  selector: 'app-marketing-manager',
  templateUrl: './marketing-manager.component.html',
  styleUrls: ['./marketing-manager.component.css']
})
export class MarketingManagerComponent {

  cards: Card[] = [];
  currentPage: number = 1;
  totalPages: number = -1;
  pageSize: number = 5;
  pageSizeOptions: number[] = [5,10,15,20];
  totalRecords: number = -1;

  cardStatuses: string[] = [
    CardStatus.DELIVERY_PENDING,
    CardStatus.READY_FOR_DELIVERY,
    CardStatus.WAITING_SPARE_PARTS,
    CardStatus.TECHNICALLY_REJECTED,
    CardStatus.UNDER_TEST,
    CardStatus.RETURN_NEEDS_FIX
  ];

  selectedCardStatuses: CardStatus[] = [CardStatus.WAITING_SPARE_PARTS];


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
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    public storageService: StorageService,
    private userRepairActionService: UserRepairActionService
  ) {

    if (this.storageService.hasRole(ERole.ROLE_ADMIN) ||
      this.storageService.hasRole(ERole.ROLE_MARKETING_HEAD)) {
      this.displayedColumns.push('assign_to');
    }
  }

  ngOnInit(): void {
    this.loadData();
  }
  onCardStatusChange(event: MatSelectChange) {
    this.selectedCardStatuses = event.value;
  }

  loadData(): void {
    this.userRepairActionService.getUserRepairActionsByCardStatusAndUserAndDepartment
    (this.currentPage, this.pageSize, this.selectedCardStatuses, Department.MARKETING).subscribe(
      (data: any) => {
        if (data) {
          debugger
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
    const dialogRef = this.dialog.open(CreateUpdateMarketingManagerComponent, dialogConfig);
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
