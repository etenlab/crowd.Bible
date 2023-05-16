import { GraphFirstLayerService } from './graph-first-layer.service';
import { GraphSecondLayerService } from './graph-second-layer.service';

import { PropertyKeyConst, NodeTypeConst } from '@/constants/graph.constant';

import { DocumentDto, AppDto } from '@/dtos/document.dto';

import { DocumentMapper } from '@/mappers/document.mapper';
import { LanguageInfo } from '@eten-lab/ui-kit';

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

  /**
   * @deprecated
   * just testing purpurse
   */
  async createOrFindApp(
    name: string,
    languageInfo: LanguageInfo,
  ): Promise<AppDto> {
    const app = await this.getApp(name);

    if (app) {
      return app;
    }

    const newApp = await this.graphSecondLayerService.createNodeFromObject(
      NodeTypeConst.MOCK_APP,
      {
        name,
        [PropertyKeyConst.LANGUAGE_TAG]: languageInfo.lang.tag,
        [PropertyKeyConst.DIALECT_TAG]: languageInfo.dialect?.tag,
        [PropertyKeyConst.REGION_TAG]: languageInfo.region?.tag,
      },
    );

    return {
      id: newApp.id,
      name,
      languageInfo,
    };
  }

  /**
   * @deprecated
   * just testing purpurse
   */
  async getApp(name: string): Promise<AppDto | null> {
    const appNode = await this.graphFirstLayerService.getNodeByProp(
      NodeTypeConst.MOCK_APP,
      {
        key: PropertyKeyConst.NAME,
        value: name,
      },
    );

    if (appNode === null) {
      return null;
    }

    return DocumentMapper.appEntityToDto(appNode!);
  }

  /**
   * @deprecated
   *  just testing purpurse
   */
  async listApp(): Promise<AppDto[]> {
    const apps = await this.graphFirstLayerService.listAllNodesByType(
      NodeTypeConst.MOCK_APP,
    );

    return apps.map(DocumentMapper.appEntityToDto);
  }
}
