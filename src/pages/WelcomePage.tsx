import { useHistory } from 'react-router-dom';

import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import { Button, Typography } from '@eten-lab/ui-kit';

import 'swiper/swiper-bundle.css';
import '../styles.css';
import { useAppContext } from '@/src/hooks/useAppContext';
import { RouteConst } from '@/constants/route.constant';

import { PageLayout } from '@/components/Layout';

export function WelcomePage() {
  const { logger } = useAppContext();
  const history = useHistory();

  const handleGoToLoginPage = () => {
    history.push(RouteConst.LOGIN);
  };

  const startButton = (
    <Button variant="contained" endIcon fullWidth onClick={handleGoToLoginPage}>
      Get Started Now
    </Button>
  );

  return (
    <PageLayout>
      <IonGrid className="grid-full-height">
        <IonRow>
          <IonCol>
            <Typography
              variant="h1"
              color="text.dark"
              sx={{
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
                logger.info('slide change');
              }}
              onSwiper={(swiper) => {
                logger.info(swiper);
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
                      <Typography variant="h3" color="text.dark">
                        Digital Era, Learn Everything
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.gray"
                        sx={{ justifyContent: 'center' }}
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
                      <Typography variant="h3" color="text.dark">
                        Digital Era, Learn Everything
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.gray"
                        sx={{ justifyContent: 'center' }}
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
                      <Typography variant="h3" color="text.dark">
                        Digital Era, Learn Everything
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.gray"
                        sx={{ justifyContent: 'center' }}
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
                      <Typography variant="h3" color="text.dark">
                        Digital Era, Learn Everything
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.gray"
                        sx={{ justifyContent: 'center' }}
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
    </PageLayout>
  );
}
