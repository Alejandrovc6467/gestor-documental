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
import { ReportesDocSinMovimientoDTO } from '../../../Core/models/Reportes/ReportesDocSinMovimientoDTO';
import { ConsultaReporteDocSinMovimientoDTO } from '../../../Core/models/Reportes/ConsultaReporteDocSinMovimientoDTO';
import { tap } from 'rxjs';

interface DocumentoReporte {
  codigoDocumento: string;
  nombreDocumento: string;
  acceso: string;
  version: string;
  fechaPublicacion: string;
  oficinaResponsable: string;
}

@Component({
  selector: 'app-reporte-documentos-sin-movimientos',
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
  templateUrl: './reporte-documentos-sin-movimientos.component.html',
  styleUrl: './reporte-documentos-sin-movimientos.component.css',
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlComponent }
  ]
})

export class ReporteDocumentosSinMovimientosComponent implements OnInit {
  reportesService = inject(ReportesService);
  documentos: ReportesDocSinMovimientoDTO[] = [];
  displayedColumns: string[] = []; // columnas para MatTable
  filtroForm: FormGroup;
  fechaCreacion = new Date();
  fechaActual = new Date();

  tipodocumentoService = inject(TipodocumentoService);
  tiposDocumento: TipodocumentoDTO[] = [];

  oficinaService = inject(OficinasService);
  oficinas: OficinaDTO[] = [];

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.filtroForm = this.fb.group({
      oficina: [0],
      tipoDocumento: [''],
      fechaInicio:[''],
      fechaFin: ['']
    });
  }

  ngOnInit() {
    this.cargarDatos();
    this.obtenerOficinas();
    this.obtenerTipoDocumentos();
  }

  cargarDatos() {
    const filtros = this.filtroForm.value;
    
    const params: ConsultaReporteDocSinMovimientoDTO = {
      oficinaID: filtros.oficina,
      tipoDocumento: filtros.tipoDocumento,
      fechaInicio: filtros.fechaInicio,
      fechaFin: filtros.fechaFin
    };
    
    console.log('Parámetros de consulta:', params);
    this.reportesService.getReporteDocSinMovimiento(params).pipe(
      tap(req => console.log('Request URL:', req))
    )
      .subscribe({
        next: (response: ReportesDocSinMovimientoDTO[]) => {
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

  obtenerTipoDocumentos(){
    this.tipodocumentoService.obtenerTipoducumentos().subscribe(response => {
      this.tiposDocumento = response;
  })};

  exportarExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.documentos);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    XLSX.writeFile(wb, 'ReporteDocumentosSINMovimientos.xlsx');
  }

  exportarPDF() {
    const doc = new jsPDF();
    const headers = ['Código', 'Nombre', 'Acceso', 'Versión', 'Fecha', 'Oficina'];
    const data = this.documentos.map(doc => [
      doc.codigoDocumento,
      doc.nombreDocumento,
      doc.acceso,
      doc.version,
      doc.fecha,
      doc.oficinaResponsable
    ]);
    
    (doc as any).autoTable({
      head: [headers],
      body: data
    });

    doc.save('ReporteDocumentosSINMovimientos.pdf');
  }

  exportarWord() {
    let tabla = '<table><tr>';
    const headers = ['Código', 'Nombre', 'Acceso', 'Versión', 'Fecha', 'Oficina'];
    headers.forEach(header => {
      tabla += `<th>${header}</th>`;
    });
    tabla += '</tr>';

    this.documentos.forEach(doc => {
      tabla += '<tr>';
      tabla += `<td>${doc.codigoDocumento}</td>`;
      tabla += `<td>${doc.nombreDocumento}</td>`;
      tabla += `<td>${doc.acceso}</td>`;
      tabla += `<td>${doc.version}</td>`;
      tabla += `<td>${doc.fecha}</td>`;
      tabla += `<td>${doc.oficinaResponsable}</td>`;
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
    link.download = 'ReporteDocumentosSINMovimientos.doc';
    link.click();
  }
}

