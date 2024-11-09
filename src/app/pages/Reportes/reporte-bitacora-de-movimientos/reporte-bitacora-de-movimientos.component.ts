// reporte-bitacora-de-movimientos.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
import { DocumentoGetDTO } from '../../../Core/models/DocumentoGetDTO';
import { DocumentosService } from '../../../Core/services/documentos.service';
import { OficinaDTO } from '../../../Core/models/OficinaDTO';
import { OficinasService } from '../../../Core/services/oficinas.service';

import { UsuarioDTO } from '../../../Core/models/UsuarioDTO';
import { UsuariosService } from '../../../Core/services/usuarios.service';
import { CustomMatPaginatorIntlComponent } from '../../../Core/components/custom-mat-paginator-intl/custom-mat-paginator-intl.component';

import { ReportesService } from '../../../Core/services/reportes.service';
import { ReporteBitacoraDeMovimientoDTO } from '../../../Core/models/Reportes/ReporteBitacoraDeMovimientoDTO';
import { ConsultaReporteBitacoraDeMovimientoDTO } from '../../../Core/models/Reportes/ConsultaReporteBitacoraDeMovimientoDTO';
import { tap } from 'rxjs';




@Component({
  selector: 'app-reporte-bitacora-de-movimientos',
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
  templateUrl: './reporte-bitacora-de-movimientos.component.html',
  styleUrl: './reporte-bitacora-de-movimientos.component.css',
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlComponent },
    DatePipe
  ]
})
export class ReporteBitacoraDeMovimientosComponent implements OnInit {
  datePipe= inject(DatePipe);
  reportesService = inject(ReportesService);
  documentos: ReporteBitacoraDeMovimientoDTO[] = [];
  displayedColumns: string[] = []; // columnas para MatTable
  filtroForm: FormGroup;
  fechaCreacion = new Date();
  fechaActual = new Date();

  documentosCargados: DocumentoGetDTO[] = [];
  documentosService = inject(DocumentosService);
  oficinas: OficinaDTO[] = [];
  oficinasService = inject(OficinasService);
  usuarios: UsuarioDTO[] = [];
  usuariosService = inject(UsuariosService);

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.filtroForm = this.fb.group({
      codigoDocumento: [''],
      Usuario: [0],
      oficina: [0],
      nombreDocumento: [''],
      fechaInicio: [''],
      fechaFin: ['']
    });
  }

  ngOnInit() {
    this.cargarDatos();
    this.obtenerDocumentos();
    this.obtenerOficinas();
    this.obtenerUsuarios();
  }

  cargarDatos() {
    const filtros = this.filtroForm.value;
    
     this.formatearFecha(filtros.fechaFin);
    const params: ConsultaReporteBitacoraDeMovimientoDTO = {
      oficinaID: filtros.oficina,
      usuarioID: filtros.Usuario,
      codigoDocumento: filtros.codigoDocumento,
      nombreDocumento: filtros.nombreDocumento,
      fechaInicio: this.formatearFecha(filtros.fechaInicio),
      fechaFin: this.formatearFecha(filtros.fechaFin)
    };
    
    console.log('Parámetros de consulta:', params);
    this.reportesService.getReporteBitacoraDeMovimiento(params).pipe(
      tap(req => console.log('Request URL:', req))
    )
      .subscribe({
        next: (response: ReporteBitacoraDeMovimientoDTO[]) => {
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

  obtenerDocumentos(){
    this.documentosService.obtenerDocumentos().subscribe(response => {
      this.documentosCargados = response;
    });
  }

  obtenerUsuarios(){
    this.usuariosService.obtenerUsuarios().subscribe(response => {
      this.usuarios = response;
  })}
  obtenerOficinas(){
    this.oficinasService.obtenerOficinas().subscribe(response => {
      this.oficinas = response;
  })}

  aplicarFiltros() {
    this.cargarDatos();
  }

  exportarExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.documentos);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    XLSX.writeFile(wb, 'ReporteBitacoraMovimientos.xlsx');
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

    doc.save('ReporteBitacoraMovimientos.pdf');
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
    link.download = 'ReporteBitacoraMovimientos.doc';
    link.click();
  }


  
}

