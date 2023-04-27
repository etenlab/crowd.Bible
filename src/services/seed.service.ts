import { type NodePropertyKeyRepository } from '@/repositories/node/node-property-key.repository';
import { type NodePropertyValueRepository } from '@/repositories/node/node-property-value.repository';
import { type NodeTypeRepository } from '@/repositories/node/node-type.repository';
import { type NodeRepository } from '@/repositories/node/node.repository';
import { type RelationshipPropertyKeyRepository } from '@/repositories/relationship/relationship-property-key.repository';
import { type RelationshipPropertyValueRepository } from '@/repositories/relationship/relationship-property-value.repository';
import { type RelationshipTypeRepository } from '@/repositories/relationship/relationship-type.repository';
import { type RelationshipRepository } from '@/repositories/relationship/relationship.repository';
import { type DiscussionRepository } from '@/repositories/discussion/discussion.repository';
import { type PostRepository } from '@/repositories/discussion/post.repository';
import { type ElectionRepository } from '@/repositories/voting/election.repository';
import { type CandidateRepository } from '@/repositories/voting/candidate.repository';
import { type VoteRepository } from '@/src/repositories/voting/vote.repository';
import { nanoid } from 'nanoid';
import { SeedVersificationService } from './seed-versification.service';

const DATA_SEEDED = 'DATA_SEEDED';
export class SeedService {
  private get dataSeeded() {
    return localStorage.getItem(DATA_SEEDED) === 'true';
  }
  private set dataSeeded(val: boolean) {
    localStorage.setItem(DATA_SEEDED, val + '');
  }

  constructor(
    readonly nodeRepository: NodeRepository,
    readonly nodeTypeRepository: NodeTypeRepository,
    readonly nodePropertyKeyRepository: NodePropertyKeyRepository,
    readonly nodePropertyValueRepository: NodePropertyValueRepository,
    readonly relationshipRepository: RelationshipRepository,
    readonly relationshipTypeRepository: RelationshipTypeRepository,
    readonly relationshipPropertyKeyRepository: RelationshipPropertyKeyRepository,
    readonly relationshipPropertyValueRepository: RelationshipPropertyValueRepository,
    readonly discussionRepository: DiscussionRepository,
    readonly postRepository: PostRepository,
    readonly electionRepository: ElectionRepository,
    readonly candidateRepository: CandidateRepository,
    readonly voteRepository: VoteRepository,
  ) {
    this.init();
  }

  async init() {
    try {
      if (this.dataSeeded) return;
      console.log('*** data seeding started ***');
      await this.seedLanguages();
      await new SeedVersificationService(this).init();
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

  async seedLanguages(langs?: string[]) {
    try {
      const langNodes = await this.nodeRepository.repository.find({
        relations: ['propertyKeys', 'propertyKeys.propertyValue'],
        where: {
          node_type: 'language',
        },
      });

      if (langNodes.length) return;

      const langList = langs && langs.length > 0 ? langs : [];
      if (!langList.length) {
        for (let index = 0; index < 10; index++) {
          langList.push(`language_${nanoid(4)}`);
        }
      }

      for (const lang of langList) {
        const langNode = await this.nodeRepository.createNode('language');
        await this.insertPropsToNode(langNode.id, { name: lang });
      }
    } catch (error) {
      console.error('failed to seed languages::', error);
      throw new Error('failed to seed languages');
    }
  }

  async insertPropsToNode(nodeId: string, props: Record<string, unknown>) {
    for (const [key, value] of Object.entries(props)) {
      const property_key_id =
        await this.nodePropertyKeyRepository.getNodePropertyKey(nodeId, key);
      if (property_key_id) {
        await this.nodePropertyValueRepository.setNodePropertyValue(
          property_key_id,
          value,
        );
      }
    }
  }
}
