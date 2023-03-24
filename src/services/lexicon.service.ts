import { NodeService } from './node.service';
import { Node } from '@/models/node/node.entity';
import { InferType, object, Schema, string } from 'yup';
import { NodeRepository } from '@/repositories/node/node.repository';
import { FindOptionsWhere } from 'typeorm';

export enum LexiconNodeType {
  Lexicon = 'lexicon',
}

const lexiconSchema = object({
  id: string().uuid().required(),
  name: string().min(1).required(),
});
export type Lexicon = InferType<typeof lexiconSchema>;

export class CRUDService<T> {
  constructor(
    private readonly nodeType: string,
    private readonly schema: Schema<T>,
    private readonly nodeService: NodeService,
    private readonly nodeRepo: NodeRepository,
  ) {}

  private async ofNode(node: Node): Promise<T> {
    const props = node.propertyKeys || [];
    const obj = props.reduce((acc, key) => {
      let value;
      try {
        value = JSON.parse(key.propertyValue.property_value);
      } catch (err) {
        console.warn(err);
      }

      if (value && 'value' in value) {
        return {
          ...acc,
          [key.property_key]: value.value,
        };
      } else {
        return acc;
      }
    }, {});

    try {
      return this.schema.cast({ id: node.id, ...obj });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'unknown error';
      const json = JSON.stringify(obj);
      const desc = JSON.stringify(this.schema.describe());
      throw new Error(
        `Failed to cast object "${json}" to schema ${desc}: ${msg}`,
      );
    }
  }

  private findOptsFromWhere(opts: FindOptionsWhere<Node>) {
    return {
      where: opts,
      relations: {
        propertyKeys: {
          propertyValue: true,
        },
      },
    };
  }

  private async findNodeBy(opts: FindOptionsWhere<Node>): Promise<Node[]> {
    return await this.nodeRepo.repository.find(this.findOptsFromWhere(opts));
  }

  private async findOneNodeBy(
    opts: FindOptionsWhere<Node>,
  ): Promise<Node | null> {
    return await this.nodeRepo.repository.findOne(this.findOptsFromWhere(opts));
  }

  async create(obj: Partial<T>): Promise<T> {
    const node = await this.nodeService.createNodeFromObject(
      this.nodeType,
      obj,
    );

    const entity = await this.findOneNodeBy({ id: node.id });
    if (entity) {
      return this.ofNode(entity);
    } else {
      throw new Error(
        `Failed to create node from object: "${JSON.stringify(obj)}"`,
      );
    }
  }

  async findBy(opts: Partial<T>): Promise<T[]> {
    const nodes = await this.findNodeBy(opts);
    return Promise.all(nodes.map(this.ofNode));
  }

  async findOneBy(opts: Partial<T>): Promise<T | null> {
    const node = await this.findOneNodeBy(opts);
    return node ? this.ofNode(node) : null;
  }
}

export default class LexiconService {
  public lexica: CRUDService<Lexicon>;

  constructor(nodeService: NodeService, nodeRepo: NodeRepository) {
    this.lexica = new CRUDService(
      LexiconNodeType.Lexicon,
      lexiconSchema,
      nodeService,
      nodeRepo,
    );
  }
}
