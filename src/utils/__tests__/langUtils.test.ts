import { LanguageInfo } from '@eten-lab/ui-kit';
import { langInfo2tag, tag2langInfo } from '../langUtils';

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
});
