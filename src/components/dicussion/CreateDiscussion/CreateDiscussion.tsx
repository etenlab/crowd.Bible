import React, { useState } from 'react';
import {
  IonButton,
  IonInput,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonTextarea,
} from '@ionic/react';
import { InputChangeEventDetail, TextareaChangeEventDetail } from '@ionic/core';
import {
  IonInputCustomEvent,
  IonTextareaCustomEvent,
} from '@ionic/core/dist/types/components';
import { useSingletons } from '@/src/hooks/useSingletons';

interface PropsCreateDiscussion {
  setIsCreateDiscussionShow: React.Dispatch<
    React.SetStateAction<boolean | undefined>
  >;
}

interface ICreateDiscussion {
  title: string;
  text: string;
}

export const CreateDiscussion: React.FC<PropsCreateDiscussion> = ({
  setIsCreateDiscussionShow,
}) => {
  const [formData, setFormData] = useState<ICreateDiscussion>({
    text: '',
    title: '',
  });
  const singleton = useSingletons();

  const onCreate = () => {
    if (formData.title !== '' && formData.text !== '') {
      singleton?.discussionRepo
        ?.create({
          ...formData,
          userId: 1,
          tableName: '',
          row: '',
          posts: [],
          sync_layer: 0,
        })
        .then(() => {
          setIsCreateDiscussionShow(false);
        });
    }
  };

  const onTitleChange = (e: IonInputCustomEvent<InputChangeEventDetail>) => {
    setFormData((prevState) => ({
      ...prevState,
      title: e.target.value as string,
    }));
  };
  const onTextChange = (
    e: IonTextareaCustomEvent<TextareaChangeEventDetail>,
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      text: e.target.value as string,
    }));
  };
  const onClose = () => {
    setIsCreateDiscussionShow(false);
  };

  return (
    <IonItemGroup>
      <IonLabel>Create your own discussion )</IonLabel>
      <IonItem>
        <IonInput
          value={formData.title}
          onIonChange={onTitleChange}
          placeholder={'title'}
        />
      </IonItem>
      <IonItem>
        <IonTextarea
          value={formData.text}
          onIonChange={onTextChange}
          rows={5}
          placeholder={'text'}
        />
      </IonItem>
      <IonButton onClick={onCreate}>Create</IonButton>
      <IonButton onClick={onClose}>Close</IonButton>
    </IonItemGroup>
  );
};
