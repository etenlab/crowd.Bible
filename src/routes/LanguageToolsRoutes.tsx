import { BilingualDictionaryPage } from '@/pages/LanguageTools/BilingualDictionaryPage';
import { LanguageProficiencyPage } from '@/pages/LanguageTools/LanguageProficiencyPage';
import { PhraseBookPage } from '@/pages/LanguageTools/PhraseBookPage';
import { LexiconPage } from '@/pages/LanguageTools/LexiconPage';
import { GrammarPage } from '@/pages/LanguageTools/GrammarPage';
import { DictionaryPage } from '@/pages/LanguageTools/DictionaryPage';

import { RouteConst } from '@/constants/route.constant';
import { CustomRouteProps } from './AppRoutes';

export const LanguageToolsRoutes: CustomRouteProps[] = [
  {
    path: RouteConst.DICTIONARY,
    children: <DictionaryPage />,
  },
  {
    path: RouteConst.BILINGUAL_DICTIONARY,
    children: <BilingualDictionaryPage />,
  },
  {
    path: RouteConst.LANGUAGE_PROFICIENCY,
    children: <LanguageProficiencyPage />,
  },
  {
    path: RouteConst.PHRASE_BOOK,
    children: <PhraseBookPage />,
  },
  {
    path: RouteConst.LEXICON,
    children: <LexiconPage />,
  },
  {
    path: RouteConst.GRAMMAR,
    children: <GrammarPage />,
  },
];
