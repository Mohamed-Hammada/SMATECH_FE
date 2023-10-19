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
  displayedColumns: string[] = ['id', 'username', 'email', 'createdAt', 'updatedAt', 'UPDATE'];
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
    this.userService.getUsers(this.currentPage, this.pageSize).pipe(
      tap(data => {
        console.log("Total Records (tap):", data['total_count']);
        console.log("Page Size (tap):", data['size']);
        this.totalRecords = data['total_count'];
        this.pageSize = data['size'];
      })
    ).subscribe(
      (data: any) => {
        if (data) {
          this.users = data.data;
          console.log("Total Records (subscribe):", this.totalRecords);
          console.log("Page Size (subscribe):", this.pageSize);
          this.totalRecords = data['total_count']
          this.currentPage = data['page']
          this.totalPages = data['total_pages'];
          this.pageSize = data['size']
          // this.initializeTable(data.data);
          // Update dataArray's data
          this.dataArray.data = this.users;
          
          if (this.paginator) {
            console.log("Paginator before setting index - Page Index:", this.paginator.pageIndex);
            console.log("Paginator before setting index - Page Size:", this.paginator.pageSize);
            console.log("Paginator before setting index - Length:", this.paginator.length);

            this.paginator.pageIndex = this.currentPage - 1;
            this.paginator.pageSize = this.pageSize;
            this.paginator.length = this.totalRecords;
            this.cdr.detectChanges(); // Trigger change detection

            console.log("Paginator after setting index - Page Index:", this.paginator.pageIndex);
            console.log("Paginator after setting index - Page Size:", this.paginator.pageSize);
            console.log("Paginator after setting index - Length:", this.paginator.length);
          }
         
        }
      },
      error => {
        this.notificationService.warn(error.message);
      }
    );
  }

  

  private initializeTable(users: User[]): void {
    this.dataArray = new MatTableDataSource(users);
    
    this.dataArray.filterPredicate = (data: any, filterValue: string) => {
      return JSON.stringify(data).toLowerCase().includes(filterValue);
    };
  
    if (this.paginator) {
      console.log("Before assignment - Page Index:", this.paginator.pageIndex);
      console.log("Before assignment - Page Size:", this.paginator.pageSize);
      console.log("Before assignment - Length:", this.paginator.length);
    }
  
    this.dataArray.paginator = this.paginator;
    this.paginator.length = this.totalRecords;
    if (this.dataArray.paginator) {
      console.log("After assignment - Page Index:", this.dataArray.paginator.pageIndex);
      console.log("After assignment - Page Size:", this.dataArray.paginator.pageSize);
      console.log("After assignment - Length:", this.dataArray.paginator.length);
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
