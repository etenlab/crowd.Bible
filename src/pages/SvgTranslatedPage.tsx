import { IonContent } from '@ionic/react';
import { Box } from '@mui/material';
import { Alert } from '@eten-lab/ui-kit';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { CrowdBibleUI } from '@eten-lab/ui-kit';
import { useAppContext } from '../hooks/useAppContext';
import { useHistory } from 'react-router';
import { useEffect, useState } from 'react';
const { TitleWithIcon } = CrowdBibleUI;

const PADDING = 20;

export const SvgTranslatedPage = () => {
  const [windowWidth, setWindowWidth] = useState(getWindowWidth());
  const {
    states: {
      global: { translatedMap },
    },
  } = useAppContext();

  useEffect(() => {
    function handleWindowResize() {
      setWindowWidth(getWindowWidth());
    }
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const history = useHistory();

  if (translatedMap.translatedMapStr?.length === 0) {
    return <Alert severity="error">No translated map data found</Alert>;
  }

  return (
    <IonContent>
      <Box
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'start'}
        alignItems={'start'}
        paddingTop={`${PADDING}px`}
      >
        {translatedMap.translatedMapStr && (
          <>
            <TitleWithIcon
              onClose={() => {}}
              onBack={() => {
                history.push('/svg-translation');
              }}
              withBackIcon={true}
              withCloseIcon={false}
              label="Upload .SVG File"
            ></TitleWithIcon>
            <Box paddingBottom={`${PADDING / 2}px`}>
              <TransformWrapper>
                <TransformComponent>
                  <img
                    width={`${windowWidth}px`}
                    height={'auto'}
                    src={`data:image/svg+xml;utf8,${encodeURIComponent(
                      translatedMap.translatedMapStr,
                    )}`}
                    alt="translated svg"
                  />
                </TransformComponent>
              </TransformWrapper>
            </Box>
          </>
        )}
      </Box>
    </IonContent>
  );
};

function getWindowWidth() {
  const { innerWidth, innerHeight } = window;
  return innerWidth;
}
