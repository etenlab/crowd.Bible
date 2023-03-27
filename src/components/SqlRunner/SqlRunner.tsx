import {
  Button,
  MuiMaterial,
  Typography,
  useColorModeContext,
  FiX,
} from '@eten-lab/ui-kit';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';
import Editor from 'react-simple-code-editor';
const { Box, Tabs, Tab, IconButton } = MuiMaterial;

type TSqls = {
  lastCreatedIdx: number;
  data: Array<{
    name: string;
    body: string;
    result?: string;
  }>;
};

const startingDefaultSqls: TSqls = {
  lastCreatedIdx: 1,
  data: [
    { name: 'SQL0', body: 'select * from node' },
    { name: 'SQL1', body: 'select * from node1' },
  ],
};

export function SqlRunner({ onClose }: { onClose: () => void }) {
  const { getColor } = useColorModeContext();
  const [dimensions, setDimensions] = useState({ w: 400, h: 300 });
  const [selectedTab, setSelectedTab] = useState(0);
  const [sqls, setSqls] = useState(startingDefaultSqls);
  const handleTabChange = (
    event: React.SyntheticEvent,
    selectedIdx: number,
  ) => {
    if (selectedIdx > sqls.data.length - 1) {
      const newSqlData = {
        name: `SQL${sqls.lastCreatedIdx + 1}`,
        body: '',
      };
      sqls.data.push(newSqlData);
      sqls.lastCreatedIdx += 1;
      setSqls({ ...sqls });
    }
    setSelectedTab(selectedIdx);
  };

  const handleCloseTab = (idx: number) => {
    sqls.data.splice(idx, 1);
    setSqls({ ...sqls });
  };

  const style = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'left',
    border: 'solid 1px #ddd',
    background: '#f0f0f0',
  };
  const nodeRef = React.useRef(null);
  return (
    <>
      {createPortal(
        <Draggable nodeRef={nodeRef} handle=".draggable-header">
          <Resizable
            style={style}
            size={{ width: dimensions.w, height: dimensions.h }}
            onResizeStop={(e, direction, ref, d) => {
              setDimensions({
                w: dimensions.w + d.width,
                h: dimensions.h + d.height,
              });
            }}
          >
            <Box
              ref={nodeRef}
              display={'flex'}
              width={dimensions.w + 'px'}
              height={dimensions.h + 'px'}
              sx={{
                position: 'absolute',
                border: `1px solid ${getColor('gray')}`,
              }}
              flexDirection={'column'}
            >
              <Box
                display="flex"
                flexDirection={'row'}
                alignContent="space-between"
              >
                <Typography flex={1} className="draggable-header">
                  SqlRunner
                </Typography>
                <Button onClick={onClose} sx={{ padding: 0 }}>
                  Close
                </Button>
              </Box>
              <Box>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={selectedTab} onChange={handleTabChange}>
                    {sqls.data.map((sql, idx) => (
                      <Tab
                        key={idx}
                        label={
                          <span>
                            {sql.name}
                            <IconButton
                              component="div"
                              onClick={() => handleCloseTab(idx)}
                            >
                              <FiX />
                            </IconButton>
                          </span>
                        }
                        sx={{ padding: 0 }}
                      />
                    ))}
                    <Tab label=" + Add New" key={-1} sx={{ padding: 0 }} />
                  </Tabs>
                </Box>

                <SqlWindow
                  sqls={sqls}
                  setSqls={setSqls}
                  selectedIdx={selectedTab}
                ></SqlWindow>
              </Box>
            </Box>
          </Resizable>
        </Draggable>,
        document.body,
      )}
    </>
  );
}

function SqlWindow({
  sqls,
  selectedIdx,
  setSqls,
}: {
  sqls: TSqls;
  selectedIdx: number;
  setSqls: (sqls: TSqls) => void;
}) {
  const handleValueChange = (value: string) => {
    sqls.data[selectedIdx].body = value;
    setSqls({ ...sqls });
  };

  return (
    <>
      <Editor
        value={sqls.data[selectedIdx]?.body}
        onValueChange={(v) => handleValueChange(v)}
        highlight={(code) => code}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
        }}
      />
      {sqls.data[selectedIdx]?.body && (
        <Button onClick={() => alert('run!')}>Run</Button>
      )}
      {sqls.data[selectedIdx]?.result && <table> results table</table>}
    </>
  );
}
