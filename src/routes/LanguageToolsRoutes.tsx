import { Route, Switch } from 'react-router-dom';

import { BilingualDictionaryPage } from '@/pages/LanguageTools/BilingualDictionaryPage';
import { LanguageProficiencyPage } from '@/pages/LanguageTools/LanguageProficiencyPage';
import { PhraseBookPage } from '@/pages/LanguageTools/PhraseBookPage';
import { LexiconPage } from '@/pages/LanguageTools/LexiconPage';
import { GrammarPage } from '@/pages/LanguageTools/GrammarPage';
import { DictionaryPage } from '@/pages/LanguageTools/DictionaryPage';

export function LanguageToolsRoutes() {
  return (
    <Switch>
      <Route exact path="/dictionary">
        <DictionaryPage />
      </Route>
      <Route exact path="/bilingual-dictionary">
        <BilingualDictionaryPage />
      </Route>
      <Route exact path="/language-proficiency">
        <LanguageProficiencyPage />
      </Route>
      <Route exact path="/phrase-book">
        <PhraseBookPage />
      </Route>
      <Route exact path="/phrase-book-v2">
        <PhraseBookPage />
      </Route>
      <Route exact path="/lexicon">
        <LexiconPage />
      </Route>
      <Route exact path="/grammar">
        <GrammarPage />
      </Route>
    </Switch>
  );
}
