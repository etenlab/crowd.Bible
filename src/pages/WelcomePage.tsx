import { useHistory } from 'react-router-dom';

import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import { Button, Typography } from '@eten-lab/ui-kit';

import 'swiper/swiper-bundle.css';
import '../styles.css';
import { useAppContext } from '@/hooks/useAppContext';
import { useTr } from '@/hooks/useTr';

import { RouteConst } from '@/constants/route.constant';

import { PageLayout } from '@/components/Layout';

export function WelcomePage() {
  const history = useHistory();
  const { logger } = useAppContext();
  const { tr } = useTr();

  const handleGoToLoginPage = () => {
    history.push(RouteConst.LOGIN);
  };

  const startButton = (
    <Button variant="contained" endIcon fullWidth onClick={handleGoToLoginPage}>
      {tr('Get Started Now')}
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
              {tr('crowd.Bible')}
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
                        {tr('Digital Era, Learn Everything')}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.gray"
                        sx={{ justifyContent: 'center' }}
                      >
                        {tr(
                          'Welcome Text About the Application. Next Line of the Text',
                        )}
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
                        {tr('Digital Era, Learn Everything')}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.gray"
                        sx={{ justifyContent: 'center' }}
                      >
                        {tr(
                          'Welcome Text About the Application. Next Line of the Text',
                        )}
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
                        {tr('Digital Era, Learn Everything')}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.gray"
                        sx={{ justifyContent: 'center' }}
                      >
                        {tr(
                          'Welcome Text About the Application. Next Line of the Text',
                        )}
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
                        {tr('Digital Era, Learn Everything')}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.gray"
                        sx={{ justifyContent: 'center' }}
                      >
                        {tr(
                          'Welcome Text About the Application. Next Line of the Text',
                        )}
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
