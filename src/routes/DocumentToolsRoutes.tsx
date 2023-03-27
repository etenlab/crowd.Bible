import { Route, Switch } from 'react-router-dom';

import { DocumentsListPage } from '@/pages/DocumentTools/DocumentsListPage';
import { TranslationPage } from '@/pages/DocumentTools/TranslationPage';
import { TranslationCandidatesPage } from '@/pages/DocumentTools/TranslationCandidatesPage';
import { TranslationEditPage } from '@/pages/DocumentTools/TranslationEditPage';
import { FeedbackPage } from '@/pages/DocumentTools/FeedbackPage';
import { TextPartFeedbackPage } from '@/pages/DocumentTools/TextPartFeedbackPage';
import { ChapterFeedbackPage } from '@/pages/DocumentTools/ChapterFeedbackPage';
import { VerseFeedbackPage } from '@/pages/DocumentTools/VerseFeedbackPage';
import { ReaderQAPage } from '@/pages/DocumentTools/ReaderQAPage';
import { TranslatorQAPage } from '@/pages/DocumentTools/TranslatorQAPage';
import { TextPartTranslatorQAPage } from '@/pages/DocumentTools/TextPartTranslatorQAPage';
import { ChapterTranslatorQAPage } from '@/pages/DocumentTools/ChapterTranslatorQAPage';
import { VerseTranslatorQAPage } from '@/pages/DocumentTools/VerseTranslatorQAPage';
import { CommentaryPage } from '@/pages/DocumentTools/CommentaryPage';
import { VersificationPage } from '@/pages/DocumentTools/VersificationPage';
import { AlignmentPage } from '@/pages/DocumentTools/AlignmentPage';

export function DocumentToolsRoutes() {
  return (
    <Switch>
      <Route exact path="/documents-list">
        <DocumentsListPage />
      </Route>

      <Route exact path="/translation">
        <TranslationPage />
      </Route>
      <Route exact path="/translation-edit">
        <TranslationEditPage />
      </Route>
      <Route exact path="/translation-candidates">
        <TranslationCandidatesPage />
      </Route>

      <Route exact path="/feedback">
        <FeedbackPage />
      </Route>
      <Route exact path="/feedback/text-part">
        <TextPartFeedbackPage />
      </Route>
      <Route exact path="/feedback/chapter">
        <ChapterFeedbackPage />
      </Route>
      <Route exact path="/feedback/verse">
        <VerseFeedbackPage />
      </Route>

      <Route exact path="/reader-qa">
        <ReaderQAPage />
      </Route>
      <Route exact path="/translator-qa">
        <TranslatorQAPage />
      </Route>
      <Route exact path="/translator-qa/text-part">
        <TextPartTranslatorQAPage />
      </Route>
      <Route exact path="/translator-qa/chapter">
        <ChapterTranslatorQAPage />
      </Route>
      <Route exact path="/translator-qa/verse">
        <VerseTranslatorQAPage />
      </Route>

      <Route exact path="/commentary">
        <CommentaryPage />
      </Route>

      <Route exact path="/versification">
        <VersificationPage />
      </Route>

      <Route exact path="/alignment">
        <AlignmentPage />
      </Route>
    </Switch>
  );
}
