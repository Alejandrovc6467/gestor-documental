// doctos-modal.component.ts
import { Component, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CustomMatPaginatorIntlComponent } from '../custom-mat-paginator-intl/custom-mat-paginator-intl.component';


interface DoctoDTO {
  nombre: string;
  edad: number;
}

@Component({
  selector: 'app-doctos',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatPaginatorModule],
  templateUrl: './doctos-modal.component.html',
  styleUrls: ['./doctos-modal.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlComponent }
  ]
})
export class DoctosModalComponent {

  dataSource: MatTableDataSource<DoctoDTO>;
  displayedColumns: string[] = ['docto', 'docRelacionado'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;


 
  constructor(
    @Inject(MAT_DIALOG_DATA) public doctosData: DoctoDTO[],
    public dialogRef: MatDialogRef<DoctosModalComponent>
  ) {
    this.dataSource = new MatTableDataSource<DoctoDTO>(doctosData); // Inicializa la tabla con los datos recibidos
    this.dataSource.paginator = this.paginator;

   
     
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
