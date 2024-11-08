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

import { OficinaDTO } from '../../../Core/models/OficinaDTO';
import { OficinasService } from '../../../Core/services/oficinas.service';

import { TipodocumentoDTO } from '../../../Core/models/TipodocumentoDTO';
import { TipodocumentoService } from '../../../Core/services/tipodocumento.service';
import { CustomMatPaginatorIntlComponent } from '../../../Core/components/custom-mat-paginator-intl/custom-mat-paginator-intl.component';

import { ReportesService } from '../../../Core/services/reportes.service';
import { ReporteMaestroDocumentosDTO } from '../../../Core/models/Reportes/ReporteMaestroDocumentosDTO';
import { ConsultaReporteMaestroDocumentosDTO } from '../../../Core/models/Reportes/ConsultaReporteMaestroDocumentosDTO';
import { tap } from 'rxjs';


@Component({
  selector: 'app-reporte-maestro-de-documentos',
  standalone: true,
  imports: [
    CommonModule,  // Necesario para *ngFor y *ngIf
    MatButtonModule,
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
    MatSelect
  ],
  templateUrl: './reporte-maestro-de-documentos.component.html',
  styleUrl: './reporte-maestro-de-documentos.component.css',
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlComponent }
  ]
})
export class ReporteMaestroDeDocumentosComponent implements OnInit {
  reportesService=inject(ReportesService);
  documentos: ReporteMaestroDocumentosDTO[] = [];
  displayedColumns: string[] = []; // columnas para MatTable
  filtroForm: FormGroup;
  fechaCreacion = new Date();
  fechaActual = new Date();

  OficinasService=inject(OficinasService);
  TipodocumentoService=inject(TipodocumentoService);

  oficinas: OficinaDTO[] = [];
  tiposDocumento: TipodocumentoDTO[] = [];


  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.filtroForm = this.fb.group({
      oficina: [0],
      tipoDocumento: [0]
    });
  }

  ngOnInit() {
    this.cargarDatos();
    this.obtenerOficinas();
    this.obtenerTiposDocumento();
  }

  obtenerOficinas() {
    this.OficinasService.obtenerOficinas().subscribe(oficinas => this.oficinas = oficinas);
  }

  obtenerTiposDocumento() {
    this.TipodocumentoService.obtenerTipoducumentos().subscribe(tiposDocumento => this.tiposDocumento = tiposDocumento);
  }

  cargarDatos() {
    const filtros = this.filtroForm.value;
    
    const params: ConsultaReporteMaestroDocumentosDTO = {
      oficina: filtros.oficina,
      tipoDocumento: filtros.tipoDocumento
    };
    
    console.log('Parámetros de consulta:', params);
    this.reportesService.getReporteMaestroDocumentos(params).pipe(
      tap(req => console.log('Request URL:', req))
    )
      .subscribe({
        next: (response: ReporteMaestroDocumentosDTO[]) => {
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

  exportarExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.documentos);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    XLSX.writeFile(wb, 'ReporteMaestroDocumentos.xlsx');
  }

  exportarPDF() {
    const doc = new jsPDF();
    const headers = ['Código', 'Nombre', 'Tipo de documento', 'Estado', 'SCD', 'Versión', 'Fecha de publicación', 'Resumen del cambio'];
    const data = this.documentos.map(doc => [
      doc.codigoDocumento,
      doc.nombreDocumento,
      doc.tipoDocumento,
      doc.estado,
      doc.scd,
      doc.version,
      doc.fecha,
      doc.resumenDelCambio
    ]);
    
    (doc as any).autoTable({
      head: [headers],
      body: data
    });

    doc.save('ReporteMaestroDocumentos.pdf');
  }

  exportarWord() {
    let tabla = '<table><tr>';
    const headers = ['Código', 'Nombre', 'Tipo de documento', 'Estado', 'SCD', 'Versión', 'Fecha de publicación', 'Resumen del cambio'];
    headers.forEach(header => {
      tabla += `<th>${header}</th>`;
    });
    tabla += '</tr>';

    this.documentos.forEach(doc => {
      tabla += '<tr>';
      tabla += `<td>${doc.codigoDocumento}</td>`;
      tabla += `<td>${doc.nombreDocumento}</td>`;
      tabla += `<td>${doc.tipoDocumento}</td>`;
      tabla += `<td>${doc.estado}</td>`;
      tabla += `<td>${doc.scd}</td>`;
      tabla += `<td>${doc.version}</td>`;
      tabla += `<td>${doc.fecha}</td>`;
      tabla += `<td>${doc.resumenDelCambio}</td>`;
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
    link.download = 'ReporteMaestroDocumentos.doc';
    link.click();
  }
}

