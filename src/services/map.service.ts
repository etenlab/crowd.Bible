import { GraphFirstLayerService } from './graph-first-layer.service';
import { GraphSecondLayerService } from './graph-second-layer.service';

import { WordService } from './word.service';

import {
  NodeTypeConst,
  RelationshipTypeConst,
} from '@/constants/graph.constant';

import { NodeRepository } from '@/repositories/node/node.repository';

import { MapDto } from '@/dtos/map.dto';

import { MapMapper } from '@/mappers/map.mapper';

export class MapService {
  constructor(
    private readonly graphFirstLayerService: GraphFirstLayerService,
    private readonly graphSecondLayerService: GraphSecondLayerService,

    private readonly wordService: WordService,

    private readonly nodeRepo: NodeRepository,
  ) {}

  async saveMap(
    langId: Nanoid,
    mapInfo: {
      name: string;
      mapFileId: string;
      ext: string;
    },
  ): Promise<Nanoid | null> {
    const res =
      await this.graphSecondLayerService.createRelatedFromNodeFromObject(
        NodeTypeConst.MAP_LANG,
        {},
        NodeTypeConst.MAP,
        mapInfo,
        langId,
      );
    return res.node.id;
  }

  async getMap(mapId: Nanoid): Promise<MapDto | null> {
    const langNode = await this.nodeRepo.repository.findOne({
      relations: ['propertyKeys', 'propertyKeys.propertyValue'],
      where: {
        id: mapId,
        node_type: NodeTypeConst.MAP,
      },
    });

    if (!langNode) {
      return null;
    }

    return MapMapper.entityToDto(langNode);
  }

  async getMaps(langId?: Nanoid) {
    const mapNodes = await this.nodeRepo.repository.find({
      relations: [
        'propertyKeys',
        'propertyKeys.propertyValue',
        'toNodeRelationships',
      ],
      where: {
        node_type: NodeTypeConst.MAP,
        toNodeRelationships: {
          relationship_type: NodeTypeConst.MAP_LANG,
          to_node_id: langId,
        },
      },
    });

    const dtos = mapNodes.map((node) => MapMapper.entityToDto(node));
    return dtos;
  }

  async getMapWords(mapId: Nanoid) {
    return this.wordService.getWords({
      to_node_id: mapId,
      relationship_type: RelationshipTypeConst.WORD_MAP,
    });
  }
}
