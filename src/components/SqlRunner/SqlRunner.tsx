import {
  Button,
  MuiMaterial,
  Typography,
  useColorModeContext,
} from '@eten-lab/ui-kit';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';
const { Box, Tabs, Tab } = MuiMaterial;

export function SqlRunner({ onClose }: { onClose: () => void }) {
  const { getColor } = useColorModeContext();
  const [dimensions, setDimensions] = useState({ w: 200, h: 200 });
  const [selectetTab, setSelectetTab] = useState(0);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectetTab(newValue);
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
              <Box flexDirection={'row'} alignContent="space-between">
                <Typography className="draggable-header">SqlRunner</Typography>
                <Button onClick={onClose}>Close</Button>
              </Box>
              <Box>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={selectetTab} onChange={handleTabChange}>
                    <Tab label="Item One" />
                    <Tab label="Item Two" />
                    <Tab label="Item Three" />
                  </Tabs>
                </Box>
                <SqlWindow
                  selectedTab={selectetTab}
                  thisTabIndex={0}
                ></SqlWindow>
                <SqlWindow
                  selectedTab={selectetTab}
                  thisTabIndex={1}
                ></SqlWindow>
                <SqlWindow
                  selectedTab={selectetTab}
                  thisTabIndex={2}
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
  selectedTab,
  thisTabIndex,
}: {
  selectedTab: number;
  thisTabIndex: number;
}) {
  return <Typography>Some sql here</Typography>;
}
