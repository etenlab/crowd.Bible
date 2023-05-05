import { PropertyKeyConst } from '../constants/graph.constant';
import { LanguageInfo } from '../pages/LanguageTools/DictionaryPage';

export const makeFindPropsByLang = (
  langInfo: LanguageInfo,
): { key: string; value: string }[] => {
  const res: Array<{ key: string; value: string }> = [
    {
      key: PropertyKeyConst.LANGUAGE_TAG,
      value: langInfo.lang.tag,
    },
  ];
  if (langInfo.dialect?.tag) {
    res.push({
      key: PropertyKeyConst.DIALECT_TAG,
      value: langInfo.dialect.tag,
    });
  }
  if (langInfo.region?.tag) {
    res.push({
      key: PropertyKeyConst.REGION_TAG,
      value: langInfo.region.tag,
    });
  }
  return res;
};
