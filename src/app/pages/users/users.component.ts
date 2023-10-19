import { Component, OnInit, ViewChild, SimpleChanges, AfterViewInit,ChangeDetectorRef  } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { User, Role } from 'src/app/models/all.model';
import { UserServiceService } from 'src/app/services/user-service.service';
import { RulesService } from 'src/app/services/rules.service';
import { StorageService } from 'src/app/_services/storage.service';
import { NotificationService } from 'src/app/_helpers/notification.service';
import { DialogService } from 'src/app/_helpers/dialog.service';
import { CreateUserComponent } from './creat-update-user/create-update-user.component';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[] = [];
  currentPage: number = 1;
  totalPages: number = -1;
  totalRecords: number = -1;
  pageSize: number = 5;
  pageSizeOptions: number[] = [5,10,15,20];
  displayedColumns: string[] = [ 'username', 'email', 'createdAt', 'updatedAt', 'UPDATE'];
  searchKey: string = '';
  dataArray: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private cdr: ChangeDetectorRef,
    private storageService: StorageService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private userService: UserServiceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadData();
  }




  canSeeAdminContent(): boolean {
    return this.storageService.hasRole('ROLE_ADMIN');
  }

  private loadData(): void {
    this.userService.getUsers(this.currentPage, this.pageSize).subscribe(
      (data: any) => {
        if (data) {
          this.users = data.data;
          this.totalRecords = data['total_count']
          this.currentPage = data['page']
          this.totalPages = data['total_pages'];
          this.pageSize = data['size']
          this.dataArray.data = this.users;

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
    this.userService.initializeFormGroup();
    this.openUserDialog();
  }

  onEdit(row: any): void {
    this.userService.initializeFormGroup();
    this.userService.populateForm(this.users.filter(e => e.id === row.id)[0]);
    this.openUserDialog();
  }

  private openUserDialog(): void {
    const dialogConfig = this.getDialogConfig();
    const dialogRef = this.dialog.open(CreateUserComponent, dialogConfig);
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
          this.userService.deleteById($key).subscribe(
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
    // this.loadData();
  }

  exportAsXLSX(): void {
    // Functionality for exporting data as XLSX file
  }


}
