import { LanguageInfo } from '@eten-lab/ui-kit';
// import { LanguageDto } from './language.dto';
import { WordDto } from './word.dto';
import { PropertyKeyConst } from '@/constants/graph.constant';

export interface MapDto {
  id: string;
  langInfo: LanguageInfo;
  words?: WordDto[];
  [PropertyKeyConst.NAME]: string;
  [PropertyKeyConst.EXT]: string;
  [PropertyKeyConst.MAP_FILE_ID]: string;
  [PropertyKeyConst.IS_PROCESSING_FINISHED]: boolean;
  [PropertyKeyConst.LANGUAGE_TAG]: string;
  [PropertyKeyConst.DIALECT_TAG]?: string;
  [PropertyKeyConst.REGION_TAG]?: string;
  [key: string]: unknown;
}
