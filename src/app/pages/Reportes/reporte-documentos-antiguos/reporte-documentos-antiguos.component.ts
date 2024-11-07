import { Component, inject, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { TipodocumentoDTO } from '../../../Core/models/TipodocumentoDTO';
import { TipodocumentoService } from '../../../Core/services/tipodocumento.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatOption } from '@angular/material/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';


interface DocumentoReporte {
  codigoDocumento: string;
  nombreDocumento: string;
  acceso: string;
  version: string;
  fechaPublicacion: string;
  oficinaResponsable: string;
}

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
  styleUrls: ['./reporte-documentos-antiguos.component.css']
})
export class ReporteDocumentosAntiguosComponent implements OnInit {
  tipodocumentoService = inject(TipodocumentoService);
  documentos: DocumentoReporte[] = [];
  oficinas: any[] = [];
  tiposDocumento: TipodocumentoDTO[] = [];
  fechaCreacion = new Date();
  fechaActual = new Date();
  filtroForm: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.filtroForm = this.fb.group({
      oficina: [''],
      tipoDocumento: [''],
      fecha: ['']
    });
  }

  ngOnInit() {
    this.cargarDatosEjemplo();
    this.obtenerTipoDocumentos();
  }

  cargarDatosEjemplo() {
    this.documentos = [
      {
        codigoDocumento: 'Esta es una prueba de sistema favor hacer caso omi',
        nombreDocumento: 'Esta es una prueba de sistema favor hacer caso omiso',
        acceso: 'Privado',
        version: 'V1',
        fechaPublicacion: '8/8/2023',
        oficinaResponsable: 'Error: Subreport could not be'
      },
      {
        codigoDocumento: 'COD1',
        nombreDocumento: 'Documento PIP Público Centro Gestor (Esta es una prueba de sistema favor hacer caso omiso)',
        acceso: 'Público Centro Gestor',
        version: 'Prueba de sistema',
        fechaPublicacion: '20/2/2024',
        oficinaResponsable: 'Error: Subreport could not be'
      }
    ];
  }

  aplicarFiltros() {
    const filtros = this.filtroForm.value;
    // Implementa la lógica de filtrado aquí
  }

  obtenerTipoDocumentos(){
    this.tipodocumentoService.obtenerTipoducumentos().subscribe(response => {
      this.tiposDocumento = response;
  })};

  exportarExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.documentos);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    XLSX.writeFile(wb, 'Reporte.xlsx');
  }

  exportarPDF() {
    const doc = new jsPDF();
    const headers = ['Código', 'Nombre', 'Acceso', 'Versión', 'Fecha', 'Oficina'];
    const data = this.documentos.map(doc => [
      doc.codigoDocumento,
      doc.nombreDocumento,
      doc.acceso,
      doc.version,
      doc.fechaPublicacion,
      doc.oficinaResponsable
    ]);
    
    (doc as any).autoTable({
      head: [headers],
      body: data
    });

    doc.save('Reporte.pdf');
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
      tabla += `<td>${doc.fechaPublicacion}</td>`;
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
    link.download = 'Reporte.doc';
    link.click();
  }
}