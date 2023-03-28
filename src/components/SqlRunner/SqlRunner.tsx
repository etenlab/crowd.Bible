import {
  Button,
  MuiMaterial,
  Typography,
  useColorModeContext,
  FiX,
} from '@eten-lab/ui-kit';
import React, { ReactNode, useState } from 'react';
import { createPortal } from 'react-dom';
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';
import Editor from 'react-simple-code-editor';
import useSingletons from '../../hooks/useSingletons';
const { Box, Tabs, Tab, IconButton } = MuiMaterial;

const PADDING = 20;
const PADDING_SMALL = PADDING / 2;
const REDUCE_TABLE_HEIGHT = 75;
const BORDER_W = 1;

type TSqls = {
  lastCreatedIdx: number;
  data: Array<{
    name: string;
    body: string;
    result?: ReactNode;
  }>;
};

const startingDefaultSqls: TSqls = {
  lastCreatedIdx: 1,
  data: [
    {
      name: 'SQL0',
      body: 'SELECT tbl_name from sqlite_master WHERE type = "table"',
    },
    { name: 'SQL1', body: 'select * from node' },
  ],
};

export function SqlRunner({ onClose }: { onClose: () => void }) {
  const singletons = useSingletons();
  const { getColor } = useColorModeContext();
  const [dimensions, setDimensions] = useState({ w: 500, h: 600 });
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

  const nodeRef = React.useRef(null);

  const runSql = (sqlIdxToRun: number) => {
    if (!singletons?.dbService?.dataSource) {
      throw new Error('no singletons.dbService.dataSource found');
    }
    singletons.dbService.dataSource.query(sqls.data[sqlIdxToRun].body).then(
      (fulfilled) => {
        sqls.data[sqlIdxToRun].result = ParseAsTableComopnent(fulfilled);
        setSqls({ ...sqls });
      },
      (rejected) => {
        sqls.data[sqlIdxToRun].result = JSON.stringify(rejected.stack);
        setSqls({ ...sqls });
      },
    );
  };

  return (
    <>
      {createPortal(
        <Draggable nodeRef={nodeRef} handle=".draggable-header">
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
                        sx={{ padding: 0, margin: 0 }}
                        key={idx}
                        label={
                          <span>
                            {sql.name}
                            <IconButton
                              component="div"
                              onClick={() =>
                                window.confirm('Close?')
                                  ? handleCloseTab(idx)
                                  : null
                              }
                            >
                              <FiX />
                            </IconButton>
                          </span>
                        }
                      />
                    ))}
                    <Tab label=" + Add New" key={-1} sx={{ padding: 0 }} />
                  </Tabs>
                </Box>

                <SqlWindow
                  sqls={sqls}
                  selectedIdx={selectedTab}
                  setSqls={setSqls}
                  runSql={runSql}
                  tableSize={{
                    w: dimensions.w - PADDING_SMALL - 2 * BORDER_W,
                    h:
                      dimensions.h -
                      REDUCE_TABLE_HEIGHT -
                      PADDING_SMALL -
                      2 * BORDER_W,
                  }}
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
  runSql,
  tableSize,
}: {
  sqls: TSqls;
  selectedIdx: number;
  setSqls: (sqls: TSqls) => void;
  runSql: (idxtoRun: number) => void;
  tableSize: { w: number; h: number };
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
      height={`${tableSize?.h || 500}px`}
      width={`${tableSize?.w || 500}px`}
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

export function ParseAsTableComopnent(
  sqlResponce: Array<{ [key: string]: string }>,
): ReactNode {
  const { getColor } = useColorModeContext();
  const headers = sqlResponce[0] ? Object.keys(sqlResponce[0]) : [];
  return (
    <table>
      <thead>
        <tr>
          {headers.map((header, i) => (
            <th key={i} style={{ border: 'solid 1px gray' }}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sqlResponce.map((resp, i) => (
          <tr key={i}>
            {headers.map((header, ih) => (
              <td key={ih} style={{ border: `solid 1px ${getColor('gray')}` }}>
                {resp[header]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
