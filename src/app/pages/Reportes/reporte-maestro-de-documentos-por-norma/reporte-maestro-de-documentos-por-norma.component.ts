import { Component,  OnInit, inject } from '@angular/core';
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
import { of } from 'rxjs';

import { NormaDTO } from '../../../Core/models/NormaDTO';
import { NormasService } from '../../../Core/services/normas.service';

import { CategoriaDTO } from '../../../Core/models/CategoriaDTO';
import { CategoriasService } from '../../../Core/services/categorias.service';
import { CustomMatPaginatorIntlComponent } from '../../../Core/components/custom-mat-paginator-intl/custom-mat-paginator-intl.component';

import { ReportesService } from '../../../Core/services/reportes.service';
import { ReporteMaestroDocumentoPorNormaDTO } from '../../../Core/models/Reportes/ReporteMaestroDocumentoPorNormaDTO';
import { ConsultaReporteMaestroDocumentoPorNormaDTO } from '../../../Core/models/Reportes/ConsultaReporteMaestroDocumentoPorNormaDTO';
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
  selector: 'app-reporte-maestro-de-documentos-por-norma',
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelect
  ],
  templateUrl: './reporte-maestro-de-documentos-por-norma.component.html',
  styleUrl: './reporte-maestro-de-documentos-por-norma.component.css',
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlComponent }
  ]
})
export class ReporteMaestroDeDocumentosPorNormaComponent implements OnInit {
  reportesService = inject(ReportesService);
  documentos: ReporteMaestroDocumentoPorNormaDTO[] = [];
  displayedColumns: string[] = []; // columnas para MatTable
  filtroForm: FormGroup;
  fechaCreacion = new Date();
  fechaActual = new Date();

  normassevice=inject(NormasService);
  normas: NormaDTO[] = [];
  OficinasService=inject(OficinasService);
  TipodocumentoService=inject(TipodocumentoService);
  categoriasService=inject(CategoriasService);
  categorias: CategoriaDTO[] = [];
  oficinas: OficinaDTO[] = [];
  tiposDocumento: TipodocumentoDTO[] = [];

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.filtroForm = this.fb.group({
      oficina: [0],
      norma: [0],
      tipoDocumento: [0],
      categoria: [0]
    });
  }

  ngOnInit() {
    this.cargarDatos();
    this.obtenerOficinas();
    this.obtenerTiposDocumento();
    this.obtenerNormas();
    this.obtenerCategorias();
  }

  cargarDatos() {
    const filtros = this.filtroForm.value;
    
    const params: ConsultaReporteMaestroDocumentoPorNormaDTO = {
      oficina: filtros.oficina,
      norma: filtros.norma,
      tipoDocumento: filtros.tipoDocumento,
      categoria: filtros.categoria
    };
    
    console.log('Parámetros de consulta:', params);
    this.reportesService.getReporteMaestroDocumentoPorNorma(params).pipe(
      tap(req => console.log('Request URL:', req))
    )
      .subscribe({
        next: (response: ReporteMaestroDocumentoPorNormaDTO[]) => {
          console.log('Reporte cargado:', response);
          this.documentos = response;
        },
        error: (error) => {
          console.error('Error al cargar el reporte:', error);
        }
      });
    
   
  }

  obtenerCategorias() {
    this.categoriasService.obtenerCategorias().subscribe(categorias => this.categorias = categorias);
  }

  obtenerOficinas() { 
    this.OficinasService.obtenerOficinas().subscribe(oficinas => this.oficinas = oficinas);
  }

  obtenerNormas() {
    this.normassevice.obtenerNormas().subscribe(normas => this.normas = normas);
  }

  obtenerTiposDocumento() {
    this.TipodocumentoService.obtenerTipoducumentos().subscribe(tiposDocumento => this.tiposDocumento = tiposDocumento);
  }


  aplicarFiltros() {
    this.cargarDatos();
  }

  exportarExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.documentos);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    XLSX.writeFile(wb, 'ReporteMaestroDocumentosPorNorma.xlsx');
  }

  exportarPDF() {
    const doc = new jsPDF();
    const headers = ['Norma','Tipo de documento','Código', 'Nombre',  'Acceso', 'SCD', 'Versión', 'Fecha de publicación', 'Resumen del cambio'];
    const data = this.documentos.map(doc => [
      doc.nombreNorma,
      doc.tipoDocumento,
      doc.codigoDocumento,
      doc.nombreDocumento,
      doc.acceso,
      doc.scd,
      doc.version,
      doc.fecha,
      doc.resumenDelCambio 
    ]);
    
    (doc as any).autoTable({
      head: [headers],
      body: data
    });

    doc.save('ReporteMaestroDocumentosPorNorma.pdf');
  }

  exportarWord() {
    let tabla = '<table><tr>';
    const headers = ['Norma','Tipo de documento','Código', 'Nombre',  'Acceso', 'SCD', 'Versión', 'Fecha de publicación', 'Resumen del cambio'];
    headers.forEach(header => {
      tabla += `<th>${header}</th>`;
    });
    tabla += '</tr>';

    this.documentos.forEach(doc => {
      tabla += '<tr>';
      tabla += `<td>${doc.nombreNorma}</td>`
      tabla += `<td>${doc.tipoDocumento}</td>`;
      tabla += `<td>${doc.codigoDocumento}</td>`;
      tabla += `<td>${doc.nombreDocumento}</td>`;
      tabla += `<td>${doc.acceso}</td>`;
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
    link.download = 'ReporteMaestroDocumentosPorNorma.doc';
    link.click();
  }
}

