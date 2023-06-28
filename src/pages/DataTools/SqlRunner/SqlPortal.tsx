import React, { useState } from 'react';
import { createPortal } from 'react-dom';

import {
  Button,
  MuiMaterial,
  Typography,
  useColorModeContext,
} from '@eten-lab/ui-kit';

import Draggable, { DraggableEventHandler } from 'react-draggable';
import { Resizable } from 're-resizable';
import { SqlRunner } from './SqlRunner';

import { useAppContext } from '@/hooks/useAppContext';
import { useTr } from '@/hooks/useTr';

const { Box } = MuiMaterial;

export function SqlPortal() {
  const {
    actions: { setSqlPortalShown },
    states: {
      global: { sqlPortalPosition },
    },
  } = useAppContext();
  const { getColor } = useColorModeContext();
  const { tr } = useTr();

  const [dimensions, setDimensions] = useState({ w: 800, h: 600 });

  const nodeRef = React.useRef(null);

  const savePosition: DraggableEventHandler = (e, data) => {
    setSqlPortalShown(true, { x: data.x, y: data.y });
  };

  return (
    <>
      {createPortal(
        <Draggable
          nodeRef={nodeRef}
          handle=".draggable-header"
          position={{
            x: sqlPortalPosition?.x || 0,
            y: sqlPortalPosition?.y || 0,
          }}
          onStop={savePosition}
        >
          <Resizable
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'left',
              border: 'solid 1px #ddd',
              background: '#f0f0f0',
            }}
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
              position={'absolute'}
              border={`1px solid ${getColor('gray')}`}
              flexDirection={'column'}
            >
              <Box
                display="flex"
                flexDirection={'row'}
                alignContent="space-between"
              >
                <Typography flex={1} className="draggable-header">
                  {tr('SqlRunner')}
                </Typography>
                <Button
                  onClick={() => {
                    setSqlPortalShown(false);
                  }}
                  sx={{ padding: 0 }}
                >
                  {tr('Close')}
                </Button>
              </Box>

              <SqlRunner></SqlRunner>
            </Box>
          </Resizable>
        </Draggable>,
        document.body,
      )}
    </>
  );
}
