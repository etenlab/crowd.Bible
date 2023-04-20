import { useEffect, useState } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { CreateDiscussion } from '@/components/dicussion/CreateDiscussion/CreateDiscussion';
import { DiscussionList } from '@/components/dicussion/DiscussionList';
import { Discussion } from '@/src/models';
import { Typography } from '@eten-lab/ui-kit';
import { useSingletons } from '@/src/hooks/useSingletons';
import './DiscussionList.css';

export const AllDiscussion = () => {
  const singletons = useSingletons();
  const [isCreateDiscussionShow, setIsCreateDiscussionShow] =
    useState<boolean>();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);

  useEffect(() => {
    singletons?.discussionRepo?.getAll().then((data) => {
      setDiscussions(data);
    });
  }, [singletons?.discussionRepo, isCreateDiscussionShow]);

  return (
    <IonPage>
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
