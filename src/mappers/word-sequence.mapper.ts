import { SubWordSequenceDto, WordSequenceDto } from '@/dtos/word-sequence.dto';
import { Node, Relationship } from '@/models/index';
import {
  PropertyKeyConst,
  RelationshipTypeConst,
} from '@/constants/graph.constant';
import { subTags2LangInfo } from '@/utils/langUtils';

export class WordSequenceMapper {
  static entityToDto(entity: Node) {
    const dto: WordSequenceDto = Object.create(null);
    dto.id = entity.id;

    const languageTag: Record<string, string> = {};

    entity.propertyKeys.forEach((key) => {
      switch (key.property_key) {
        case PropertyKeyConst.WORD_SEQUENCE: {
          dto.text = JSON.parse(key.propertyValue.property_value).value;

          return;
        }
        case PropertyKeyConst.IMPORT_UID: {
          dto.importUid = JSON.parse(key.propertyValue.property_value).value;

          return;
        }
        case PropertyKeyConst.LANGUAGE_TAG: {
          languageTag.langTag = JSON.parse(
            key.propertyValue.property_value,
          ).value;

          return;
        }
        case PropertyKeyConst.DIALECT_TAG: {
          languageTag.dialectTag = JSON.parse(
            key.propertyValue.property_value,
          ).value;

          return;
        }
        case PropertyKeyConst.REGION_TAG: {
          languageTag.regionTag = JSON.parse(
            key.propertyValue.property_value,
          ).value;

          return;
        }
      }
    });

    entity.toNodeRelationships?.forEach((rel) => {
      switch (rel.relationship_type) {
        case RelationshipTypeConst.WORD_SEQUENCE_TO_CREATOR: {
          dto.creatorId = rel.toNode.id;
          return;
        }
        case RelationshipTypeConst.WORD_SEQUENCE_TO_DOCUMENT: {
          dto.documentId = rel.toNode.id;
          return;
        }
      }
    });

    dto.languageInfo = subTags2LangInfo({
      lang: languageTag.langTag,
      dialect: languageTag.dialectTag,
      region: languageTag.regionTag,
    })!;

    return dto;
  }

  static relationshipToDto(rel: Relationship) {
    const dto: SubWordSequenceDto = WordSequenceMapper.entityToDto(
      rel.toNode,
    ) as SubWordSequenceDto;

    dto.parentWordSequenceId = rel.from_node_id;

    rel.propertyKeys.forEach((key) => {
      if (key.property_key === PropertyKeyConst.POSITION) {
        dto.position = JSON.parse(key.propertyValue.property_value).value;
      }
      if (key.property_key === PropertyKeyConst.LENGTH) {
        dto.length = JSON.parse(key.propertyValue.property_value).value;
      }
    });

    return dto;
  }
}
