import { Component, inject, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { TipodocumentoDTO } from '../../../Core/models/TipodocumentoDTO';
import { TipodocumentoService } from '../../../Core/services/tipodocumento.service';
import { OficinaDTO } from '../../../Core/models/OficinaDTO';
import { OficinasService } from '../../../Core/services/oficinas.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatOption } from '@angular/material/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { CustomMatPaginatorIntlComponent } from '../../../Core/components/custom-mat-paginator-intl/custom-mat-paginator-intl.component';

import { ReportesService } from '../../../Core/services/reportes.service';
import { ReporteDocumentosAntiguosDTO } from '../../../Core/models/Reportes/ReporteDocumentosAntiguosDTO';
import { ConsultaReporteDocumentosAntiguosDTO } from '../../../Core/models/Reportes/ConsultaReporteDocumentosAntiguosDTO';
import { tap } from 'rxjs';

@Component({
  selector: 'app-reporte-documentos-antiguos',
  standalone: true,
  imports: [
    CommonModule,
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
  templateUrl: './reporte-documentos-antiguos.component.html',
  styleUrls: ['./reporte-documentos-antiguos.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlComponent }
  ]
})
export class ReporteDocumentosAntiguosComponent implements OnInit {
  reportesService= inject(ReportesService);
  tipodocumentoService = inject(TipodocumentoService);
  oficinasService = inject(OficinasService);
  documentos: ReporteDocumentosAntiguosDTO[] = [];
  oficinas: OficinaDTO[] = [];
  tiposDocumento: TipodocumentoDTO[] = [];
  fechaCreacion = new Date();
  fechaActual = new Date();
  filtroForm: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.filtroForm = this.fb.group({
      oficina: [0],
      tipoDocumento: [0],
      fecha: ['']
    });
  }

  ngOnInit() {
    this.cargarDatos();
    this.obtenerTipoDocumentos();
    this.obtenerOficinas();
  }

  cargarDatos() {
    const filtros = this.filtroForm.value;
    
    const params: ConsultaReporteDocumentosAntiguosDTO = {
      oficina: filtros.oficina,
      tipoDocumento: filtros.tipoDocumento,
      fecha: this.formatearFecha(filtros.fecha)
    };
    
    console.log('Parámetros de consulta:', params);
    this.reportesService.getReporteDocumentosAntiguos(params).pipe(
      tap(req => console.log('Request URL:', req))
    )
      .subscribe({
        next: (response: ReporteDocumentosAntiguosDTO[]) => {
          console.log('Reporte cargado:', response);
          this.documentos = response;
        },
        error: (error) => {
          console.error('Error al cargar el reporte:', error);
        }
      });
    
  }
  formatearFecha(fecha: any): string {
    if (!fecha) return '';
    
    // Convertir a Date si no lo es
    const fechaObj = new Date(fecha);
    
    const dia = fechaObj.getDate().toString().padStart(2, '0');
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
    const anio = fechaObj.getFullYear();
    
    return `${mes}-${dia}-${anio}`;
  }

  aplicarFiltros() {
    this.cargarDatos();
  }

  obtenerTipoDocumentos(){
    this.tipodocumentoService.obtenerTipoducumentos().subscribe(response => {
      this.tiposDocumento = response;
  })};

  obtenerOficinas(){
    this.oficinasService.obtenerOficinas().subscribe(response => {
      this.oficinas = response;
  })}

  exportarExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.documentos);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    XLSX.writeFile(wb, 'ReporteDocumentosAntiguos.xlsx');
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

    doc.save('ReporteDocumentosAntiguos.pdf');
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
    link.download = 'ReporteDocumentosAntiguos.doc';
    link.click();
  }
}