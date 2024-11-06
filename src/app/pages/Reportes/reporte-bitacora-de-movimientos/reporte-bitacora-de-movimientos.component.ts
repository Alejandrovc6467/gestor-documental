// reporte-bitacora-de-movimientos.component.ts
import { Component, OnInit } from '@angular/core';
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

interface DatosReporte {
  id: number;
  // Añade aquí las propiedades según tu modelo de datos
  [key: string]: any;
}

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
    FormsModule
  ],
  templateUrl: './reporte-bitacora-de-movimientos.component.html',
  styleUrl: './reporte-bitacora-de-movimientos.component.css'
})
export class ReporteBitacoraDeMovimientosComponent implements OnInit {
  datos: DatosReporte[] = [];
  datosFiltrados: DatosReporte[] = [];
  displayedColumns: string[] = []; // columnas para MatTable
  filtroForm: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.filtroForm = this.fb.group({
      busqueda: [''],
      fecha: ['']
    });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    // Reemplaza con tu URL de API
    this.http.get<DatosReporte[]>('/api/datos').subscribe(
      (response) => {
        this.datos = response;
        this.datosFiltrados = [...this.datos];
        if (this.datos.length > 0) {
          this.displayedColumns = Object.keys(this.datos[0]);
        }
      },
      (error) => console.error('Error al cargar datos:', error)
    );
  }

  aplicarFiltros() {
    const filtros = this.filtroForm.value;
    
    this.datosFiltrados = this.datos.filter(dato => {
      let cumpleFiltros = true;
      
      if (filtros.busqueda) {
        const busquedaLower = filtros.busqueda.toLowerCase();
        cumpleFiltros = Object.values(dato).some(
          valor => String(valor).toLowerCase().includes(busquedaLower)
        );
      }

      if (filtros.fecha) {
        // cumpleFiltros = cumpleFiltros && 
        //   dato.fecha?.includes(filtros.fecha);
      }

      return cumpleFiltros;
    });
  }

  exportarExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.datosFiltrados);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    XLSX.writeFile(wb, 'Reporte.xlsx');
  }

  exportarPDF() {
    const doc = new jsPDF();
    
    (doc as any).autoTable({
      head: [this.displayedColumns],
      body: this.datosFiltrados.map(dato => 
        this.displayedColumns.map(col => dato[col])
      )
    });

    doc.save('Reporte.pdf');
  }

  exportarWord() {
    let tabla = '<table><tr>';
    this.displayedColumns.forEach(col => {
      tabla += `<th>${col}</th>`;
    });
    tabla += '</tr>';

    this.datosFiltrados.forEach(dato => {
      tabla += '<tr>';
      this.displayedColumns.forEach(col => {
        tabla += `<td>${dato[col]}</td>`;
      });
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

