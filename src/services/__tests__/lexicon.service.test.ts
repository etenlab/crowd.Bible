import getSingletons from '../../singletons';
import { getTestDataSource } from 'src/data-source';
import LexiconService, { Lexicon } from '../lexicon.service';

describe(LexiconService, () => {
  const getService = () =>
    getSingletons(getTestDataSource()).then(
      ({ lexiconService }) => lexiconService,
    );

  describe('Core Types', () => {
    it('Creates lexica', async () => {
      const service = await getService();

      const d: Partial<Lexicon> = {
        name: 'foo',
      };

      const created = await service.lexica.create(d);
      expect(created).toMatchObject(d);

      const found = await service.lexica.findOneBy({ id: created.id });
      expect(found).toMatchObject(created);
    });
    it.todo('Creates lexical categories');
    it.todo('Creates grammatical categories');
    it.todo('Creates grammemes');
    it.todo('Creates lexemes');
    it.todo('Creates word forms');
  });

  describe('Relationships', () => {
    it.todo('relates lexical categories to lexica');
    it.todo('relates grammatical categories to lexica');
    it.todo('relates lexemes to lexical categories');
    it.todo('relates word forms to lexemes');
    it.todo('relates grammemes to grammatical categories');
  });

  describe('Validations', () => {
    it.todo('checks that a grammeme applies to a grammatical category');
    it.todo('checks that a grammatical category applies to a lexical category');
    it.todo('checks that a lexeme has one lemma');
  });
});
