import { GraphFirstLayerService } from './graph-first-layer.service';

import { type Node } from '@/models/node/node.entity';
import { type Relationship } from '@/models/relationship/relationship.entity';

export class GraphSecondLayerService {
  constructor(private readonly firstLayerService: GraphFirstLayerService) {}

  async createNodeFromObject(type_name: string, obj: object): Promise<Node> {
    const node = await this.firstLayerService.createNode(type_name);

    for (const [key, value] of Object.entries(obj)) {
      const property_key_id = await this.firstLayerService.getNodePropertyKey(
        node.id,
        key,
      );

      await this.firstLayerService.setNodePropertyValue(property_key_id, value);
    }

    return node;
  }

  async createRelationshipFromObject(
    type_name: string,
    obj: object,
    from_node: Nanoid,
    to_node: Nanoid,
  ): Promise<Relationship> {
    const relationship = await this.firstLayerService.createRelationship(
      from_node,
      to_node,
      type_name,
    );

    for (const [key, value] of Object.entries(obj)) {
      const property_key_id =
        await this.firstLayerService.getRelationshipPropertyKey(
          relationship.id,
          key,
        );

      await this.firstLayerService.setRelationshipPropertyValue(
        property_key_id,
        value,
      );
    }

    return relationship;
  }

  async createRelatedFromNodeFromObject(
    node_type_name: string,
    obj: object,
    rel_type_name: string,
    to_node_id: Nanoid,
  ): Promise<{
    relationship: Relationship;
    node: Node;
  }> {
    const from_node = await this.createNodeFromObject(node_type_name, obj);
    const relationship = await this.firstLayerService.createRelationship(
      from_node.id,
      to_node_id,
      rel_type_name,
    );

    return {
      relationship,
      node: from_node,
    };
  }

  async createRelatedToNodeFromObject(
    from_node_id: Nanoid,
    rel_type_name: string,
    node_type_name: string,
    obj: object,
  ): Promise<{
    relationship: Relationship;
    node: Node;
  }> {
    const to_node = await this.createNodeFromObject(node_type_name, obj);
    const relationship = await this.firstLayerService.createRelationship(
      from_node_id,
      to_node.id,
      rel_type_name,
    );

    return {
      relationship,
      node: to_node,
    };
  }

  async updateNodeObject(node_id: Nanoid, obj: object): Promise<Node> {
    const node = await this.firstLayerService.readNode(node_id);

    if (node === null) {
      throw new Error(`Not Exists node with #node_id='${node_id}'`);
    }

    for (const [key, value] of Object.entries(obj)) {
      const property_key_id = await this.firstLayerService.getNodePropertyKey(
        node.id,
        key,
      );

      await this.firstLayerService.setNodePropertyValue(property_key_id, value);
    }

    return node;
  }

  async updateRelationshipObject(
    rel_id: Nanoid,
    obj: object,
  ): Promise<Relationship> {
    const rel = await this.firstLayerService.readRelationship(rel_id);

    if (rel === null) {
      throw new Error(`Not Exists relationship with #rel_id='${rel_id}'`);
    }

    for (const [key, value] of Object.entries(obj)) {
      const property_key_id =
        await this.firstLayerService.getRelationshipPropertyKey(rel.id, key);

      await this.firstLayerService.setRelationshipPropertyValue(
        property_key_id,
        value,
      );
    }

    return rel;
  }
}
