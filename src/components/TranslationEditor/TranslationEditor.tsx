import { useState, type ChangeEvent } from 'react';
import { useHistory } from 'react-router';

import {
  TextArea,
  Button,
  useColorModeContext,
  MuiMaterial,
  BiLeftArrowAlt,
  FiPlus,
} from '@eten-lab/ui-kit';

import { useAppContext } from '../../hooks/useAppContext';

const { Box } = MuiMaterial;

export function TranslationEditor() {
  const history = useHistory();
  const {
    actions: { alertFeedback },
  } = useAppContext();
  const { getColor } = useColorModeContext();
  const [text, setText] = useState<string>('');

  const handleGoToTranslationPage = () => {
    history.push('/translation');
  };

  const handleSaveTranslation = () => {
    alertFeedback('success', 'Your translation has been sent!');
    history.push('/translation');
  };

  const handleChangeText = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  return (
    <Box
      sx={{
        padding: '20px',
        borderRadius: '20px 20px 0 0',
        borderTop: `1px solid ${getColor('middle-gray')}`,
        boxShadow: '0px 0px 20px rgba(4, 16, 31, 0.1)',
      }}
    >
      <Button
        onClick={handleGoToTranslationPage}
        color="dark"
        variant="text"
        sx={{ paddingLeft: 0 }}
      >
        <BiLeftArrowAlt style={{ fontSize: '24px' }} />
        Add My Translation
      </Button>
      <TextArea
        label="Your translation..."
        value={text}
        fullWidth
        onChange={handleChangeText}
        withLegend={false}
      />
      <Button
        variant="contained"
        startIcon={<FiPlus />}
        fullWidth
        onClick={handleSaveTranslation}
        sx={{ margin: '10px 0' }}
      >
        Add My Translation
      </Button>
    </Box>
  );
}
