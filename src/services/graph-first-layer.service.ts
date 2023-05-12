import { FindOptionsWhere } from 'typeorm';

import { NodePropertyKeyRepository } from '@/repositories/node/node-property-key.repository';
import { NodePropertyValueRepository } from '@/repositories/node/node-property-value.repository';
import {
  NodeRepository,
  type getNodesByTypeAndRelatedNodesParams,
} from '@/repositories/node/node.repository';
import { NodeTypeRepository } from '@/repositories/node/node-type.repository';

import { RelationshipPropertyKeyRepository } from '@/repositories/relationship/relationship-property-key.repository';
import { RelationshipPropertyValueRepository } from '@/repositories/relationship/relationship-property-value.repository';
import { RelationshipRepository } from '@/repositories/relationship/relationship.repository';
import { RelationshipTypeRepository } from '@/repositories/relationship/relationship-type.repository';

import { NodeType } from '@/src/models/';
import { type Node } from '@/src/models/';

import { RelationshipType } from '@/src/models/';
import { type Relationship } from '@/src/models/';

import { PropertyKeyConst } from '@/constants/graph.constant';

export class GraphFirstLayerService {
  constructor(
    private readonly nodeTypeRepo: NodeTypeRepository,
    private readonly nodeRepo: NodeRepository,
    private readonly nodePropertyKeyRepo: NodePropertyKeyRepository,
    private readonly nodePropertyValueRepo: NodePropertyValueRepository,

    private readonly relationshipTypeRepo: RelationshipTypeRepository,
    private readonly relationshipRepo: RelationshipRepository,
    private readonly relationshipPropertyKeyRepo: RelationshipPropertyKeyRepository,
    private readonly relationshipPropertyValueRepo: RelationshipPropertyValueRepository,
  ) {}

  // node type
  async createNodeType(type_name: string): Promise<string> {
    return this.nodeTypeRepo.createNodeType(type_name);
  }

  async listNodeTypes(): Promise<NodeType[]> {
    return this.nodeTypeRepo.listNodeTypes();
  }

  // node
  async listAllNodesByType(type_name: string): Promise<Node[]> {
    return this.nodeRepo.listAllNodesByType(type_name);
  }

  async createNode(type_name: string): Promise<Node> {
    return this.nodeRepo.createNode(type_name);
  }

  async readNode(
    node_id: Nanoid,
    relations?: string[],
    whereObj?: FindOptionsWhere<Node>,
  ): Promise<Node | null> {
    return this.nodeRepo.readNode(node_id, relations, whereObj);
  }

  async getNodeByProp(
    type: string,
    prop: { key: string; value: unknown },
    relationship?: {
      relationship_type?: string;
      from_node_id?: Nanoid;
      to_node_id?: Nanoid;
    },
  ): Promise<Node | null> {
    return this.nodeRepo.getNodeByProp(type, prop, relationship);
  }

  async getNodeIdsByProps(
    type: string,
    props: { key: string; value: unknown }[],
  ): Promise<Nanoid[]> {
    return this.nodeRepo.getNodeIdsByProps(type, props);
  }

  async getNodesByIds(ids: Array<string>): Promise<Node[]> {
    return this.nodeRepo.getNodesByIds(ids);
  }

  async getNodesByProps(
    type: string,
    props: { key: string; value: unknown }[],
  ): Promise<Node[]> {
    const nodeIds = await this.getNodeIdsByProps(type, props);
    return this.nodeRepo.getNodesByIds(nodeIds);
  }

  async getNodesByTypeAndRelatedNodes({
    type,
    from_node_id,
    to_node_id,
  }: getNodesByTypeAndRelatedNodesParams): Promise<Node[]> {
    return this.nodeRepo.getNodesByTypeAndRelatedNodes({
      type,
      from_node_id,
      to_node_id,
    });
  }

  // node-property-key
  async getNodePropertyKey(node_id: Nanoid, key_name: string): Promise<Nanoid> {
    return this.nodePropertyKeyRepo.getNodePropertyKey(node_id, key_name);
  }

  async getNodePropertyValue(
    nodeId: Nanoid,
    propertyName: PropertyKeyConst,
  ): Promise<unknown> {
    return this.nodeRepo.getNodePropertyValue(nodeId, propertyName);
  }

  // node-property-value
  async setNodePropertyValue(
    key_id: Nanoid,
    key_value: unknown,
  ): Promise<Nanoid> {
    return this.nodePropertyValueRepo.setNodePropertyValue(key_id, key_value);
  }

  // relationship type
  async createRelationshipType(type_name: string): Promise<string> {
    return this.relationshipTypeRepo.createRelationshipType(type_name);
  }

  async listRelationshipTypes(): Promise<RelationshipType[]> {
    return this.relationshipTypeRepo.listRelationshipTypes();
  }

  // relationship
  async createRelationship(
    from_node_id: Nanoid,
    to_node_id: Nanoid,
    type_name: string,
  ): Promise<Relationship> {
    return this.relationshipRepo.createRelationship(
      from_node_id,
      to_node_id,
      type_name,
    );
  }

  async findRelationship(
    node_1: Nanoid,
    node_2: Nanoid,
    type_name: string,
  ): Promise<Relationship | null> {
    return this.relationshipRepo.findRelationship(node_1, node_2, type_name);
  }

  async listAllRelationshipsByType(type_name: string): Promise<Relationship[]> {
    return this.relationshipRepo.listAllRelationshipsByType(type_name);
  }

  async readRelationship(
    rel_id: Nanoid,
    relations?: string[],
    whereObj?: FindOptionsWhere<Relationship>,
  ): Promise<Relationship | null> {
    return this.relationshipRepo.readRelationship(rel_id, relations, whereObj);
  }

  // async listRelatedNodes(node_id: string): Promise<any> {
  //   return this.relationshipRepo.listRelatedNodes(node_id);
  // }

  // relationship property key
  async getRelationshipPropertyKey(
    rel_id: Nanoid,
    key_name: string,
  ): Promise<Nanoid> {
    return this.relationshipPropertyKeyRepo.getRelationshipPropertyKey(
      rel_id,
      key_name,
    );
  }

  // relationship property value
  async setRelationshipPropertyValue(
    key_id: Nanoid,
    key_value: unknown,
  ): Promise<Nanoid> {
    return this.relationshipPropertyValueRepo.setRelationshipPropertyValue(
      key_id,
      key_value,
    );
  }
}
