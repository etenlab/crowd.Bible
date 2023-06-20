import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useAppContext } from '@/hooks/useAppContext';
import { useSiteText } from '@/hooks/useSiteText';

import { CrowdBibleUI, MuiMaterial } from '@eten-lab/ui-kit';
import { FeedbackTypes } from '@/constants/common.constant';
import { RouteConst } from '@/constants/route.constant';

const { AgreeConfirm, SimpleQuill } = CrowdBibleUI;
const { Box } = MuiMaterial;

export function FeedbackInput() {
  const history = useHistory();
  const {
    actions: { alertFeedback },
  } = useAppContext();
  const { tr } = useSiteText();

  const [optionalFeedback, setOptionalFeedback] = useState<string>('');

  const handleChangeOptionalFeedback = (newValue: string) => {
    setOptionalFeedback(newValue);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmitFeedback = (agree: 'agree' | 'disagree') => {
    alertFeedback(FeedbackTypes.SUCCESS, tr('Your feedback has been sent!'));
    history.push(RouteConst.FEEDBACK);
  };

  return (
    <Box>
      <AgreeConfirm onClick={handleSubmitFeedback} />
      <SimpleQuill
        placeholder={tr('Leave Feedback (optional)...')}
        value={optionalFeedback}
        onChange={handleChangeOptionalFeedback}
      />
    </Box>
  );
}
