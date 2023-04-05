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

import { Link } from '@/components/Link';

import { useWordSequence } from '@/hooks/useWordSequence';
import { useVote } from '@/hooks/useVote';

import { WordSequenceDto } from '@/dtos/word-sequence.dto';

const { Box } = MuiMaterial;

type TranslationEditorProps = {
  subWordSequence:
    | Nanoid
    | {
        range: {
          start: number;
          end: number;
        };
        origin: WordSequenceDto;
      };
  documentId: Nanoid;
};

export function TranslationEditor({
  subWordSequence,
  documentId,
}: TranslationEditorProps) {
  const history = useHistory();
  const { createTranslation, createSubWordSequence } = useWordSequence();
  const { createElection, addBallotEntry, listElections } = useVote();
  const { getColor } = useColorModeContext();
  const [text, setText] = useState<string>('');

  const handleSaveTranslation = async () => {
    let subWordSequenceId: Nanoid;
    let electionId: Nanoid;

    if (typeof subWordSequence !== 'string') {
      const wordSequenceId = await createSubWordSequence(
        subWordSequence.origin,
        subWordSequence.range,
      );

      if (!wordSequenceId) {
        return;
      }

      const tmpElectionId = await createElection('nodes', wordSequenceId);

      if (!tmpElectionId) {
        return;
      }

      electionId = tmpElectionId;

      subWordSequenceId = wordSequenceId;
    } else {
      subWordSequenceId = subWordSequence;

      electionId = (await listElections('nodes', subWordSequenceId))[0];
    }

    const translationId = await createTranslation(subWordSequenceId, text);

    if (!translationId) {
      return;
    }

    await addBallotEntry(electionId, {
      tableName: 'nodes',
      rowId: translationId,
    });

    history.push(`/translation/${documentId}`);
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
      <Link to={`/translation/${documentId}`}>
        <Button color="dark" variant="text" sx={{ paddingLeft: 0 }}>
          <BiLeftArrowAlt style={{ fontSize: '24px' }} />
          Add My Translation
        </Button>
      </Link>
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
