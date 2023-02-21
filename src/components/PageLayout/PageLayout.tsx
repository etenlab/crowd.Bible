import React, { useRef } from "react";
import { useHistory } from "react-router-dom";

import {
  IonMenu,
  IonPage,
  IonHeader,
  IonContent,
  IonToolbar,
} from "@ionic/react";

import { Toolbar } from "@eten-lab/ui-kit";

type PageLayoutProps = {
  isHeader?: boolean;
  isNewNotification?: boolean;
  isNewDiscussion?: boolean;
  menu?: React.ReactNode;
  content?: React.ReactNode;
};

export function PageLayout({
  isHeader = true,
  menu,
  content,
  isNewDiscussion,
  isNewNotification,
}: PageLayoutProps) {
  const history = useHistory();
  const ref = useRef<HTMLIonMenuElement>(null);

  const handleToggleMenu = () => {
    ref.current!.toggle();
  };

  return (
    <>
      <IonMenu ref={ref} contentId="main-content">
        {isHeader ? (
          <IonHeader>
            <IonToolbar>
              <Toolbar
                title="crowd.Bible"
                buttons={{
                  notification: false,
                  discussion: false,
                  menu: false,
                }}
                onClickDiscussionBtn={() => history.push("/discussions-list")}
                onClickNotificationBtn={() => history.push("/notifications")}
                onClickMenuBtn={handleToggleMenu}
              />
            </IonToolbar>
          </IonHeader>
        ) : null}
        <IonContent>{menu}</IonContent>
      </IonMenu>

      <IonPage>
        {isHeader ? (
          <IonHeader>
            <IonToolbar>
              <Toolbar
                title="crowd.Bible"
                isNewDiscussion={isNewDiscussion}
                isNewNotification={isNewNotification}
                onClickDiscussionBtn={() => history.push("/discussions-list")}
                onClickNotificationBtn={() => history.push("/notifications")}
                onClickMenuBtn={handleToggleMenu}
              />
            </IonToolbar>
          </IonHeader>
        ) : null}
        <IonContent fullscreen id="main-content">
          {content}
        </IonContent>
      </IonPage>
    </>
  );
}
