import { MapDto } from '@/src/dtos/map.dto';
import { Node } from '@/src/models';
import { subTags2LangInfo } from '@/src/utils/langUtils';
import { LoggerService } from '@eten-lab/core';
const logger = new LoggerService();

export class MapMapper {
  static entityToDto(entity: Node) {
    const dto: MapDto = Object.create(null);
    dto.id = entity.id;
    if (!entity.propertyKeys) return dto;
    for (const propertyKey of entity.propertyKeys) {
      dto[propertyKey.property_key] = propertyKey.propertyValue?.property_value
        ? JSON.parse(propertyKey.propertyValue?.property_value).value
        : undefined;
    }
    if (!dto.language) {
      logger.fatal(
        { at: 'MapMapper entityToDto conversion', dto, node: entity },
        `Map node ${entity} is damaged (no language tag found while converting) and must be deleted`,
      );
      return dto;
    }
    if (!dto.mapFileId) {
      logger.fatal(
        { at: 'MapMapper entityToDto conversion', dto: dto, node: entity },
        `Map node ${entity} is damaged (no mapFileId found while converting) and must be deleted`,
      );
      return dto;
    }
    const langInfo = subTags2LangInfo({
      lang: dto.language,
      region: dto.region,
      dialect: dto.dialect,
    });
    if (!langInfo)
      throw new Error(`Language for map ${entity.id} is not defined`);
    dto.langInfo = langInfo;
    return dto;
  }
}
