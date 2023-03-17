import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import NotificationsPage from './pages/Notifications';
import { WelcomePage } from './pages/WelcomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { SettingsPage } from './pages/SettingsPage';
import { DocumentsListPage } from './pages/DocumentsListPage';
import { TranslationPage } from './pages/TranslationPage';
import { TranslationCandidatesPage } from './pages/TranslationCandidatesPage';
import { TranslationEditPage } from './pages/TranslationEditPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { TextPartFeedbackPage } from './pages/TextPartFeedbackPage';
import { ChapterFeedbackPage } from './pages/ChapterFeedbackPage';
import { VerseFeedbackPage } from './pages/VerseFeedbackPage';
import { ReaderQAPage } from './pages/ReaderQAPage';
import { TranslatorQAPage } from './pages/TranslatorQAPage';
import { TextPartTranslatorQAPage } from './pages/TextPartTranslatorQAPage';
import { ChapterTranslatorQAPage } from './pages/ChapterTranslatorQAPage';
import { VerseTranslatorQAPage } from './pages/VerseTranslatorQAPage';
import { DiscussionPage } from './pages/DiscussionPage';

import { ThemeProvider } from '@eten-lab/ui-kit';
import { AppContextProvider } from './AppContext';
import { PageLayout } from './components/PageLayout';
import { HomePage } from './pages/HomePage';
import { DiscussionsListPage } from './pages/DiscussionsListPage';
import { FileImportPage } from './pages/FileImportPage';
import { GraphViewerPage } from './pages/GraphViewerPage';
import { DictionaryPage } from './pages/DictionaryPage';
import { BilingualDictionaryPage } from './pages/BilingualDictionaryPage';
import { LanguageProficiencyPage } from './pages/LanguageProficiencyPage';
import { SiteTextAdminPage } from './pages/SiteTextAdminPage';
import { SiteTextTranslationPage } from './pages/SiteTextTranslationPage';
import { AdminPage } from './pages/AdminPage';
import { KeyTermsPage } from './pages/KeyTermsPage';
import { LexiconPage } from './pages/LexiconPage';
import { CommentaryPage } from './pages/CommentaryPage';
import { GrammarPage } from './pages/GrammarPage';
import { VersificationPage } from './pages/VersificationPage';
import { AlignmentPage } from './pages/AlignmentPage';
import { SvgTranslationPage } from './pages/SvgTranslationPage';
import { SvgTranslatedPage } from './pages/SvgTranslatedPage';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <AppContextProvider>
      <ThemeProvider>
        <IonReactRouter>
          <PageLayout>
            <IonRouterOutlet id="crowd-bible-router-outlet">
              <Route exact path="/">
                <Redirect to="/home" />
              </Route>
              <Route exact path="/welcome">
                <WelcomePage />
              </Route>
              <Route exact path="/login">
                <LoginPage />
              </Route>
              <Route exact path="/home">
                <HomePage />
              </Route>
              <Route exact path="/discussion/table-name/:table_name/row/:row">
                <DiscussionPage />
              </Route>
              <Route exact path="/discussions-list">
                <DiscussionsListPage />
              </Route>
              <Route exact path="/documents-list">
                <DocumentsListPage />
              </Route>
              <Route exact path="/notifications">
                <NotificationsPage />
              </Route>
              <Route exact path="/register">
                <RegisterPage />
              </Route>
              <Route exact path="/settings">
                <SettingsPage />
              </Route>
              <Route exact path="/translation-candidates">
                <TranslationCandidatesPage />
              </Route>
              <Route exact path="/translation">
                <TranslationPage />
              </Route>
              <Route exact path="/translation-edit">
                <TranslationEditPage />
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
              <Route exact path="/file-import">
                <FileImportPage />
              </Route>
              <Route exact path="/graph-viewer">
                <GraphViewerPage />
              </Route>
              <Route exact path="/dictionary">
                <DictionaryPage />
              </Route>
              <Route exact path="/bilingual-dictionary">
                <BilingualDictionaryPage />
              </Route>
              <Route exact path="/language-proficiency">
                <LanguageProficiencyPage />
              </Route>
              <Route exact path="/site-text-admin">
                <SiteTextAdminPage />
              </Route>
              <Route exact path="/site-text-translation">
                <SiteTextTranslationPage />
              </Route>
              <Route exact path="/admin">
                <AdminPage />
              </Route>
              <Route exact path="/key-terms">
                <KeyTermsPage />
              </Route>
              <Route exact path="/lexicon">
                <LexiconPage />
              </Route>
              <Route exact path="/commentary">
                <CommentaryPage />
              </Route>
              <Route exact path="/grammar">
                <GrammarPage />
              </Route>
              <Route exact path="/versification">
                <VersificationPage />
              </Route>
              <Route exact path="/alignment">
                <AlignmentPage />
              </Route>
              <Route exact path="/svg-translation">
                <SvgTranslationPage />
              </Route>
              <Route exact path="/svg-translated-map">
                <SvgTranslatedPage />
              </Route>
            </IonRouterOutlet>
          </PageLayout>
        </IonReactRouter>
      </ThemeProvider>
    </AppContextProvider>
  </IonApp>
);

export default App;
