import {
  IonButton,
  IonContent,
  IonFooter,
  IonIcon,
  IonItem,
  IonPage,
} from '@ionic/react';
import { useHistory, useParams } from 'react-router';
import { Typography, DiscussionBoxUI } from '@eten-lab/ui-kit';
import { arrowBack } from 'ionicons/icons';
import './DiscussionDetail.css';
const {
  ReactionButton,
  InputButtonGroup,
  Avatar,
  Username,
  DateViewer,
  DotsMoreButton,
  AudioPlayer,
  VideoPlayer,
  ReactionPlusButton,
} = DiscussionBoxUI;

interface IProps {}

const DiscussionDetail: React.FC<IProps> = () => {
  const params: { id: string } = useParams();
  const history = useHistory();

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonItem lines="none">
          <IonIcon
            icon={arrowBack}
            slot="start"
            onClick={() => {
              history.goBack();
            }}
          ></IonIcon>
          <Typography variant="h3">Discussion Title #{params.id}</Typography>
        </IonItem>
        <section className="discussion-item-wrapper mb-2">
          <section className="mb-1 info-section">
            <div className="flex-row">
              <Avatar username="Svetlana Podolianko" url="" />
              &nbsp;&nbsp;
              <Username username="Hiroshi Tanaka" />
              &nbsp;
              <strong>&#183;</strong>
              <DateViewer date={new Date()} />
            </div>
            <div>
              <DotsMoreButton onClick={() => {}} />
            </div>
          </section>
          <Typography variant={'body2'} className="mb-1">
            Also note that only visible icons are loaded, and icons which are
            &quot;below the fold&quot; and hidden from the user&apos;s view do
            not make fetch requests for the svg resource.
          </Typography>
          <section className="flex-row space-between">
            <section className="reaction-sec">
              <ReactionButton
                emoji={'1f609'}
                reactions={Object.create(null)}
                onClick={() => {}}
              />
              &nbsp;
              <ReactionButton
                emoji={'1f609'}
                reactions={[Object.create(null), Object.create(null)]}
                onClick={() => {}}
              />
              &nbsp;
              <ReactionPlusButton onClick={() => {}} />
            </section>
            <IonButton
              type={'button'}
              fill={'clear'}
              size={'small'}
              className="reply-btn ion-no-padding"
            >
              Reply
            </IonButton>
          </section>
        </section>
        <section className="discussion-item-wrapper mb-2">
          <section className="mb-1 info-section">
            <div className="flex-row">
              <Avatar username="Svetlana Podolianko" url="" />
              &nbsp;&nbsp;
              <Username username="Hiroshi Tanaka" />
              &nbsp;
              <strong>&#183;</strong>
              <DateViewer date={new Date()} />
            </div>
            <div>
              <DotsMoreButton onClick={() => {}} />
            </div>
          </section>
          <section className="mb-1 audio-sec">
            <AudioPlayer
              src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
              file_type={'mp3'}
              mode={'quill'}
            />
          </section>
          <section className="flex-row space-between">
            <section className="reaction-sec">
              <ReactionButton
                emoji={'1f609'}
                reactions={Object.create(null)}
                onClick={() => {}}
              />
              &nbsp;
              <ReactionButton
                emoji={'1f609'}
                reactions={[Object.create(null), Object.create(null)]}
                onClick={() => {}}
              />
              &nbsp;
              <ReactionPlusButton onClick={() => {}} />
            </section>
            <IonButton
              type={'button'}
              fill={'clear'}
              size={'small'}
              className="reply-btn ion-no-padding"
            >
              Reply
            </IonButton>
          </section>
        </section>
        <section className="discussion-item-wrapper mb-2">
          <section className="mb-1 info-section">
            <div className="flex-row">
              <Avatar username="Svetlana Podolianko" url="" />
              &nbsp;&nbsp;
              <Username username="Hiroshi Tanaka" />
              &nbsp;
              <strong>&#183;</strong>
              <DateViewer date={new Date()} />
            </div>
            <div>
              <DotsMoreButton onClick={() => {}} />
            </div>
          </section>
          <section className="mb-1 audio-sec">
            <VideoPlayer
              src="http://techslides.com/demos/sample-videos/small.mp4"
              mode={'view'}
            />
          </section>
          <section className="flex-row space-between">
            <section className="reaction-sec">
              <ReactionButton
                emoji={'1f609'}
                reactions={Object.create(null)}
                onClick={() => {}}
              />
              &nbsp;
              <ReactionButton
                emoji={'1f609'}
                reactions={[Object.create(null), Object.create(null)]}
                onClick={() => {}}
              />
              &nbsp;
              <ReactionPlusButton onClick={() => {}} />
            </section>
            <IonButton
              type={'button'}
              fill={'clear'}
              size={'small'}
              className="reply-btn ion-no-padding"
            >
              Reply
            </IonButton>
          </section>
        </section>
      </IonContent>
      <IonFooter class="ion-no-border">
        <section className="reply-controls">
          <InputButtonGroup onClick={() => {}} />
        </section>
      </IonFooter>
    </IonPage>
  );
};

export default DiscussionDetail;
