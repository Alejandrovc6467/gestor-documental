// doctos-modal.component.ts
import { Component, Inject, ViewChild, AfterViewInit, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CustomMatPaginatorIntlComponent } from '../custom-mat-paginator-intl/custom-mat-paginator-intl.component';
import { DoctocDTO } from '../../../Core/models/DoctocDTO';
import { DoctocsService } from '../../../Core/services/doctocs.service';

// Interfaz para los datos que realmente llegan
interface DoctoRelacion {
  docto: number;
  docRelacionado: string;
}

// Interfaz extendida para incluir el nombre del docto
interface DoctoRelacionExtendido {
  docto: number;
  doctoNombre: string;
  docRelacionado: string;
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
export class DoctosModalComponent implements OnInit {
  doctocsService = inject(DoctocsService);
  listaDoctos!: DoctocDTO[];
  
  dataSource: MatTableDataSource<DoctoRelacionExtendido>;
  displayedColumns: string[] = ['doctoNombre', 'docRelacionado'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    @Inject(MAT_DIALOG_DATA) public doctosData: DoctoRelacion[],
    public dialogRef: MatDialogRef<DoctosModalComponent>
  ) {
    this.dataSource = new MatTableDataSource<DoctoRelacionExtendido>([]);
  }

  ngOnInit(): void {
    this.obtenerDoctocs();
  }

  obtenerDoctocs() {
    this.doctocsService.obtenerDoctocs().subscribe(response => {
      this.listaDoctos = response;
      this.setTable(this.doctosData);
    });
  }

  setTable(data: DoctoRelacion[]) {
    const dataExtendida: DoctoRelacionExtendido[] = data.map(documento => {
      const doctoInfo = this.listaDoctos.find(d => d.id === documento.docto);

      return {
        ...documento,
        doctoNombre: doctoInfo ? doctoInfo.nombre : 'Documento no encontrado'
      };
    });

    this.dataSource = new MatTableDataSource<DoctoRelacionExtendido>(dataExtendida);
    this.dataSource.paginator = this.paginator;
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}