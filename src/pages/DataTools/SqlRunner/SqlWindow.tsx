import { ReactNode } from 'react';
import { Button, MuiMaterial } from '@eten-lab/ui-kit';
import Editor from 'react-simple-code-editor';

const { Box } = MuiMaterial;

export type TSqls = {
  lastCreatedIdx: number;
  data: Array<{
    name: string;
    body: string;
    result?: ReactNode;
  }>;
};

export function SqlWindow({
  sqls,
  selectedIdx,
  setSqls,
  runSql,
  tableSize,
}: {
  sqls: TSqls;
  selectedIdx: number;
  setSqls: (sqls: TSqls) => void;
  runSql: (idxtoRun: number) => void;
  tableSize: { w: string; h: string };
}) {
  const handleValueChange = (value: string) => {
    sqls.data[selectedIdx].body = value;
    setSqls({ ...sqls });
  };

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      alignItems={'start'}
      height={tableSize?.h ? tableSize?.h : '500px'}
      width={tableSize?.w ? tableSize?.w : '500px'}
    >
      <Box width={'100%'}>
        <Editor
          value={sqls.data[selectedIdx]?.body}
          onValueChange={(v) => handleValueChange(v)}
          highlight={(code) => code}
          padding={10}
          ignoreTabKey={true}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
          }}
        />
      </Box>
      {sqls.data[selectedIdx]?.body && (
        <Button onClick={() => runSql(selectedIdx)}>Run</Button>
      )}

      <Box height={'100%'} width={'100%'} overflow={'scroll'}>
        {sqls.data[selectedIdx]?.result && sqls.data[selectedIdx]?.result}
      </Box>
    </Box>
  );
}
