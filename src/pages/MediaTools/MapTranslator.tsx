import { MuiMaterial, Button } from '@eten-lab/ui-kit';
import { useState } from 'react';
import { WordTabContent } from '@/components/MapTranslatorTabs/WordTabContent';
import { MapTabContent } from '@/components/MapTranslatorTabs/MapTabContent';

import { PageLayout } from '@/components/Layout';

const { Box, Typography, styled } = MuiMaterial;

export const MapTranslatorPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <PageLayout>
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
          >
            Word List
          </StyledButtonTab>
        </Box>
        {activeTab === 0 ? <MapTabContent /> : <></>}
        {activeTab === 1 ? <WordTabContent /> : <></>}
      </Box>
    </PageLayout>
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
      backgroundColor: theme.palette.text['light-blue'],
      ':hover': {
        backgroundColor: theme.palette.text['light-blue'],
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
