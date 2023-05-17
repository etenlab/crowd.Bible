import { Node } from '@/src/models';
import { subTags2LangInfo } from '@/utils/langUtils';
export class LanguageMapper {
  static entityToDto(entity: Node) {
    const dto: Record<string, unknown> = Object.create(null);
    dto.id = entity.id;
    if (!entity.propertyKeys) return null;

    for (const propertyKey of entity.propertyKeys) {
      dto[propertyKey.property_key] = JSON.parse(
        propertyKey.propertyValue?.property_value,
      ).value;
    }

    const langInfo = subTags2LangInfo({
      lang: dto.language as string,
      region: dto.region as string | undefined,
      dialect: dto.dialect as string | undefined,
    });

    if (!langInfo) {
      throw new Error(`Language for map ${entity.id} is not defined`);
    }

    return langInfo;
  }
}
