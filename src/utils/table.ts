import { Node } from '../models';

export const tableNodeToTable = (node: Node) => {
  const cells = node.nodeRelationships?.map((cell) => {
    let cell_data: TableCell = {};
    cell.toNode.propertyKeys?.forEach((key) => {
      (cell_data as any)[key.property_key] = JSON.parse(key.propertyValue.property_value).value;
    });
    return cell_data;
  });

  let name = '';
  node.propertyKeys?.forEach((key) => {
    if (key.property_key === 'name') {
      name = JSON.parse(key.propertyValue.property_value).value;
    }
  });

  return {
    id: node.id,
    name: name,
    cells: cells || [],
  };
};
