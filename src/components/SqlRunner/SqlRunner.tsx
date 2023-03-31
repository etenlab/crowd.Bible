import {
  Button,
  MuiMaterial,
  Typography,
  useColorModeContext,
  FiX,
} from '@eten-lab/ui-kit';
import React, { ReactNode, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';
import { useSingletons } from '@/hooks/useSingletons';
import { SqlWindow } from './SqlWindow';
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
      name: 'All tables',
      body: 'SELECT tbl_name from sqlite_master WHERE type = "table"',
    },
    { name: 'All nodes', body: 'select * from node' },
    {
      name: 'All word nodes',
      body: `
--==========select all words and its values===================
select npv.*, npk.*, n.* from node_property_value npv
join node_property_key npk on npv.node_property_key_id = npk.id
join node n on n.id = npk.node_id
where n.node_type='word'
--============================================================`,
    },
    {
      name: 'SQL3',
      body: `
--===========select all property values of nodeId==============
select npv.*, npk.*, n.* from node_property_value npv
join node_property_key npk on npv.node_property_key_id = npk.id
join node n on n.id = npk.node_id
where n.id='uNHTLw6ZFy9mhz7-Wsxij'
--=============================================================
`,
    },
    {
      name: 'SQL4',
      body: `
--=========select all relationships from nodeId=================
select * from relationship rs where 
  rs.relationship_type='word-to-definition' and 
  rs.from_node_id = 'yfrxVpjlR1Vyon_towTs0'
--============================================================
`,
    },
    {
      name: 'SQL5',
      body: `
--===========select related node types of relations===========
select rs.*, nf.node_type as 'fromNodeType', nt.node_type as 'toNodeType'
from relationship rs
join node nf on rs.from_node_id=nf.id
join node nt on rs.to_node_id=nt.id
where 
  rs.relationship_type='word-to-definition' and 
  rs.from_node_id = 'yfrxVpjlR1Vyon_towTs0'
--============================================================
`,
    },
  ],
};

export function SqlRunner({ onClose }: { onClose: () => void }) {
  const singletons = useSingletons();
  const { getColor } = useColorModeContext();
  const [dimensions, setDimensions] = useState({ w: 800, h: 600 });
  const [selectedTab, setSelectedTab] = useState(0);
  const [sqls, setSqls] = useState(startingDefaultSqls);
  const handleTabChange = useCallback(
    (event: React.SyntheticEvent, selectedIdx: number) => {
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
    },
    [sqls],
  );

  const handleCloseTab = (idx: number) => {
    sqls.data.splice(idx, 1);
    setSqls({ ...sqls });
  };

  const nodeRef = React.useRef(null);

  const runSql = useCallback(
    (sqlIdxToRun: number) => {
      if (!singletons?.dbService?.dataSource) {
        throw new Error('no singletons.dbService.dataSource found');
      }
      singletons.dbService.dataSource.query(sqls.data[sqlIdxToRun].body).then(
        (fulfilled) => {
          sqls.data[sqlIdxToRun].result = TableFromResponce({
            sqlResponce: fulfilled,
          });
          setSqls({ ...sqls });
        },
        (rejected) => {
          sqls.data[sqlIdxToRun].result = (
            <span>{JSON.stringify(rejected.stack)}</span>
          );
          setSqls({ ...sqls });
        },
      );
    },
    [singletons?.dbService?.dataSource, sqls],
  );

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

export function TableFromResponce({
  sqlResponce,
}: {
  sqlResponce: Array<{ [key: string]: string }>;
}) {
  const headers = sqlResponce[0] ? Object.keys(sqlResponce[0]) : [];
  return (
    <table>
      <thead>
        <tr>
          {headers.map((header, i) => (
            <th key={i} style={{ border: `solid 1px gray` }}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sqlResponce.map((resp, i) => (
          <tr key={i}>
            {headers.map((header, ih) => (
              <td key={ih} style={{ border: `solid 1px gray` }}>
                {resp[header]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
