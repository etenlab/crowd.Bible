import {
  // useCallback,
  useEffect,
  useState,
} from 'react';
import { useParams } from 'react-router';
import { IonChip, useIonRouter } from '@ionic/react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import {
  CrowdBibleUI,
  Typography,
  MuiMaterial,
  FadeSpinner,
  useColorModeContext,
  // Button,
} from '@eten-lab/ui-kit';

import { useMapTranslationTools } from '@/hooks/useMapTranslationTools';
import { useAppContext } from '@/hooks/useAppContext';
import { useTr } from '@/hooks/useTr';

import { WordMapper } from '@/mappers/word.mapper';

import { RouteConst } from '@/constants/route.constant';
import { FeedbackTypes } from '@/constants/common.constant';

import { MapDto } from '@/dtos/map.dto';

import { PageLayout } from '@/components/Layout';
// import { toBase64 } from '@/utils/stringUtils';

const { TitleWithIcon } = CrowdBibleUI;

const { Box } = MuiMaterial;

const PADDING = 20;
export const MapDetailPage = () => {
  const {
    states: {
      global: { singletons },
      documentTools: { sourceLanguage, targetLanguage },
    },
    actions: { createLoadingStack, alertFeedback },
    logger,
  } = useAppContext();
  const { tr } = useTr();
  const { getColor } = useColorModeContext();

  const router = useIonRouter();
  const { id } = useParams<{ id: string }>();
  const [windowWidth, setWindowWidth] = useState(getWindowWidth());
  const [mapDetail, setMapDetail] = useState<MapDto>();
  const [mapFileData, setMapFileData] = useState<Buffer>();
  // const [mapTranslatedFileData, setMapTranslatedFileData] = useState<string>();
  const { getFileDataAsBuffer, translateMapString, processTranslatedMap } =
    useMapTranslationTools();

  useEffect(() => {
    function handleWindowResize() {
      setWindowWidth(getWindowWidth());
    }
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  useEffect(() => {
    if (!singletons || !id) return;
    if (!singletons.mapService) return;
    const { startLoading, stopLoading } = createLoadingStack();
    const findMapDetail = async (id: string) => {
      startLoading();
      try {
        const [mapDto, mapWordsNodes] = await Promise.all([
          singletons.mapService.getMap(id),
          singletons.mapService.getMapWords(id),
        ]);
        if (mapDto) {
          setMapDetail({
            ...mapDto,
            words: mapWordsNodes?.map
              ? mapWordsNodes
                  .map((w) => WordMapper.entityToDto(w))
                  .sort((a, b) => a.word.localeCompare(b.word))
              : [],
          });
        } else {
          alertFeedback(FeedbackTypes.ERROR, 'No map data found');
          router.push(RouteConst.MAP_LIST);
        }
      } catch (error) {
        logger.error({ error }, 'Error with getting map details');
        router.push(RouteConst.MAP_LIST);
      } finally {
        stopLoading();
      }
    };
    findMapDetail(id);
  }, [singletons, id, router, alertFeedback, logger, createLoadingStack]);

  useEffect(() => {
    async function findFileDataAndTranslate() {
      if (!mapDetail) return;
      const fb = await getFileDataAsBuffer(mapDetail.mapFileId);
      if (!fb) return;
      setMapFileData(fb);
      if (!sourceLanguage || !targetLanguage) return;
      const mtr = await translateMapString(
        fb.toString(),
        sourceLanguage,
        targetLanguage,
      );
      if (!mtr) return;

      // setMapTranslatedFileData(toBase64(mtr.translatedMap));
    }
    findFileDataAndTranslate();
  }, [
    getFileDataAsBuffer,
    mapDetail,
    processTranslatedMap,
    sourceLanguage,
    targetLanguage,
    translateMapString,
  ]);

  // const translateAndSave = useCallback(async () => {
  //   if (!mapDetail?.name || !mapFileData || !mapDetail?.id) return;
  //   if (!sourceLanguage || !targetLanguage) return;
  //   const mtr = await translateMapString(
  //     mapFileData.toString(),
  //     sourceLanguage,
  //     targetLanguage,
  //   );
  //   if (!mtr) return;
  //   await processTranslatedMap(
  //     mtr,
  //     targetLanguage,
  //     mapDetail.name,
  //     mapDetail.id,
  //     null,
  //   );
  // }, [
  //   mapDetail?.id,
  //   mapDetail?.name,
  //   mapFileData,
  //   processTranslatedMap,
  //   sourceLanguage,
  //   targetLanguage,
  //   translateMapString,
  // ]);

  return (
    <PageLayout>
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
          <Box padding={`${PADDING}px`}>
            <TransformWrapper>
              <TransformComponent>
                <img
                  width={`${windowWidth - PADDING}px`}
                  height={'auto'}
                  src={`data:image/svg+xml;base64,${mapFileData.toString(
                    'base64',
                  )}`}
                  alt="Original map"
                />
              </TransformComponent>
            </TransformWrapper>
          </Box>
        ) : (
          <Box margin={`${PADDING}px auto`}>
            <FadeSpinner color={getColor('blue-primary')} />
          </Box>
        )}
      </Box>
      <Box flex={'row'} flexWrap={'wrap'} padding={'20px'}>
        <Typography variant={'caption'} fontWeight={600}>
          {tr('Total Words:')} ({mapDetail?.words?.length})
        </Typography>
        {mapDetail?.words?.map((w) => (
          <IonChip key={w.id}>{w.word}</IonChip>
        ))}
      </Box>
      {/* 
      {mapTranslatedFileData ? (
        <Box padding={`${PADDING}px`}>
          <TransformWrapper>
            <TransformComponent>
              <img
                width={`${windowWidth - PADDING}px`}
                height={'auto'}
                src={`data:image/svg+xml;base64,${mapTranslatedFileData}`}
                alt="Translated map"
              />
            </TransformComponent>
          </TransformWrapper>
          <Button onClick={translateAndSave}>Save translated map</Button>
        </Box>
      ) : (
        <Box margin={`${PADDING}px auto`}>
          <FadeSpinner color={getColor('blue-primary')} />
        </Box>
      )} */}
    </PageLayout>
  );
};

function getWindowWidth() {
  const { innerWidth } = window;
  return innerWidth;
}
