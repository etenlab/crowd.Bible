import { DocumentDto, AppDto } from '@/dtos/document.dto';
import { Node } from '@/models/index';
import { subTags2LangInfo } from '@/utils/langUtils';

export class DocumentMapper {
  static entityToDto(entity: Node) {
    const dto: DocumentDto = Object.create(null);

    const obj: Record<string, unknown> = {};

    for (const propertyKey of entity.propertyKeys) {
      obj[propertyKey.property_key] = JSON.parse(
        propertyKey.propertyValue?.property_value,
      ).value;
    }

    dto.id = entity.id;
    dto.name = obj.name as string;
    dto.languageInfo = subTags2LangInfo({
      lang: obj.language as string,
      region: obj.region as string | undefined,
      dialect: obj.dialect as string | undefined,
    })!;

    return dto;
  }

  static appEntityToDto(entity: Node) {
    const dto: AppDto = Object.create(null);

    const obj: Record<string, unknown> = {};

    for (const propertyKey of entity.propertyKeys) {
      obj[propertyKey.property_key] = JSON.parse(
        propertyKey.propertyValue?.property_value,
      ).value;
    }

    dto.id = entity.id;
    dto.name = obj.name as string;
    dto.organizationName = obj.organizationName as string;

    dto.languageInfo = subTags2LangInfo({
      lang: obj.language as string,
      region: obj.region as string | undefined,
      dialect: obj.dialect as string | undefined,
    })!;

    return dto;
  }
}
