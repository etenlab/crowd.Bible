import { PropertyKeyConst } from '../constants/graph.constant';

export interface WordDto {
  id: string;
  name: string;
  [PropertyKeyConst.LANGUAGE_TAG]?: string;
  [PropertyKeyConst.REGION_TAG]?: string;
  [PropertyKeyConst.DIALECT_TAG]?: string;
  [key: string]: unknown;
}
