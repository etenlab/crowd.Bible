import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router-dom";

import {
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuButton,
  IonPage,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
  IonIcon,
} from "@ionic/react";
import { chatbubbleOutline, notificationsOutline } from "ionicons/icons";

import { MockTranslationPage } from "../components/readerFeedback/MockTranslationPage";
import { MockTextFeedbackPage } from "../components/readerFeedback/MockTextFeedbackPage";
import { MockChapterFeedbackPage } from "../components/readerFeedback/MockChapterFeedbackPage";
import { MockChapterListPage } from "../components/readerFeedback/MockChapterListPage";
import { MockVerseFeedbackPage } from "../components/readerFeedback/MockVerseFeedback";

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>crowd.Bible</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">crowd.Bible</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen id="main-content" scrollY={true}>
          <IonRouterOutlet>
            <Route
              path="/home/translation"
              exact
              render={() => <MockTranslationPage />}
            />
            <Route
              path="/home/translation/feedback/text"
              exact
              render={() => <MockTextFeedbackPage />}
            />
            <Route
              path="/home/translation/feedback/chapter"
              exact
              render={() => <MockChapterFeedbackPage />}
            />
            <Route
              path="/home/translation/feedback/verse/chapter-list"
              exact
              render={() => <MockChapterListPage />}
            />
            <Route
              path="/home/translation/feedback/verse/chapter-list/1"
              exact
              render={() => <MockVerseFeedbackPage />}
            />
          </IonRouterOutlet>
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default Home;
