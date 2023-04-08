/* eslint-disable @typescript-eslint/no-explicit-any */
import { IonContent, IonItem, IonLabel } from '@ionic/react';
import { decodeToken, isTokenValid } from '@/utils/AuthUtils';

export function ProfilePage() {
  const userToken = localStorage.getItem('userToken');
  console.log('userToken');
  //console.log(userToken);
  const token: any = decodeToken(userToken!);
  console.log(token);
  if (!isTokenValid(token)) {
    return (
      <IonContent>
        <h3>Token not valid</h3>
      </IonContent>
    );
  }

  console.log(token);

  return (
    <IonContent>
      <IonItem>
        <IonLabel>
          <p>Name</p>
          <h1>{token.name}</h1>
        </IonLabel>
      </IonItem>
      <IonItem>
        <IonLabel>
          <p>Email</p>
          <h1>{token.email}</h1>
        </IonLabel>
      </IonItem>
      <IonItem>
        <IonLabel>
          <p>Username</p>
          <h1>{token.preferred_username}</h1>
        </IonLabel>
      </IonItem>
    </IonContent>
  );
}
