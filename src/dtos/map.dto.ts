import { LanguageDto } from './lang.dto';

export interface MapDto {
  id: string;
  name: string;
  ext: string;
  map: string;
  langId: string;
  lang?: LanguageDto;
  [key: string]: any;
}
