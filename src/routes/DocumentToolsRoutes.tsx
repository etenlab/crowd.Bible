import { DocumentsListPage } from '@/pages/DocumentTools/DocumentsListPage';
import { DocumentViewerPage } from '@/pages/DocumentTools/DocumentViewerPage';
import { NewDocumentAddPage } from '@/pages/DocumentTools/NewDocumentAddPage';

import { TranslationDocumentListPage } from '@/pages/DocumentTools/TranslationDocumentListPage';
import { TranslationPage } from '@/pages/DocumentTools/TranslationPage';
// import { TranslationCandidatesPage } from '@/pages/DocumentTools/TranslationCandidatesPage';
import { TranslationEditPage } from '@/pages/DocumentTools/TranslationEditPage';

import { FeedbackPage } from '@/pages/DocumentTools/FeedbackPage';
import { TextPartFeedbackPage } from '@/pages/DocumentTools/TextPartFeedbackPage';
import { ChapterFeedbackPage } from '@/pages/DocumentTools/ChapterFeedbackPage';
import { VerseFeedbackPage } from '@/pages/DocumentTools/VerseFeedbackPage';

import { QAMenuPage } from '@/pages/DocumentTools/QAMenuPage';
import { ReaderQAPage } from '@/pages/DocumentTools/ReaderQAPage';
import { TranslatorQAPage } from '@/pages/DocumentTools/TranslatorQAPage';
import { TextPartTranslatorQAPage } from '@/pages/DocumentTools/TextPartTranslatorQAPage';
import { ChapterTranslatorQAPage } from '@/pages/DocumentTools/ChapterTranslatorQAPage';
import { VerseTranslatorQAPage } from '@/pages/DocumentTools/VerseTranslatorQAPage';

import { CommentaryPage } from '@/pages/DocumentTools/CommentaryPage';
import { VersificationPage } from '@/pages/DocumentTools/VersificationPage';
import { AlignmentPage } from '@/pages/DocumentTools/AlignmentPage';

import { RouteConst } from '@/constants/route.constant';
import { CustomRouteProps } from './AppRoutes';

export const DocumentToolsRoutes: CustomRouteProps[] = [
  {
    path: RouteConst.DOCUMENTS_LIST,
    children: <DocumentsListPage />,
  },
  {
    path: `${RouteConst.DOCUMENTS_LIST}/:documentId`,
    children: <DocumentViewerPage />,
  },
  {
    path: RouteConst.ADD_DOCUMENT,
    children: <NewDocumentAddPage />,
  },
  {
    path: RouteConst.TRANSLATION_DOCUMENTS_LIST,
    children: <TranslationDocumentListPage />,
  },
  {
    path: `${RouteConst.TRANSLATION}/:documentId`,
    children: <TranslationPage />,
  },
  {
    path: `${RouteConst.TRANSLATION_EDIT}/:documentId/:wordSequenceId`,
    children: <TranslationEditPage />,
  },
  {
    path: `${RouteConst.TRANSLATION_EDIT}/:documentId`,
    children: <TranslationEditPage />,
  },
  // {
  //   path: RouteConst.TRANSLATION_EDIT,
  //   children: <TranslationCandidatesPage />,
  // },
  {
    path: `${RouteConst.FEEDBACK}/:documentId`,
    children: <FeedbackPage />,
  },
  {
    path: `${RouteConst.FEEDBACK}/text-part`,
    children: <TextPartFeedbackPage />,
  },
  {
    path: `${RouteConst.FEEDBACK}/chapter`,
    children: <ChapterFeedbackPage />,
  },
  {
    path: `${RouteConst.FEEDBACK}/verse`,
    children: <VerseFeedbackPage />,
  },
  {
    path: RouteConst.QA_MENU_PAGE,
    children: <QAMenuPage />,
  },
  {
    path: RouteConst.READER_QA,
    children: <ReaderQAPage />,
  },
  {
    path: RouteConst.TRANSLATOR_QA,
    children: <TranslatorQAPage />,
  },
  {
    path: `${RouteConst.TRANSLATOR_QA}/text-part`,
    children: <TextPartTranslatorQAPage />,
  },
  {
    path: `${RouteConst.TRANSLATOR_QA}/chapter`,
    children: <ChapterTranslatorQAPage />,
  },
  {
    path: `${RouteConst.TRANSLATOR_QA}/verse`,
    children: <VerseTranslatorQAPage />,
  },
  {
    path: RouteConst.COMMENTARY,
    children: <CommentaryPage />,
  },
  {
    path: RouteConst.VERSIFICATION,
    children: <VersificationPage />,
  },
  {
    path: RouteConst.ALIGNMENT,
    children: <AlignmentPage />,
  },
];
