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

  async createOrFindDocument(
    name: string,
    langInfo: LanguageInfo,
  ): Promise<DocumentDto> {
    const document = await this.getDocument(name, langInfo);

    if (document) {
      return document;
    }

    const newDocument = await this.graphSecondLayerService.createNodeFromObject(
      NodeTypeConst.DOCUMENT,
      {
        name,
        [PropertyKeyConst.LANGUAGE_TAG]: langInfo.lang.tag,
        [PropertyKeyConst.DIALECT_TAG]: langInfo.dialect?.tag,
        [PropertyKeyConst.REGION_TAG]: langInfo.region?.tag,
      },
    );

    return {
      id: newDocument.id,
      name,
      languageInfo: langInfo,
    };
  }

  async getDocument(
    name: string,
    langInfo: LanguageInfo,
  ): Promise<DocumentDto | null> {
    const documentIds = await this.graphFirstLayerService.getNodeIdsByProps(
      NodeTypeConst.DOCUMENT,
      [
        {
          key: PropertyKeyConst.NAME,
          value: name,
        },
        {
          key: PropertyKeyConst.LANGUAGE_TAG,
          value: langInfo.lang.tag,
        },
        {
          key: PropertyKeyConst.DIALECT_TAG,
          value: langInfo.dialect?.tag,
        },
        {
          key: PropertyKeyConst.REGION_TAG,
          value: langInfo.region?.tag,
        },
      ],
    );

    if (documentIds.length === 0) {
      return null;
    }

    return {
      id: documentIds[0],
      name,
      languageInfo: langInfo,
    };
  }

  async getDocumentById(id: Nanoid): Promise<DocumentDto | null> {
    const documentNode = await this.graphFirstLayerService.readNode(id, [
      'propertyKeys',
      'propertyKeys.propertyValue',
    ]);

    if (documentNode === null) {
      return null;
    }

    return DocumentMapper.entityToDto(documentNode);
  }

  async listDocument(): Promise<DocumentDto[]> {
    const documents = await this.graphFirstLayerService.listAllNodesByType(
      NodeTypeConst.DOCUMENT,
    );

    return documents.map(DocumentMapper.entityToDto);
  }

  async listDocumentByLanguageInfo(
    langInfo: LanguageInfo,
  ): Promise<DocumentDto[]> {
    const documentIds = await this.graphFirstLayerService.getNodeIdsByProps(
      NodeTypeConst.DOCUMENT,
      [
        {
          key: PropertyKeyConst.LANGUAGE_TAG,
          value: langInfo.lang.tag,
        },
        {
          key: PropertyKeyConst.DIALECT_TAG,
          value: langInfo.dialect?.tag,
        },
        {
          key: PropertyKeyConst.REGION_TAG,
          value: langInfo.region?.tag,
        },
      ],
    );

    const documentList = [];

    for (const id of documentIds) {
      const document = await this.getDocumentById(id);
      if (!document) {
        continue;
      }
      documentList.push(document);
    }

    return documentList;
  }

  /**
   * @deprecated
   * just testing purpurse
   */
  async createOrFindApp(
    name: string,
    organizationName: string,
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
        organizationName,
        [PropertyKeyConst.LANGUAGE_TAG]: languageInfo.lang.tag,
        [PropertyKeyConst.DIALECT_TAG]: languageInfo.dialect?.tag,
        [PropertyKeyConst.REGION_TAG]: languageInfo.region?.tag,
      },
    );

    return {
      id: newApp.id,
      name,
      organizationName,
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

    const appEntity = await this.graphFirstLayerService.readNode(appNode.id, [
      'propertyKeys',
      'propertyKeys.propertyValue',
    ]);

    return DocumentMapper.appEntityToDto(appEntity!);
  }

  /**
   * @deprecated
   * just testing purpurse
   */
  async getAppById(id: Nanoid): Promise<AppDto | null> {
    const appNode = await this.graphFirstLayerService.readNode(id, [
      'propertyKeys',
      'propertyKeys.propertyValue',
    ]);

    if (appNode === null) {
      return null;
    }

    return DocumentMapper.appEntityToDto(appNode);
  }

  /**
   * @deprecated
   * just testing purpurse
   */
  async listAppByLanguageInfo(langInfo: LanguageInfo): Promise<AppDto[]> {
    const appIds = await this.graphFirstLayerService.getNodeIdsByProps(
      NodeTypeConst.MOCK_APP,
      [
        {
          key: PropertyKeyConst.LANGUAGE_TAG,
          value: langInfo.lang.tag,
        },
        {
          key: PropertyKeyConst.DIALECT_TAG,
          value: langInfo.dialect?.tag,
        },
        {
          key: PropertyKeyConst.REGION_TAG,
          value: langInfo.region?.tag,
        },
      ],
    );

    const appList = [];

    for (const id of appIds) {
      const app = await this.getAppById(id);
      if (!app) {
        continue;
      }
      appList.push(app);
    }

    return appList;
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
