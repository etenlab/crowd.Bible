import { IonChip, IonContent, useIonRouter } from '@ionic/react';

import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { CrowdBibleUI, Typography, MuiMaterial } from '@eten-lab/ui-kit';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { WordMapper } from '@/mappers/word.mapper';
import { useMapTranslationTools } from '@/hooks/useMapTranslationTools';
import { RouteConst } from '@/constants/route.constant';
import { useAppContext } from '@/hooks/useAppContext';
import { FeedbackTypes } from '@/constants/common.constant';
import { MapDto } from '@/dtos/map.dto';

const { TitleWithIcon } = CrowdBibleUI;

const { Box } = MuiMaterial;

const PADDING = 20;
export const MapDetailPage = () => {
  const {
    states: {
      global: { singletons },
    },
    actions: { setLoadingState, alertFeedback },
    logger,
  } = useAppContext();

  const router = useIonRouter();
  const { id } = useParams<{ id: string }>();
  const [windowWidth, setWindowWidth] = useState(getWindowWidth());
  const [mapDetail, setMapDetail] = useState<MapDto>();
  const [mapFileData, setMapFileData] = useState<string>();
  const { getFileDataBase64 } = useMapTranslationTools();

  useEffect(() => {
    function handleWindowResize() {
      setWindowWidth(getWindowWidth());
    }
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [setLoadingState]);

  useEffect(() => {
    if (!singletons || !id) return;
    if (!singletons.mapService) return;
    setLoadingState(true);
    const findMapDetail = async (id: string) => {
      try {
        const [mapDto, mapWordsNodes] = await Promise.all([
          singletons.mapService.getMap(id),
          singletons.mapService.getMapWords(id),
        ]);
        if (mapDto) {
          setMapDetail({
            ...mapDto,
            words: mapWordsNodes?.map
              ? mapWordsNodes.map((w) => WordMapper.entityToDto(w))
              : [],
          });
        } else {
          alertFeedback(FeedbackTypes.ERROR, 'No map data found');
        }
      } catch (error) {
        logger.error({ error }, 'Error with getting map details');
        router.goBack();
      } finally {
        setLoadingState(false);
      }
    };
    findMapDetail(id);
  }, [singletons, id, router, alertFeedback, logger, setLoadingState]);

  useEffect(() => {
    async function findFileData() {
      const f = await getFileDataBase64(mapDetail?.mapFileId);
      setMapFileData(f);
    }
    findFileData();
  }, [getFileDataBase64, mapDetail, mapDetail?.mapFileId]);

  if (!mapDetail) {
    return <></>;
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
        <TitleWithIcon
          onClose={() => {}}
          onBack={() => {
            router.push(RouteConst.MAP_LIST);
          }}
          withBackIcon={true}
          withCloseIcon={false}
          label={mapDetail?.name || ''}
        ></TitleWithIcon>
        {mapFileData ? (
          <Box padding={'20px'}>
            <TransformWrapper>
              <TransformComponent>
                <img
                  width={`${windowWidth - PADDING}px`}
                  height={'auto'}
                  src={`data:image/svg+xml;base64,${mapFileData}`}
                  alt="Original map"
                />
              </TransformComponent>
            </TransformWrapper>
          </Box>
        ) : (
          <></>
        )}
      </Box>
      <Box flex={'row'} flexWrap={'wrap'} padding={'20px'}>
        <Typography variant={'caption'} fontWeight={600}>
          Total Words: ({mapDetail?.words?.length})
        </Typography>
        {mapDetail?.words?.map((w) => (
          <IonChip key={w.id}>{w.word}</IonChip>
        ))}
      </Box>
    </IonContent>
  );
};

function getWindowWidth() {
  const { innerWidth } = window;
  return innerWidth;
}
