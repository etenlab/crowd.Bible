import { LanguageInfo } from '@eten-lab/ui-kit';
// import { LanguageDto } from './language.dto';
import { WordDto } from './word.dto';
import { PropertyKeyConst } from '../constants/graph.constant';

export interface MapDto {
  id: string;
  name: string;
  ext: string;
  mapFileId: string;
  langInfo: LanguageInfo;
  words?: WordDto[];
  [PropertyKeyConst.LANGUAGE_TAG]: string;
  [PropertyKeyConst.DIALECT_TAG]?: string;
  [PropertyKeyConst.REGION_TAG]?: string;
  [key: string]: unknown;
}
