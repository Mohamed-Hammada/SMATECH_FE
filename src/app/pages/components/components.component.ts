import { Component, OnInit, ViewChild, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Components } from 'src/app/models/all.model';


import { StorageService } from 'src/app/_services/storage.service';
import { NotificationService } from 'src/app/_helpers/notification.service';
import { DialogService } from 'src/app/_helpers/dialog.service';
import { ComponentService } from 'src/app/services/components.service';
import { CreateUpdateComponentsComponent } from './create-update-components/create-update-components.component';
import { ImageDialogComponent } from 'src/app/_helpers/image-dialog/image-dialog.component';

@Component({
  selector: 'app-components',
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.css']
})
export class ComponentsComponent {
  components: Components[] = [];
  currentPage: number = 1;
  totalPages: number = -1;
  pageSize: number = 10;
  displayedColumns: string[] = ['id', 'name', 'description', 'current_exist_quantity', 'last_price_of_unit', 'component_image', 'createdAt', 'updatedAt', 'UPDATE'];
  searchKey: string = '';
  dataArray: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(
    private storageService: StorageService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private componentsService: ComponentService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  canSeeAdminContent(): boolean {
    return this.storageService.hasRole('ROLE_ADMIN');
  }

  private loadData(): void {
    this.componentsService.getComponents(this.currentPage, this.pageSize).subscribe(
      (data: any) => {
        if (data) {
          this.components = data.data;
          this.totalPages = data['total_pages'];
          this.initializeTable(data.data);
        }
      },
      error => {
        this.notificationService.warn(error.message);
      }
    );
  }

  private initializeTable(components: Components[]): void {
    this.dataArray = new MatTableDataSource(components);
    this.dataArray.paginator = this.paginator;
    this.dataArray.sort = this.sort; // Add this line to enable sorting
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
    this.componentsService.initializeFormGroup();
    this.openComponentDialog();
  }

  onEdit(row: any): void {
    this.componentsService.initializeFormGroup();
    this.componentsService.populateForm(this.components.filter(e => e.id === row.id)[0]);
    this.openComponentDialog();
  }

  private openComponentDialog(): void {
    const dialogConfig = this.getDialogConfig();
    const dialogRef = this.dialog.open(CreateUpdateComponentsComponent, dialogConfig);
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
          this.componentsService.deleteById($key).subscribe(
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
