import { GraphFirstLayerService } from './graph-first-layer.service';
import { GraphSecondLayerService } from './graph-second-layer.service';

import { PropertyKeyConst, NodeTypeConst } from '@/constants/graph.constant';

import { DocumentDto } from '@/dtos/document.dto';

import { DocumentMapper } from '@/mappers/document.mapper';

export class DocumentService {
  constructor(
    private readonly graphFirstLayerService: GraphFirstLayerService,
    private readonly graphSecondLayerService: GraphSecondLayerService,
  ) {}

  async createOrFindDocument(name: string): Promise<DocumentDto> {
    const document = await this.getDocument(name);

    if (document) {
      return document;
    }

    const newDocument = await this.graphSecondLayerService.createNodeFromObject(
      NodeTypeConst.DOCUMENT,
      {
        name,
      },
    );

    return {
      id: newDocument.id,
      name,
    };
  }

  async getDocument(name: string): Promise<DocumentDto | null> {
    const document = await this.graphFirstLayerService.getNodeByProp(
      NodeTypeConst.DOCUMENT,
      {
        key: PropertyKeyConst.NAME,
        value: name,
      },
    );

    if (document == null) {
      return null;
    }

    return {
      id: document.id,
      name,
    };
  }

  async listDocument(): Promise<DocumentDto[]> {
    const documents = await this.graphFirstLayerService.listAllNodesByType(
      NodeTypeConst.DOCUMENT,
    );

    return documents.map(DocumentMapper.entityToDto);
  }
}
