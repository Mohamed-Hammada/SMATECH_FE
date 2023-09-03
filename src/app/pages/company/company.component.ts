import { Component, OnInit, ViewChild, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { Company, Role } from 'src/app/models/all.model';

import { RulesService } from 'src/app/services/rules.service';
import { StorageService } from 'src/app/_services/storage.service';
import { NotificationService } from 'src/app/_helpers/notification.service';
import { DialogService } from 'src/app/_helpers/dialog.service';
import { CompanyService } from 'src/app/services/company.service';
import { CreateUpdateCompanyComponent } from './create-update-company/create-update-company.component';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompaniesComponent {

  companies: Company[] = [];
  currentPage: number = 1;
  totalPages: number = -1;
  pageSize: number = 10;
  displayedColumns: string[] = ['id', 'name', 'area' , 'customer_name' , 'createdAt' , 'updatedAt' , 'UPDATE'];
  searchKey: string = '';
  dataArray: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(
    private storageService: StorageService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  canSeeAdminContent(): boolean {
    return this.storageService.hasRole('ROLE_ADMIN');
  }

  private loadData(): void {
    this.companyService.getCompanies(this.currentPage, this.pageSize).subscribe(
      (data: any) => {
        if (data) {
          this.companies = data.data;
          this.totalPages = data['total_pages'];
          this.initializeTable(data.data);
        }
      },
      error => {
        this.notificationService.warn(error.message);
      }
    );
  }

  private initializeTable(companies: Company[]): void {
    this.dataArray = new MatTableDataSource(companies);
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
    this.companyService.initializeFormGroup();
    this.openCompanyDialog();
  }

  onEdit(row: any): void {
    this.companyService.initializeFormGroup();
    this.companyService.populateForm(this.companies.filter(e=>e.id===row.id)[0]);
    this.openCompanyDialog();
  }

  private openCompanyDialog(): void {
    const dialogConfig = this.getDialogConfig();
    const dialogRef = this.dialog.open(CreateUpdateCompanyComponent, dialogConfig);
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
          this.companyService.deleteById($key).subscribe(
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
