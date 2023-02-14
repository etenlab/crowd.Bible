import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Welcome from './pages/Welcome';
import Login from './pages/Login';

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
import DiscussionPage from './pages/Discussion';
import DiscussionsListPage from './pages/DiscussionsList';
import DocumentsListPage from './pages/DocumentsListPage';
import NotificationsPage from './pages/Notifications';
import RegisterPage from './pages/Register';
import SettingsPage from './pages/Settings';
import SplashPage from './pages/Splash';
import TranslationCandidatesPage from './pages/TranslationCandidates';
import TranslationPage from './pages/TranslationPage';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        <Route exact path="/welcome">
          <Welcome />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/discussion">
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
        <Route exact path="/splash">
          <SplashPage />
        </Route>
        <Route exact path="/translation-candidates">
          <TranslationCandidatesPage />
        </Route>
        <Route exact path="/translation">
          <TranslationPage />
        </Route>

      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
