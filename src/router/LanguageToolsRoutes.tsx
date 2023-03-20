import { Route } from 'react-router-dom';
import { IonRouterOutlet } from '@ionic/react';

import { DictionaryPage } from '@/pages/LanguageTools/DictionaryPage';
import { BilingualDictionaryPage } from '@/pages/LanguageTools/BilingualDictionaryPage';
import { LanguageProficiencyPage } from '@/pages/LanguageTools/LanguageProficiencyPage';
import { KeyTermsPage } from '@/pages/LanguageTools/KeyTermsPage';
import { KeyTermsPageV2 } from '@/pages/LanguageTools/KeyTermsPageV2';
import { LexiconPage } from '@/pages/LanguageTools/LexiconPage';
import { GrammarPage } from '@/pages/LanguageTools/GrammarPage';

export function LanguageToolsRoutes() {
  return (
    <IonRouterOutlet>
      <Route exact path="/dictionary">
        <DictionaryPage />
      </Route>
      <Route exact path="/bilingual-dictionary">
        <BilingualDictionaryPage />
      </Route>
      <Route exact path="/language-proficiency">
        <LanguageProficiencyPage />
      </Route>
      <Route exact path="/key-terms">
        <KeyTermsPage />
      </Route>
      <Route exact path="/key-terms-v2">
        <KeyTermsPageV2 />
      </Route>
      <Route exact path="/lexicon">
        <LexiconPage />
      </Route>
      <Route exact path="/grammar">
        <GrammarPage />
      </Route>
    </IonRouterOutlet>
  );
}
