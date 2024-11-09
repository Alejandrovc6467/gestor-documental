import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { MatOption } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

import { TipodocumentoDTO } from '../../../Core/models/TipodocumentoDTO';
import { TipodocumentoService } from '../../../Core/services/tipodocumento.service';

import { DocumentoGetDTO } from '../../../Core/models/DocumentoGetDTO';
import { DocumentosService } from '../../../Core/services/documentos.service';

import { OficinaDTO } from '../../../Core/models/OficinaDTO';
import { OficinasService } from '../../../Core/services/oficinas.service';
import { CustomMatPaginatorIntlComponent } from '../../../Core/components/custom-mat-paginator-intl/custom-mat-paginator-intl.component';

import { ReportesService } from '../../../Core/services/reportes.service';

import { ReporteControlDeVersionesDTO } from '../../../Core/models/Reportes/ReporteControlDeVersionesDTO';
import { ConsultaReporteControlDeVersionesDTO } from '../../../Core/models/Reportes/ConsultaReporteControlDeVersionesDTO';
import { tap } from 'rxjs';
@Component({
  selector: 'app-reporte-control-de-versiones',
  standalone: true,
  imports: [MatButtonModule,  
    MatFormFieldModule, 
    ReactiveFormsModule,
     MatInputModule, 
     MatTableModule, 
     MatPaginatorModule, 
     MatIconModule, 
     FormsModule,
     MatOption,
    MatDatepickerModule, // Change this import
    MatNativeDateModule,
    MatSelect,
  CommonModule],
  templateUrl: './reporte-control-de-versiones.component.html',
  styleUrl: './reporte-control-de-versiones.component.css',
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlComponent }
  ]
})

export class ReporteControlDeVersionesComponent implements OnInit {
  reportesService = inject(ReportesService);
  documentos: ReporteControlDeVersionesDTO[] = [];
  displayedColumns: string[] = []; // columnas para MatTable
  filtroForm: FormGroup;
  fechaCreacion = new Date();
  fechaActual = new Date();

  tipodocumentoService = inject(TipodocumentoService);
  tiposDocumento: TipodocumentoDTO[] = [];

  documentoService = inject(DocumentosService);
  documentosCargados: DocumentoGetDTO[] = [];

  oficinaService = inject(OficinasService);
  oficinas: OficinaDTO[] = [];


  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.filtroForm = this.fb.group({
      oficina: [0],
      codigoDocumento: [''],
      nombreDocumento: [''],
      tipoDocumento: [0]
    });
  }

  ngOnInit() {
    this.cargarDatos();
    this.obtenerTipoDocumentos();
    this.obtenerDocumentos();
    this.obtenerOficinas();
  }

  cargarDatos() {
    const filtros = this.filtroForm.value;
    
    const params: ConsultaReporteControlDeVersionesDTO = {
      oficina: filtros.oficina,
      codigoDocumento: filtros.codigoDocumento,
      nombreDocumento: filtros.nombreDocumento,
      tipoDocumento: filtros.tipoDocumento
    };
    

    console.log('Parámetros de consulta:', params);
    this.reportesService.getReporteControlDeVersiones(params).pipe(
      tap(req => console.log('Request URL:', req))
    )
      .subscribe({
        next: (response: ReporteControlDeVersionesDTO[]) => {
          console.log('Reporte cargado:', response);
          this.documentos = response;
        },
        error: (error) => {
          console.error('Error al cargar el reporte:', error);
        }
      });
  }

  aplicarFiltros() {
    this.cargarDatos();
    
  }

  obtenerOficinas() {
    this.oficinaService.obtenerOficinas().subscribe(response => {
      this.oficinas = response;
    });
  }

  obtenerDocumentos() {
    this.documentoService.obtenerDocumentos().subscribe(response => {
      this.documentosCargados = response;
    })};

  obtenerTipoDocumentos(){
    this.tipodocumentoService.obtenerTipoducumentos().subscribe(response => {
      this.tiposDocumento = response;
  })};

  exportarExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.documentos);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    XLSX.writeFile(wb, 'ReporteControlVersiones.xlsx');
  }

  exportarPDF() {
    const doc = new jsPDF();
    // Ajusta los headers según las propiedades de tu DTO
    const headers = ['Código', 'Nombre', 'Tipo Documento', 'SCD','Versión', 'Fecha Creación', 'Resumen del cambio'];
    const data = this.documentos.map(reporte => [
      reporte.codigoDocumento,
      reporte.nombreDocumento,
      reporte.tipoDocumento,
      reporte.scd,
      reporte.version,
      reporte.fecha,
      reporte.resumenDelCambio
    ]);
    
    (doc as any).autoTable({
      head: [headers],
      body: data
    });

    doc.save('ReporteControlVersiones.pdf');
  }

  exportarWord() {
    let tabla = '<table><tr>';
    const headers = ['Código', 'Nombre', 'Tipo Documento', 'SCD','Versión', 'Fecha Creación', 'Resumen del cambio'];
    headers.forEach(header => {
      tabla += `<th>${header}</th>`;
    });
    tabla += '</tr>';

    this.documentos.forEach(reporte => {
      tabla += '<tr>';
      tabla += `<td>${reporte.codigoDocumento}</td>`;
      tabla += `<td>${reporte.nombreDocumento}</td>`;
      tabla += `<td>${reporte.tipoDocumento}</td>`;
      tabla += `<td>${reporte.scd}</td>`;
      tabla += `<td>${reporte.version}</td>`;
      tabla += `<td>${reporte.fecha}</td>`;
      tabla += `<td>${reporte.resumenDelCambio}</td>`;
      tabla += '</tr>';
    });
    tabla += '</table>';

    const blob = new Blob([`
      <html>
        <head>
          <meta charset='utf-8'>
          <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid black; padding: 8px; }
          </style>
        </head>
        <body>
          ${tabla}
        </body>
      </html>
    `], { type: 'application/msword' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'ReporteControlVersiones.doc';
    link.click();
  }
}

