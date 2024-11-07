import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
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

interface DocumentoReporte {
  codigoDocumento: string;
  nombreDocumento: string;
  acceso: string;
  version: string;
  fechaPublicacion: string;
  oficinaResponsable: string;
}

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
  styleUrl: './reporte-maestro-de-documentos.component.css'
})
export class ReporteMaestroDeDocumentosComponent implements OnInit {
  documentos: DocumentoReporte[] = [];
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
      oficina: [''],
      tipoDocumento: ['']
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
    // Reemplaza con tu URL de API
    
  }

  aplicarFiltros() {
    const filtros = this.filtroForm.value;
    
  }

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

