import { LanguageDto } from './lang.dto';
import { WordDto } from './word.dto';

export interface MapDto {
  id: string;
  name: string;
  ext: string;
  map: string;
  langId: string;
  lang?: LanguageDto;
  words?: WordDto[];
  [key: string]: any;
}