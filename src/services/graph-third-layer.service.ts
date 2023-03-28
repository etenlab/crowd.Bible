import { GraphFirstLayerService } from './graph-first-layer.service';
import { GraphSecondLayerService } from './graph-second-layer.service';
import { NodeRepository } from '@/repositories/node/node.repository';

import { type Node } from '@/models/node/node.entity';
import { type Relationship } from '@/models/relationship/relationship.entity';

export class GraphThirdLayerService {
  constructor(
    private readonly firstLayerService: GraphFirstLayerService,
    private readonly secondLayerService: GraphSecondLayerService,
    private readonly nodeRepo: NodeRepository,
  ) {}

  // -------- Document --------- //
  async createDocument(name: string): Promise<Document> {
    const document = await this.secondLayerService.createNodeFromObject(
      'document',
      {
        name,
      },
    );

    return {
      id: document.id,
      name,
    };
  }

  async getDocument(name: string): Promise<Document | null> {
    const document = await this.firstLayerService.getNodeByProp('document', {
      key: 'name',
      value: name,
    });

    if (document == null) {
      return null;
    }

    return {
      id: document.id,
      name,
    };
  }

  // --------- Word --------- //
  async createWord(word: string, language: Nanoid): Promise<Nanoid> {
    const word_id = await this.getWord(word, language);

    if (word_id) {
      return word_id;
    }

    const { node } =
      await this.secondLayerService.createRelatedFromNodeFromObject(
        'word',
        { name: word },
        'word-to-language-entry',
        language,
      );

    return node.id;
  }

  async getWord(word: string, language: Nanoid): Promise<Nanoid | null> {
    const wordNode = await this.firstLayerService.getNodeByProp(
      'word',
      {
        key: 'name',
        value: word,
      },
      {
        to_node_id: language,
      },
    );

    if (!wordNode) {
      return null;
    }

    return wordNode.id;
  }

  // --------- Word-Translation --------- //
  async createWordTranslationRelationship(
    from: Nanoid,
    to: Nanoid,
  ): Promise<Nanoid> {
    const translation = await this.firstLayerService.findRelationship(
      from,
      to,
      'word-to-translation',
    );

    if (translation) {
      return translation.id;
    }

    const new_translation =
      await this.secondLayerService.createRelationshipFromObject(
        'word-to-translation',
        {},
        from,
        to,
      );

    return new_translation.id;
  }

  // --------- Word-Sequence --------- //
  async createWordSequence(
    text: string,
    document: Nanoid,
    creator: Nanoid,
    import_uid: string,
    language: Nanoid,
  ): Promise<Node> {
    const word_sequence = await this.secondLayerService.createNodeFromObject(
      'word-sequence',
      {
        'import-uid': import_uid,
      },
    );

    const words = text.split(' ');

    for (const [i, word] of words.entries()) {
      const new_word_id = await this.createWord(word, language);
      await this.secondLayerService.createRelationshipFromObject(
        'word-sequence-to-word',
        { position: i + 1 },
        word_sequence.id,
        new_word_id,
      );
    }

    await this.secondLayerService.createRelationshipFromObject(
      'word-sequenece-to-language-entry',
      {},
      word_sequence.id,
      language,
    );

    await this.secondLayerService.createRelationshipFromObject(
      'word-sequence-to-document',
      {},
      word_sequence.id,
      document,
    );

    await this.secondLayerService.createRelationshipFromObject(
      'word-sequence-to-creator',
      {},
      word_sequence.id,
      creator,
    );

    return word_sequence;
  }

  async getText(word_sequence_id: Nanoid): Promise<Nanoid | null> {
    const word_sequence = await this.nodeRepo.repository.findOne({
      relations: [
        'nodeRelationships',
        'nodeRelationships.toNode',
        'nodeRelationships.toNode.propertyKeys',
        'nodeRelationships.toNode.propertyKeys.propertyValue',
      ],
      where: {
        node_id: word_sequence_id,
      },
    });

    if (word_sequence == null || word_sequence.nodeRelationships == null) {
      return null;
    }

    const words: string[] = [];

    word_sequence.nodeRelationships.forEach((rel) => {
      if (rel.relationship_type === 'word-sequence-to-word') {
        words.push(
          JSON.parse(
            rel.toNode.propertyKeys.find((key) => key.property_key === 'word')
              ?.propertyValue.property_value ?? '',
          ).value,
        );
      }
    });

    return words.join(' ');
  }

  // --------- Word-Sequence-Connection --------- //
  async appendWordSequence(from: Nanoid, to: Nanoid): Promise<Relationship> {
    const word_sequence_connection =
      await this.secondLayerService.createRelationshipFromObject(
        'word-sequence-to-word-sequence',
        {},
        from,
        to,
      );

    return word_sequence_connection;
  }

  async getWordSequence(text: string): Promise<Nanoid[]> {
    const word_sequences = await this.nodeRepo.listAllNodesByType(
      'word-sequence',
    );
    const filtered_word_sequences = await Promise.all(
      word_sequences.filter(async (word_sequence) => {
        const word_sequence_text = await this.getText(word_sequence.id);
        return word_sequence_text === text;
      }),
    );

    return filtered_word_sequences.map((sequence) => sequence.id);
  }

  // --------- Word-Sequence-Translation --------- //

  async createWordSequenceTranslationRelationship(
    from: Nanoid,
    to: Nanoid,
  ): Promise<Nanoid> {
    const translation = await this.firstLayerService.findRelationship(
      from,
      to,
      'word-sequence-to-translation',
    );

    if (translation) {
      return translation.id;
    }

    const new_translation =
      await this.secondLayerService.createRelationshipFromObject(
        'word-sequence-to-translation',
        {},
        from,
        to,
      );

    return new_translation.id;
  }
}

interface Document {
  id?: string;
  name: string;
}
