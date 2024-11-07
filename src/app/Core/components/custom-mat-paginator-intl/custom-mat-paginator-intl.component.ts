import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-custom-mat-paginator-intl',
  standalone: true,
  imports: [],
  templateUrl: './custom-mat-paginator-intl.component.html',
  styleUrl: './custom-mat-paginator-intl.component.css'
})
export class CustomMatPaginatorIntlComponent extends MatPaginatorIntl {

  override itemsPerPageLabel = 'Elementos por página';
  override nextPageLabel = 'Siguiente';
  override previousPageLabel = 'Anterior';
  override firstPageLabel = 'Primera página';
  override lastPageLabel = 'Última página';

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0) {
      return 'Página 1 de 1';
    }
    const amountPages = Math.ceil(length / pageSize);
    return `Página ${page + 1} de ${amountPages}`;
  };
}