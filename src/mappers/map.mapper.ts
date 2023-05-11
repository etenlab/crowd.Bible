import { MapDto } from '../dtos/map.dto';
import { Node } from '@/src/models';
import { subTags2LangInfo } from '../utils/langUtils';

export class MapMapper {
  static entityToDto(entity: Node) {
    const dto: MapDto = Object.create(null);
    dto.id = entity.id;
    if (!entity.propertyKeys) return dto;
    for (const propertyKey of entity.propertyKeys) {
      dto[propertyKey.property_key] = JSON.parse(
        propertyKey.propertyValue?.property_value,
      ).value;
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
