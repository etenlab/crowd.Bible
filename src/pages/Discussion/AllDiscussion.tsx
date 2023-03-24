import { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage } from '@ionic/react';
import { CreateDiscussion } from '@/components/dicussion/CreateDiscussion/CreateDiscussion';
import { DiscussionList } from '@/components/dicussion/DiscussionList';
import { Discussion } from '@/src/models/discussion.entity';
import { Toolbar, Typography } from '@eten-lab/ui-kit';
import './DiscussionList.css';
import { useHistory } from 'react-router';
import AppRoutes from '../../constants/AppRoutes';
import useSingletons from '@/src/hooks/useSingletons';

const sampleData: any[] = [
  { title: 'Discussoin Title #1', text: '', id: 1, user: Object.create(null) },
  { title: 'Discussoin Title #2', text: '', id: 2, user: Object.create(null) },
];

export const AllDiscussion = () => {
  const singletons = useSingletons();
  const history = useHistory();
  const [isCreateDiscussionShow, setIsCreateDiscussionShow] =
    useState<boolean>();
  const [discussions, setDiscussions] = useState<Discussion[]>(sampleData);

  const createDiscussion = () => {
    setIsCreateDiscussionShow(true);
  };

  useEffect(() => {
    singletons?.discussionRepo?.getAll().then((data) => {
      setDiscussions(sampleData);
    });
  }, [singletons?.discussionRepo, isCreateDiscussionShow]);

  return (
    <IonPage>
      <IonHeader>
        <Toolbar
          themeMode={'light'}
          title="Showcase"
          buttons={{ discussion: true, notification: true, menu: true }}
          onClickMenuBtn={() => {}}
          onClickDiscussionBtn={() => {}}
          onClickNotificationBtn={() => {
            history.push(AppRoutes.notifications);
          }}
          onClickThemeModeBtn={() => {}}
        />
      </IonHeader>
      <IonContent className="ion-padding" style={{ height: 'fit-content' }}>
        <Typography variant="h3">Discussions</Typography>
        {discussions?.length ? (
          <DiscussionList discussions={discussions} />
        ) : (
          <></>
        )}
      </IonContent>

      {isCreateDiscussionShow && (
        <IonContent className="ion-padding">
          <CreateDiscussion
            setIsCreateDiscussionShow={setIsCreateDiscussionShow}
          />
        </IonContent>
      )}

      {/* <IonFooter>
                <IonToolbar>
                    <PlusButton variant={'primary'} onClick={createDiscussion} />
                    <IonText>
                        new Post
                    </IonText>
                </IonToolbar>
            </IonFooter> */}
    </IonPage>
  );
};
