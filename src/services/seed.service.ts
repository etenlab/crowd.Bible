import { type NodePropertyKeyRepository } from '@/repositories/node/node-property-key.repository';
import { type NodePropertyValueRepository } from '@/repositories/node/node-property-value.repository';
import { type NodeTypeRepository } from '@/repositories/node/node-type.repository';
import { type NodeRepository } from '@/repositories/node/node.repository';
import { type RelationshipPropertyKeyRepository } from '@/repositories/relationship/relationship-property-key.repository';
import { type RelationshipPropertyValueRepository } from '@/repositories/relationship/relationship-property-value.repository';
import { type RelationshipTypeRepository } from '@/repositories/relationship/relationship-type.repository';
import { type RelationshipRepository } from '@/repositories/relationship/relationship.repository';
import { randomLangTags } from '../utils/langUtils';

const DATA_SEEDED = 'DATA_SEEDED';
export class SeedService {
  private get dataSeeded() {
    return localStorage.getItem(DATA_SEEDED) === 'true';
  }
  private set dataSeeded(val: boolean) {
    localStorage.setItem(DATA_SEEDED, val + '');
  }

  constructor(
    private readonly nodeRepository: NodeRepository,
    private readonly nodeTypeRepository: NodeTypeRepository,
    private readonly nodePropertyKeyRepository: NodePropertyKeyRepository,
    private readonly nodePropertyValueRepository: NodePropertyValueRepository,
    private readonly relationshipRepository: RelationshipRepository,
    private readonly relationshipTypeRepository: RelationshipTypeRepository,
    private readonly relationshipPropertyKeyRepository: RelationshipPropertyKeyRepository,
    private readonly relationshipPropertyValueRepository: RelationshipPropertyValueRepository,
  ) {
    this.init();
  }

  async init() {
    try {
      if (this.dataSeeded) return;
      console.log('*** data seeding started ***');
      // No lang nodes are needed anymore
      // await Promise.allSettled([this.seedLanguages()]);
      console.log('*** data seeding completed ***');
      this.dataSeeded = true;
    } catch (error) {
      console.log('seeding failed::', error);
    }
  }

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
      node1.id,
      node2.id,
      relationshipType,
    );

    const nodePropKey = await this.nodePropertyKeyRepository.getNodePropertyKey(
      node1.id,
      Math.random().toString(36).substring(2, 10),
    );

    await this.nodePropertyValueRepository.setNodePropertyValue(
      nodePropKey,
      Math.random().toString(36).substring(2, 10),
    );

    const relationshipPropKey =
      await this.relationshipPropertyKeyRepository.getRelationshipPropertyKey(
        relationship!.id,
        Math.random().toString(36).substring(2, 10),
      );

    await this.relationshipPropertyValueRepository.setRelationshipPropertyValue(
      relationshipPropKey!,
      Math.random().toString(36).substring(2, 10),
    );
  }

  // No lang nodes are needed anymore
  //
  // async seedLanguages(langs?: string[]) {
  //   try {
  //     const langNodes = await this.nodeRepository.repository.find({
  //       relations: ['propertyKeys', 'propertyKeys.propertyValue'],
  //       where: {
  //         node_type: 'language',
  //       },
  //     });

  //     if (langNodes.length) return;

  //     let langList = langs && langs.length > 0 ? langs : [];
  //     if (!langList.length) {
  //       langList = randomLangTags(10);
  //     }

  //     for (const lang of langList) {
  //       const langNode = await this.nodeRepository.createNode('language');
  //       for (const [key, value] of Object.entries({ name: lang })) {
  //         const property_key_id =
  //           await this.nodePropertyKeyRepository.getNodePropertyKey(
  //             langNode.id,
  //             key,
  //           );
  //         if (property_key_id) {
  //           await this.nodePropertyValueRepository.setNodePropertyValue(
  //             property_key_id,
  //             value,
  //           );
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error('failed to seed languages::', error);
  //     throw new Error('failed to seed languages');
  //   }
  // }
}
