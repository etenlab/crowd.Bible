import { useHistory } from 'react-router-dom';

import { IonGrid, IonRow, IonCol, IonContent } from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import { Button } from '@eten-lab/ui-kit';

import 'swiper/css';
import 'swiper/css/pagination';
import '../styles.css';

export function WelcomePage() {
  const history = useHistory();

  const handleGoToLoginPage = () => {
    history.push('/login');
  };

  return (
    <IonContent>
      <IonGrid className="grid-full-height">
        <IonRow>
          <IonCol>
            <h2 className="splash-title">crowd.Bible</h2>
          </IonCol>
        </IonRow>

        <IonRow className="fill-remaining">
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
                          <img
                            alt="placeholder"
                            className="slider-image"
                            src="assets/image.png"
                            width="335"
                            height="225"
                          />
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol>
                          <h2 className="slide-title">Digital Era, Learn Everything</h2>
                          <p>
                            Welcome Text About the <br />
                            Application. Next Line of the Text
                          </p>
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol>
                          <Button variant="contained" endIcon fullWidth>
                            Get Started Now
                          </Button>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </SwiperSlide>
                  <SwiperSlide>
                  <IonGrid>
                      <IonRow>
                        <IonCol>
                          <img
                            alt="placeholder"
                            className="slider-image"
                            src="assets/image.png"
                            width="335"
                            height="225"
                          />
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol>
                          <h2 className="slide-title">Digital Era, Learn Everything</h2>
                          <p>
                            Welcome Text About the <br />
                            Application. Next Line of the Text
                          </p>
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol>
                          <Button variant="contained" endIcon fullWidth>
                            Get Started Now
                          </Button>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </SwiperSlide>
                  <SwiperSlide>
                  <IonGrid>
                      <IonRow>
                        <IonCol>
                          <img
                            alt="placeholder"
                            className="slider-image"
                            src="assets/image.png"
                            width="335"
                            height="225"
                          />
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol>
                          <h2 className="slide-title">Digital Era, Learn Everything</h2>
                          <p>
                            Welcome Text About the <br />
                            Application. Next Line of the Text
                          </p>
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol>
                          <Button variant="contained" endIcon fullWidth>
                            Get Started Now
                          </Button>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </SwiperSlide>
                  <SwiperSlide>
                  <IonGrid>
                      <IonRow>
                        <IonCol>
                          <img
                            alt="placeholder"
                            className="slider-image"
                            src="assets/image.png"
                            width="335"
                            height="225"
                          />
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol>
                          <h2 className="slide-title">Digital Era, Learn Everything</h2>
                          <p>
                            Welcome Text About the <br />
                            Application. Next Line of the Text
                          </p>
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol>
                          <Button variant="contained" endIcon fullWidth>
                            Get Started Now
                          </Button>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </SwiperSlide>
            </Swiper>
          </IonCol>
        </IonRow>

      </IonGrid>
    </IonContent>
  );
}
