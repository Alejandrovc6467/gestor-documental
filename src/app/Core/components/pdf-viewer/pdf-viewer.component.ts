import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FiltroVerticalService } from '../../services/filtro-vertical.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-pdf-viewer',
  template: `
    <div class="pdf-dialog-header">
      <p>Visualizador de PDF</p>
      <div class="header-controls">
        <button mat-icon-button (click)="zoomIn()" title="Aumentar zoom">
          <mat-icon>zoom_in</mat-icon>
        </button>
        <button mat-icon-button (click)="zoomOut()" title="Reducir zoom">
          <mat-icon>zoom_out</mat-icon>
        </button>
        <button mat-icon-button (click)="downloadPdf()" title="Descargar PDF">
          <mat-icon>download</mat-icon>
        </button>
        <button mat-icon-button (click)="closeDialog()" title="Cerrar">
          <mat-icon>close</mat-icon>
        </button>
      </div>
    </div>
    <div class="pdf-container">
      @if(loading) {
        <div class="loading">
          <mat-icon class="loading-icon">refresh</mat-icon>
          <span>Cargando PDF...</span>
        </div>
      }
      @if(error) {
        <div class="error">
          <mat-icon>error</mat-icon>
          <span>Error al cargar el PDF: {{error}}</span>
          <button mat-raised-button color="primary" (click)="loadPdf()">
            Reintentar
          </button>
        </div>
      }
      @if(pdfUrl && !loading && !error) {
        <pdf-viewer
          [src]="pdfUrl"
          [zoom]="zoom"
          [original-size]="false"
          [show-all]="true"
          [fit-to-page]="true"
          [zoom-scale]="'page-width'"
          [render-text]="true"
          style="width: 100%; height: 100%;">
        </pdf-viewer>
      }
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .pdf-dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 16px;
      background-color: #f5f5f5;
      border-bottom: 1px solid #ddd;
    }
    .header-controls {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .pdf-dialog-header h2 {
      margin: 0;
      font-size: 1.2em;
    }
    .pdf-container {
      flex: 1;
      position: relative;
      overflow: hidden;
      background-color: #f0f0f0;
    }
    .loading, .error {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .loading-icon {
      animation: spin 1s infinite linear;
    }
    .error {
      color: red;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    :host ::ng-deep .ng2-pdf-viewer-container {
      height: calc(100vh - 64px) !important;
    }
  `],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, PdfViewerModule]
})
export class PdfViewerComponent implements OnInit, OnDestroy {
  pdfBlob: Blob | null = null;
  pdfUrl: string | null = null;
  loading = true;
  error: string | null = null;
  zoom = 0.5;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { url: string },
    private dialogRef: MatDialogRef<PdfViewerComponent>,
    private sanitizer: DomSanitizer,
    private filtroVerticalService: FiltroVerticalService
  ) {}

  ngOnInit() {
    this.loadPdf();
  }

  public loadPdf() {
    this.loading = true;
    this.error = null;
    
    // Limpiar URL anterior si existe
    if (this.pdfUrl) {
      URL.revokeObjectURL(this.pdfUrl);
      this.pdfUrl = null;
    }

    this.filtroVerticalService.descargarArchivo(this.data.url).subscribe({
      next: (blob: Blob) => {
        if (blob.type !== 'application/pdf') {
          console.error('Tipo de blob recibido:', blob.type);
          this.error = 'El archivo no es un PDF válido';
          this.loading = false;
          return;
        }

        this.pdfBlob = blob;
        // Crear URL del Blob
        this.pdfUrl = URL.createObjectURL(blob);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading PDF:', error);
        this.loading = false;
        this.error = 'No se pudo cargar el PDF. Por favor, intente nuevamente.';
      }
    });
  }

  zoomIn() {
    this.zoom = Math.min(this.zoom + 0.25, 3);
  }

  zoomOut() {
    this.zoom = Math.max(this.zoom - 0.25, 0.5);
  }

  downloadPdf() {
    if (this.pdfBlob) {
      const url = URL.createObjectURL(this.pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'documento.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    // Limpiar URL al destruir el componente
    if (this.pdfUrl) {
      URL.revokeObjectURL(this.pdfUrl);
    }
  }
}