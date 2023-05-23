import { IonChip, IonContent, useIonLoading, useIonRouter } from '@ionic/react';

import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { CrowdBibleUI, Typography, MuiMaterial } from '@eten-lab/ui-kit';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { useSingletons } from '@/src/hooks/useSingletons';
import { MapDto } from '@/src/dtos/map.dto';
import { WordMapper } from '@/src/mappers/word.mapper';
import { useMapTranslationTools } from '../../hooks/useMapTranslationTools';
import axios from 'axios';
const { TitleWithIcon } = CrowdBibleUI;

const { Box } = MuiMaterial;

const PADDING = 20;
export const MapDetailPage = () => {
  const router = useIonRouter();
  const [present] = useIonLoading();
  const { id } = useParams<{ id: string }>();
  const [windowWidth, setWindowWidth] = useState(getWindowWidth());
  const [mapDetail, setMapDetail] = useState<MapDto>();
  const [mapFileData, setMapFileData] = useState<string>();
  const singletons = useSingletons();
  const { getMapFileInfo } = useMapTranslationTools();

  useEffect(() => {
    if (present) present({ message: 'Loading...', duration: 1000 });
    function handleWindowResize() {
      setWindowWidth(getWindowWidth());
    }
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [present]);

  useEffect(() => {
    if (singletons && id) {
      const getMapDetail = async (id: string) => {
        try {
          if (!singletons.mapService) return;
          const [mapRes, mapWordsRes] = await Promise.allSettled([
            singletons.mapService.getMap(id),
            singletons.mapService.getMapWords(id),
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
      getMapDetail(id);
    }
  }, [singletons, id, router]);

  useEffect(() => {
    if (!mapDetail?.mapFileId) return;
    const getFileData = async (fileId: string) => {
      const { fileUrl } = await getMapFileInfo(fileId);
      if (!fileUrl) return;
      const res = await axios.get(fileUrl, { responseType: 'arraybuffer' });
      const f = Buffer.from(res.data, 'binary').toString('base64');
      setMapFileData(f);
    };
    getFileData(mapDetail?.mapFileId);
  }, [getMapFileInfo, mapDetail, mapDetail?.mapFileId]);

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
