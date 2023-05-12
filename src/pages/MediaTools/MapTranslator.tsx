import { IonContent } from '@ionic/react';
import { MuiMaterial, Button } from '@eten-lab/ui-kit';
import { useState } from 'react';
import { WordTabContent } from '@/src/components/MapTranslatorTabs/WordTabContent';
import { MapTabContent } from '@/src/components/MapTranslatorTabs/MapTabContent';
const { Box, Typography, styled } = MuiMaterial;

export const MapTranslatorPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <IonContent>
      <Box
        display={'flex'}
        flexDirection={'row'}
        alignItems={'center'}
        justifyContent={'flex-start'}
        padding={'20px'}
        bgcolor={'text.light-blue'}
      >
        <Typography
          color={'text.dark'}
          sx={{ fontSize: '20px', lineHeight: '28px', fontWeight: 600 }}
        >
          Map Translator
        </Typography>
      </Box>
      <Box
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'start'}
        alignItems={'start'}
        padding={'20px'}
        paddingTop={'15px'}
        width={'100%'}
      >
        <Box
          width={'100%'}
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          gap={'20px'}
        >
          <StyledButtonTab
            variant={activeTab === 0 ? 'contained' : 'text'}
            // href={'/map-list'}
            onClick={() => {
              setActiveTab(0);
            }}
          >
            Map
          </StyledButtonTab>
          <StyledButtonTab
            variant={activeTab === 1 ? 'contained' : 'text'}
            onClick={() => {
              setActiveTab(1);
            }}
            // href={'/map-strings-list'}
          >
            Word List
          </StyledButtonTab>
        </Box>
        {activeTab === 0 ? <MapTabContent /> : <></>}
        {activeTab === 1 ? <WordTabContent /> : <></>}
      </Box>
    </IonContent>
  );
};

//#region styled component
const StyledButtonTab = styled(Button)(({ theme, variant }) => {
  const conditionalStyles = {};
  if (variant === 'text') {
    Object.assign(conditionalStyles, {
      color: theme.palette.text.gray,
      borderBottom: '1px solid',
      borderColor: theme.palette.text['middle-gray'],
    });
  } else {
    Object.assign(conditionalStyles, {
      color: theme.palette.text['blue-primary'],
      backgroundColor: '#CBE0F8',
      ':hover': {
        backgroundColor: '#CBE0F8',
      },
    });
  }
  return {
    fontWeight: 800,
    fontSize: '14px',
    lineHeight: '20px',
    borderRadius: '4px',
    padding: '11px 46px',
    gap: '10px',
    height: '42px',
    flex: 1,
    ...conditionalStyles,
  };
});
//#endregion
