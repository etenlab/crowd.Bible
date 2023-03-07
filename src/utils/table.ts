import { Node } from '../models';

export const tableNodeToTable = (node: Node) => {
  const cells = node.node_relationships?.map((cell) => {
    let cell_data: TableCell = {};
    cell.toNode.property_keys.forEach((key) => {
      (cell_data as any)[key.property_key] = key.property_value.property_value;
    });
    return cell_data;
  });

  let name = '';
  node.property_keys.forEach((key) => {
    if (key.property_key === 'name') {
      name = key.property_value.property_value;
    }
  });

  return {
    id: node.id,
    name: name,
    cells: cells || [],
  };
};
