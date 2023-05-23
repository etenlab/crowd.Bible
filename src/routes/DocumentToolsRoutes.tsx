import { Route, Switch } from 'react-router-dom';

import { DocumentsListPage } from '@/pages/DocumentTools/DocumentsListPage';
import { DocumentViewerPage } from '@/pages/DocumentTools/documentViewerPage';
import { NewDocumentAddPage } from '@/pages/DocumentTools/NewDocumentAddPage';

import { TranslationDocumentListPage } from '@/pages/DocumentTools/TranslationDocumentListPage';
import { TranslationPage } from '@/pages/DocumentTools/TranslationPage';
// import { TranslationCandidatesPage } from '@/pages/DocumentTools/TranslationCandidatesPage';
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

import { RouteConst } from '@/constants/route.constant';

export function DocumentToolsRoutes() {
  return (
    <Switch>
      <Route exact path={RouteConst.DOCUMENTS_LIST}>
        <DocumentsListPage />
      </Route>
      <Route exact path={`${RouteConst.DOCUMENTS_LIST}/:documentId`}>
        <DocumentViewerPage />
      </Route>
      <Route exact path={`${RouteConst.ADD_DOCUMENT}`}>
        <NewDocumentAddPage />
      </Route>

      <Route exact path={`${RouteConst.TRANSLATION_DOCUMENTS_LIST}`}>
        <TranslationDocumentListPage />
      </Route>
      <Route exact path={`${RouteConst.TRANSLATION}/:documentId`}>
        <TranslationPage />
      </Route>
      <Route
        exact
        path={`${RouteConst.TRANSLATION_EDIT}/:documentId/:wordSequenceId`}
      >
        <TranslationEditPage />
      </Route>
      <Route exact path={`${RouteConst.TRANSLATION_EDIT}/:documentId`}>
        <TranslationEditPage />
      </Route>
      {/* <Route exact path={RouteConst.TRANSLATION_EDIT}>
        <TranslationCandidatesPage />
      </Route> */}

      <Route exact path="/feedback/:documentId">
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
