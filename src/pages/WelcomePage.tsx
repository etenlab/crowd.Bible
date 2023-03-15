import { useHistory } from 'react-router-dom';

import { IonGrid, IonRow, IonCol, IonContent } from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import { Button, Typography, colors } from '@eten-lab/ui-kit';

import 'swiper/css';
import 'swiper/css/pagination';
import '../styles.css';

export function WelcomePage() {
  const history = useHistory();

  const handleGoToLoginPage = () => {
    history.push('/login');
  };

  const startButton = (
    <Button variant="contained" endIcon fullWidth onClick={handleGoToLoginPage}>
      Get Started Now
    </Button>
  );

  return (
    <IonContent>
      <IonGrid className="grid-full-height">
        <IonRow>
          <IonCol>
            <Typography
              variant="h1"
              sx={{
                color: colors.dark,
                textAlign: 'center',
                marginTop: '40px',
              }}
            >
              crowd.Bible
            </Typography>
          </IonCol>
        </IonRow>

        <IonRow className="fill-remaining">
          <IonCol>
            <Swiper
              pagination={true}
              modules={[Pagination]}
              spaceBetween={50}
              slidesPerView={1}
              onSlideChange={() => {
                console.log('slide change');
              }}
              onSwiper={(swiper) => {
                console.log(swiper);
              }}
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
                      <Typography variant="h3" sx={{ color: colors.dark }}>
                        Digital Era, Learn Everything
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: colors.gray, justifyContent: 'center' }}
                      >
                        Welcome Text About the <br />
                        Application. Next Line of the Text
                      </Typography>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>{startButton}</IonCol>
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
                      <Typography variant="h3" sx={{ color: colors.dark }}>
                        Digital Era, Learn Everything
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: colors.gray, justifyContent: 'center' }}
                      >
                        Welcome Text About the <br />
                        Application. Next Line of the Text
                      </Typography>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>{startButton}</IonCol>
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
                      <Typography variant="h3" sx={{ color: colors.dark }}>
                        Digital Era, Learn Everything
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: colors.gray, justifyContent: 'center' }}
                      >
                        Welcome Text About the <br />
                        Application. Next Line of the Text
                      </Typography>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>{startButton}</IonCol>
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
                      <Typography variant="h3" sx={{ color: colors.dark }}>
                        Digital Era, Learn Everything
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: colors.gray, justifyContent: 'center' }}
                      >
                        Welcome Text About the <br />
                        Application. Next Line of the Text
                      </Typography>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>{startButton}</IonCol>
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
