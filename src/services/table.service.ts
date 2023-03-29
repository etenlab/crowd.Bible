import { GraphSecondLayerService } from './graph-second-layer.service';
import { NodeRepository } from '@/repositories/node/node.repository';
import { NodePropertyValueRepository } from '@/repositories/node/node-property-value.repository';

export class TableService {
  constructor(
    private readonly secondLayerService: GraphSecondLayerService,
    private readonly nodeRepo: NodeRepository,
    private readonly nodePropertyValueRepo: NodePropertyValueRepository,
  ) {}
  async createTable(name: string): Promise<Nanoid> {
    const table_id = await this.getTable(name);
    if (table_id) {
      return table_id;
    }

    const new_table = await this.secondLayerService.createNodeFromObject(
      'table',
      {
        name,
      },
    );

    return new_table.id;
  }

  async getTable(name: string): Promise<Nanoid | null> {
    const table = await this.nodeRepo.getNodeByProp('table', {
      key: 'name',
      value: name,
    });

    if (!table) {
      return null;
    }

    return table.id;
  }

  async createColumn(table: Nanoid, column_name: string): Promise<Nanoid> {
    const column_id = await this.getColumn(table, column_name);
    if (column_id) {
      return column_id;
    }

    const { node } =
      await this.secondLayerService.createRelatedToNodeFromObject(
        'table-to-column',
        {},
        table,
        'table-column',
        { name: column_name },
      );

    return node.id;
  }

  async getColumn(table: Nanoid, column_name: string): Promise<Nanoid | null> {
    const column = await this.nodeRepo.repository.findOne({
      relations: [
        'propertyKeys',
        'propertyKeys.propertyValue',
        'nodeRelationships',
      ],
      where: {
        node_type: 'table-column',
        propertyKeys: {
          property_key: 'name',
          propertyValue: {
            property_value: JSON.stringify({ value: column_name }),
          },
        },
        nodeRelationships: {
          from_node_id: table,
        },
      },
    });

    if (!column) {
      return null;
    }

    return column.id;
  }

  async createRow(table: Nanoid): Promise<Nanoid> {
    const { node } =
      await this.secondLayerService.createRelatedToNodeFromObject(
        'table-to-row',
        {},
        table,
        'table-row',
        {},
      );
    return node.id;
  }

  // async getRow(table: string, finder: (table: string) => string): Promise<string | null> {

  // }

  async createCell(
    column: Nanoid,
    row: string,
    value: unknown,
  ): Promise<Nanoid> {
    const cell = await this.secondLayerService.createNodeFromObject(
      'table-cell',
      {
        data: value,
      },
    );

    await this.secondLayerService.createRelationshipFromObject(
      'table-column-to-cell',
      {},
      column,
      cell.id,
    );
    await this.secondLayerService.createRelationshipFromObject(
      'table-row-to-cell',
      {},
      row,
      cell.id,
    );

    return cell.id;
  }

  async readCell(column: Nanoid, row: Nanoid): Promise<unknown> {
    const cell = await this.nodeRepo.repository.findOne({
      relations: [
        'propertyKeys',
        'propertyKeys.propertyValue',
        'nodeRelationships',
      ],
      select: {
        propertyKeys: true,
      },
      where: {
        node_type: 'table-cell',
        nodeRelationships: [{ from_node_id: column }, { from_node_id: row }],
      },
    });

    if (!cell) {
      return null;
    }

    return JSON.parse(cell.propertyKeys[0].propertyValue.property_value).value;
  }

  async updateCell(
    column: Nanoid,
    row: Nanoid,
    value: unknown,
  ): Promise<unknown> {
    const cell = await this.nodeRepo.repository.findOne({
      relations: [
        'propertyKeys',
        'propertyKeys.propertyValue',
        'nodeRelationships',
      ],
      select: {
        propertyKeys: true,
      },
      where: {
        node_type: 'table-cell',
        nodeRelationships: [{ from_node_id: column }, { from_node_id: row }],
      },
    });

    if (!cell) {
      return null;
    }

    const updated_cell = await this.nodePropertyValueRepo.repository.save({
      ...cell.propertyKeys[0].propertyValue,
      property_value: JSON.stringify(value),
    });

    return updated_cell.id;
  }
}
