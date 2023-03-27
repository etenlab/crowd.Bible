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

  const runSql = (sqlIdxToRun: number) => {
    singletons?.dbService.dataSource.query(sqls.data[sqlIdxToRun].body).then(
      (fulfilled) => {
        sqls.data[sqlIdxToRun].result = parseAsTable(fulfilled);
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
                  selectedIdx={selectedTab}
                  setSqls={setSqls}
                  runSql={runSql}
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
}: {
  sqls: TSqls;
  selectedIdx: number;
  setSqls: (sqls: TSqls) => void;
  runSql: (idxtoRun: number) => void;
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
        <Button onClick={() => runSql(selectedIdx)}>Run</Button>
      )}

      {sqls.data[selectedIdx]?.result && (
        <Box overflow={'auto'}>{sqls.data[selectedIdx]?.result}</Box>
      )}
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseAsTable(sqlResponce: Array<any>): ReactNode {
  const headers = Object.keys(sqlResponce[0]);
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
              <td key={ih} style={{ border: 'solid 1px gray' }}>
                {resp[header]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
