import { NodePropertyKeyRepository } from '../repositories/node/node-property-key.repository';
import { NodePropertyValueRepository } from '../repositories/node/node-property-value.repository';
import { NodeTypeRepository } from '../repositories/node/node-type.repository';
import { NodeRepository } from '../repositories/node/node.repository';
import { RelationshipPropertyKeyRepository } from '../repositories/relationship/relationship-property-key.repository';
import { RelationshipPropertyValueRepository } from '../repositories/relationship/relationship-property-value.repository';
import { RelationshipTypeRepository } from '../repositories/relationship/relationship-type.repository';
import { RelationshipRepository } from '../repositories/relationship/relationship.repository';

export class SeedService {
  constructor(
    private nodeRepository: NodeRepository,
    private nodeTypeRepository: NodeTypeRepository,
    private nodePropertyKeyRepository: NodePropertyKeyRepository,
    private nodePropertyValueRepository: NodePropertyValueRepository,
    private relationshipRepository: RelationshipRepository,
    private relationshipTypeRepository: RelationshipTypeRepository,
    private relationshipPropertyKeyRepository: RelationshipPropertyKeyRepository,
    private relationshipPropertyValueRepository: RelationshipPropertyValueRepository,
  ) {}

  async createNodesAndRelationship() {
    // random string of length 10
    const nodeType1 = await this.nodeTypeRepository.createNodeType(
      Math.random().toString(36).substring(2, 10),
    );
    const nodeType2 = await this.nodeTypeRepository.createNodeType(
      Math.random().toString(36).substring(2, 10),
    );
    const node1 = await this.nodeRepository.createNode(nodeType1);
    const node2 = await this.nodeRepository.createNode(nodeType2);

    const relationshipType =
      await this.relationshipTypeRepository.createRelationshipType(
        Math.random().toString(36).substring(2, 10),
      );

    const relationship = await this.relationshipRepository.createRelationship(
      node1.id!,
      node2.id!,
      relationshipType,
    );

    const nodePropKey =
      await this.nodePropertyKeyRepository.createNodePropertyKey(
        node1.id!,
        Math.random().toString(36).substring(2, 10),
      );

    await this.nodePropertyValueRepository.createNodePropertyValue(
      nodePropKey!,
      Math.random().toString(36).substring(2, 10),
    );

    const relationshipPropKey =
      await this.relationshipPropertyKeyRepository.createRelationshipPropertyKey(
        relationship!.id!,
        Math.random().toString(36).substring(2, 10),
      );

    await this.relationshipPropertyValueRepository.createRelationshipPropertyValue(
      relationshipPropKey!,
      Math.random().toString(36).substring(2, 10),
    );
  }
}
