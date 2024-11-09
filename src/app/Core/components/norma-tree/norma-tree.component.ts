import { Component, Input, OnChanges } from '@angular/core';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { NestedTreeControl } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { EtapaDTO } from '../../models/EtapaDTO';

interface NormaNode {
  name: string;
  children?: NormaNode[];
  id?: number;
  level?: number;
}

@Component({
  selector: 'app-norma-tree',
  standalone: true,
  imports: [MatTreeModule, MatIconModule, CommonModule, MatButtonModule],
  templateUrl: './norma-tree.component.html',
  styleUrl: './norma-tree.component.css'
})
export class NormaTreeComponent implements OnChanges {

  @Input() etapas: EtapaDTO[] = [];
  @Input() normaId: number = 0;

  treeControl = new NestedTreeControl<NormaNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<NormaNode>();

  hasChild = (_: number, node: NormaNode) => !!node.children && node.children.length > 0;

  ngOnChanges() {
    if (this.normaId && this.etapas) {
      this.updateTreeData();
    }
  }

  private updateTreeData() {
    const treeData = this.buildTreeStructure(this.etapas);
    this.dataSource.data = treeData;
  }
  
  private buildTreeStructure(etapas: EtapaDTO[]): NormaNode[] {
    // Primero encontramos los nodos raíz (etapaPadreID = 0)
    const rootNodes = etapas
      .filter(etapa => etapa.etapaPadreID === 0)
      .map(etapa => this.createNode(etapa, etapas));
    return rootNodes;
  }
  
  private createNode(etapa: EtapaDTO, allEtapas: EtapaDTO[]): NormaNode {
    // Encontrar todos los hijos que tienen como etapaPadreID el ID de la etapa actual
    const children = allEtapas
      .filter(child => child.etapaPadreID === etapa.id)
      .map(child => this.createNode(child, allEtapas));
  
    return {
      id: etapa.id!,
      name: etapa.nombre,
      children: children.length > 0 ? children : undefined
    };
  }
  
  onNodeSelect(node: NormaNode) {
    console.log('Nodo seleccionado:', node);
  }
}
