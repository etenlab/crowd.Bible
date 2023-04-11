import { type Node } from '@/models/index';

export const tableNodeToTable = (node: Node) => {
  const cells = node.toNodeRelationships?.map((cell) => {
    const cell_data: TableCell = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cell.toNode.propertyKeys?.forEach((key: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (cell_data as any)[key.property_key] = JSON.parse(
        key.propertyValue.property_value,
      ).value;
    });
    return cell_data;
  });

  let name = '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node.propertyKeys?.forEach((key: any) => {
    if (key.property_key === 'name') {
      name = JSON.parse(key.propertyValue.property_value).value;
    }
  });

  return {
    id: node.id,
    name,
    cells: cells != null || [],
  };
};
