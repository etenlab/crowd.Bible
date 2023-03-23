import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useAppContext } from '@/hooks/useAppContext';
import { CrowdBibleUI, MuiMaterial } from '@eten-lab/ui-kit';

const { AgreeConfirm, SimpleQuill } = CrowdBibleUI;
const { Box } = MuiMaterial;

export function FeedbackInput() {
  const history = useHistory();
  const {
    actions: { alertFeedback },
  } = useAppContext();
  const [optionalFeedback, setOptionalFeedback] = useState<string>('');

  const handleChangeOptionalFeedback = (newValue: string) => {
    setOptionalFeedback(newValue);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmitFeedback = (agree: 'agree' | 'disagree') => {
    alertFeedback('success', 'Your feedback has been sent!');
    history.push('/feedback');
  };

  return (
    <Box>
      <AgreeConfirm onClick={handleSubmitFeedback} />
      <SimpleQuill
        placeholder="Leave Feedback (optional)..."
        value={optionalFeedback}
        onChange={handleChangeOptionalFeedback}
      />
    </Box>
  );
}
