import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonButton
} from '@ionic/react';
import './Home.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper'

import 'swiper/css';
import "swiper/css/pagination";
import "../styles.css";

const Welcome: React.FC = () => {
  return (
    <IonPage className='welcome-page'>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>

        
          <IonGrid className='grid-full-height'>
            <IonRow>
              <IonCol>
                <h2>crowd.Bible</h2>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
              <p>Welcome Text About the <br/>Application. Next Line of the Text</p>
              </IonCol>
            </IonRow>
            <IonRow className='fill-remaining'>
              <IonCol>
              

              <Swiper
        pagination={true}
        modules={[Pagination]}
        spaceBetween={50}
        slidesPerView={1}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
        >
            <SwiperSlide>
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <img alt='placeholder' className='slider-image' src='assets/image.png' />
                  </IonCol>
                </IonRow>
              </IonGrid>
              
              
            </SwiperSlide>
            <SwiperSlide>Slide 2</SwiperSlide>
            <SwiperSlide>Slide 3</SwiperSlide>
            <SwiperSlide>Slide 4</SwiperSlide>
        </Swiper>
              

              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonButton expand="block" color="dark" size="default">Get Started Now</IonButton>
              </IonCol>
            </IonRow>


          </IonGrid>


        
      </IonContent>
    </IonPage>
  );
};

export default Welcome;