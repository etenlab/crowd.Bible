import { LanguageInfo } from '@eten-lab/ui-kit';
import {
  compareLangInfo,
  langInfo2tag,
  subTags2LangInfo,
  tag2langInfo,
} from '../langUtils';

describe('langUtils tests', () => {
  describe('tag2langInfo', () => {
    it('convetrs language tag to LanguageInfo object', () => {
      const tag = 'en-UA-basiceng';
      const res = tag2langInfo(tag);
      expect(res).toMatchSnapshot();
    });
  });
  describe('langInfo2tag', () => {
    it('convetrs LanguageInfo object to tag', () => {
      const langInfo: LanguageInfo = {
        dialect: {
          descriptions: ['doesn`t matter'],
          tag: 'basiceng',
        },
        lang: {
          descriptions: ['doesn`t matter'],
          tag: 'en',
        },
        region: {
          descriptions: ['doesn`t matter'],
          tag: 'UA',
        },
      };
      const res = langInfo2tag(langInfo);
      expect(res).toMatchSnapshot();
    });
  });
  describe('subTags2LangInfo', () => {
    it('convetrs subTags to LangInfo', () => {
      const langSubtag = 'en';
      const regionSubtag = 'UA';
      const dialectSubtag = 'basiceng';
      const res = subTags2LangInfo({
        lang: langSubtag,
        region: regionSubtag,
        dialect: dialectSubtag,
      });
      expect(res).toMatchSnapshot();
    });
  });
  describe('compareLangInfo', () => {
    it('compares two LangInfo objects', () => {
      const langSubtag = 'en';
      const regionSubtag = 'UA';
      const dialectSubtag = 'basiceng';
      const langInfo1 = subTags2LangInfo({
        lang: langSubtag,
        region: regionSubtag,
        dialect: dialectSubtag,
      });
      const langInfo2 = subTags2LangInfo({
        lang: langSubtag,
        region: regionSubtag,
        dialect: dialectSubtag,
      });
      expect(compareLangInfo(langInfo1, langInfo2)).toBe(true);
    });
  });
});
