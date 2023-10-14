import { Component, OnInit, ViewChild, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { CardStatusLifeCycleMatrixRoles, Role } from 'src/app/models/all.model';

import { RulesService } from 'src/app/services/rules.service';
import { StorageService } from 'src/app/_services/storage.service';
import { NotificationService } from 'src/app/_helpers/notification.service';
import { DialogService } from 'src/app/_helpers/dialog.service';
import { CardStatusLifeCycleMatrixRolesService } from 'src/app/services/card-status-life-cycle-matrix-roles.service';
import { CreateUpdateCardStatusLifeCycleMatrixRolesComponent } from './create-update-card-status-life-cycle-matrix-roles/create-update-card-status-life-cycle-matrix-roles.component';


@Component({
  selector: 'app-card-status-life-cycle-matrix-roles',
  templateUrl: './card-status-life-cycle-matrix-roles.component.html',
  styleUrls: ['./card-status-life-cycle-matrix-roles.component.css']
})
export class CardStatusLifeCycleMatrixRolesComponent {

  cardStatusLifeCycleMatrixRoles: CardStatusLifeCycleMatrixRoles[] = [];
  currentPage: number = 1;
  totalPages: number = -1;
  pageSize: number = 10;
  displayedColumns: string[] = ['id', 'card_status_life_cycle', 'role' , 'createdAt' , 'updatedAt' , 'UPDATE'];
  searchKey: string = '';
  dataArray: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(
    private storageService: StorageService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private cardStatusLifeCycleMatrixRolesService: CardStatusLifeCycleMatrixRolesService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  canSeeAdminContent(): boolean {
    return this.storageService.hasRole('ROLE_ADMIN');
  }

  private loadData(): void {
    this.cardStatusLifeCycleMatrixRolesService.getCardStatusLifeCycleMatrixRolesService(this.currentPage, this.pageSize).subscribe(
      (data: any) => {
        if (data) {
          debugger
          this.cardStatusLifeCycleMatrixRoles = data.data;
          this.totalPages = data['total_pages'];
          this.initializeTable(data.data);
        }
      },
      error => {
        this.notificationService.warn(error.message);
      }
    );
  }

  private initializeTable(cardStatusLifeCycleMatrixRolesService: CardStatusLifeCycleMatrixRolesService[]): void {
    this.dataArray = new MatTableDataSource(cardStatusLifeCycleMatrixRolesService);
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
    this.cardStatusLifeCycleMatrixRolesService.initializeFormGroup();
    this.openCardStatusLifeCycleMatrixRolesServiceDialog();
  }

  onEdit(row: any): void {
    this.cardStatusLifeCycleMatrixRolesService.initializeFormGroup();
    this.cardStatusLifeCycleMatrixRolesService.populateForm(this.cardStatusLifeCycleMatrixRoles
      .filter(e=>e.id===row.id)[0]);
    this.openCardStatusLifeCycleMatrixRolesServiceDialog();
  }

  private openCardStatusLifeCycleMatrixRolesServiceDialog(): void {
    const dialogConfig = this.getDialogConfig();
    const dialogRef = this.dialog.open(CreateUpdateCardStatusLifeCycleMatrixRolesComponent, dialogConfig);
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
          this.cardStatusLifeCycleMatrixRolesService.deleteById($key).subscribe(
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
