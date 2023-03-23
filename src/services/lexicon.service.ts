import { NodeService } from './node.service';
import { Node } from '@/models/node/node.entity';
import { InferType, object, Schema, string } from 'yup';
import { NodeRepository } from '@/repositories/node/node.repository';

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
    const obj = props.reduce(
      (acc, key) => ({
        ...acc,
        [key.property_key]: key.propertyValue.property_value,
      }),
      {},
    );

    return this.schema.cast(obj);
  }

  async create(obj: Partial<T>): Promise<T> {
    const node = await this.nodeService.createNodeFromObject(
      this.nodeType,
      obj,
    );

    return this.ofNode(node);
  }

  async findBy(opts: Partial<T>): Promise<T[]> {
    const nodes = await this.nodeRepo.repository.findBy(opts);
    return Promise.all(nodes.map(this.ofNode));
  }

  async findOneBy(opts: Partial<T>): Promise<T | null> {
    const node = await this.nodeRepo.repository.findOneBy(opts);
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
