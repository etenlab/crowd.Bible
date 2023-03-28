import { IonChip, IonContent, useIonLoading, useIonRouter } from '@ionic/react';
import { Box } from '@mui/material';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { CrowdBibleUI, Typography } from '@eten-lab/ui-kit';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import useNodeServices from '@/src/hooks/useNodeServices';
import { MapDto } from '@/src/dtos/map.dto';
import { WordMapper } from '@/src/mappers/word.mapper';
const { TitleWithIcon } = CrowdBibleUI;

const PADDING = 20;
export const MapDetailPage = () => {
  const router = useIonRouter();
  const [present, dismiss] = useIonLoading();
  const { id } = useParams<{ id: string }>();
  const [windowWidth, setWindowWidth] = useState(getWindowWidth());
  const [mapDetail, setMapDetail] = useState<MapDto>();
  const nodeService = useNodeServices();

  useEffect(() => {
    present({ message: 'Loading...', duration: 1000 });
    function handleWindowResize() {
      setWindowWidth(getWindowWidth());
    }
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  useEffect(() => {
    if (nodeService && id) {
      getMapDetail(id);
    }
  }, [nodeService, id]);

  const getMapDetail = async (id: string) => {
    try {
      if (!nodeService) return;
      const [mapRes, mapWordsRes] = await Promise.allSettled([
        nodeService.getMap(id),
        nodeService.getMapWords(id),
      ]);
      if (mapRes.status === 'fulfilled' && mapRes.value) {
        setMapDetail({
          ...mapRes.value,
          words:
            mapWordsRes.status === 'fulfilled'
              ? mapWordsRes.value.map((w) => WordMapper.entityToDto(w))
              : [],
          map: mapRes.value.map,
        });
      } else {
        router.goBack();
      }
    } catch (error) {
      router.goBack();
    }
  };

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
            router.push('/map-list');
          }}
          withBackIcon={true}
          withCloseIcon={false}
          label={mapDetail?.name || ''}
        ></TitleWithIcon>
        {mapDetail?.map ? (
          <Box padding={'20px'}>
            <TransformWrapper>
              <TransformComponent>
                <img
                  width={`${windowWidth - PADDING}px`}
                  height={'auto'}
                  src={`data:image/svg+xml;base64,${mapDetail.map}`}
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
          <IonChip key={w.id}>{w.name}</IonChip>
        ))}
      </Box>
    </IonContent>
  );
};

function getWindowWidth() {
  const { innerWidth, innerHeight } = window;
  return innerWidth;
}
