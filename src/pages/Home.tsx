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
      <IonReactRouter>
        <IonMenu contentId="main-content">
          <IonHeader>
            <IonToolbar>
              <IonTitle>crowd.Bible</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
            <IonList>
              <IonItem href="#">
                <IonLabel>Applications</IonLabel>
              </IonItem>
              <IonItem href="#">
                <IonLabel>Language Proficiency</IonLabel>
              </IonItem>
            </IonList>
          </IonContent>
        </IonMenu>

        <IonHeader>
          <IonToolbar>
            <IonButtons slot="end">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>crowd.Bible</IonTitle>
            <IonButtons slot="primary">
              <div
                style={{
                  display: "flex",
                  gap: "30px",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "black",
                  padding: "0 30px",
                }}
              >
                <a href="#">
                  <IonIcon
                    className="ion-ios7-chatbubble-outline"
                    icon={chatbubbleOutline}
                  />
                </a>
                <a href="#">
                  <IonIcon
                    className="ion-ios7-chatbubble-outline"
                    icon={notificationsOutline}
                  />
                </a>
              </div>
            </IonButtons>
            <IonButtons></IonButtons>
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
      </IonReactRouter>
    </IonPage>
  );
};

export default Home;
