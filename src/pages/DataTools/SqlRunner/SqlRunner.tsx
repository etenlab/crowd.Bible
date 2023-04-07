import {
  MuiMaterial,
  useColorModeContext,
  FiX,
  Button,
} from '@eten-lab/ui-kit';
import React, { ReactNode, useCallback, useState, useEffect } from 'react';

import { TableFromResponce } from './tools';
import { IonContent, IonToolbar } from '@ionic/react';
import Editor from 'react-simple-code-editor';
import { useAppContext } from '../../../hooks/useAppContext';
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
      name: 'Tables',
      body: 'SELECT tbl_name from sqlite_master WHERE type = "table"',
    },
    { name: 'Nodes', body: 'select * from nodes' },
    {
      name: 'Word nodes',
      body: `
--==========select all words and its values===================
select n.id as "node_id", n.node_type, 
npk.id as "key_id", 
npv.id as "property_key", npv.property_value 
from nodes n
left join node_property_keys npk on n.id = npk.node_id 
left join node_property_values npv on npk.id = npv.node_property_key_id
where n.node_type='word'
--============================================================
`,
    },
    {
      name: 'Info On node',
      body: `
--=== Get info on nodes (relations TO/FROM this node, and info of this node's properties) ======
select nodes.id as "nodeId", nodes.node_type, npk.property_key, npv.property_value,

r_to_other.id as "r_to_other", 
n_to.node_type as "nToType",

r_from_other.id as "r_from_other",
n_from.id as "nFromId",
n_from.node_type as "nFromType"

from nodes

left join relationships r_to_other on nodes.id = r_to_other.from_node_id
left join relationships r_from_other on nodes.id = r_from_other.to_node_id

left join nodes n_to on r_to_other.to_node_id = n_to.id
left join nodes n_from on r_from_other.from_node_id = n_from.id


left join node_property_keys npk on nodes.id = npk.node_id
left join node_property_values npv on npk.id = npv.node_property_key_id

where nodes.id='BjEqDQXhxyT6H56dCkugL'
--===========================================================================================

`,
    },
  ],
};

export function SqlRunner({
  dimensions,
}: {
  dimensions?: { w: number; h: number };
}) {
  const {
    states: {
      global: { isSqlPortalShown, singletons },
    },
    actions: { setSqlPortalShown },
  } = useAppContext();
  // const singletons = useSingletons();
  const { getColor } = useColorModeContext();
  const [selectedTab, setSelectedTab] = useState(0);
  const [sqls, setSqls] = useState(startingDefaultSqls);
  const [sqlToolbarH, setSqlToolbarH] = useState(40);
  const sqlToolbarRef = React.useRef<HTMLIonToolbarElement>(null);

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
  const handleValueChange = (value: string) => {
    sqls.data[selectedTab].body = value;
    setSqls({ ...sqls });
  };

  const handleCloseTab = (idx: number) => {
    sqls.data.splice(idx, 1);
    setSqls({ ...sqls });
  };

  useEffect(() => {
    const sqlToolbar = sqlToolbarRef.current;
    if (!sqlToolbar) return;

    const observer = new ResizeObserver((entries) => {
      const h = entries[0].contentRect.height;
      setSqlToolbarH(h);
    });
    observer.observe(sqlToolbar);

    return () => {
      observer.disconnect();
    };
  }, [sqlToolbarRef]);

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
    <IonContent>
      <IonToolbar style={{ position: 'fixed' }} ref={sqlToolbarRef}>
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
                      window.confirm('Close?') ? handleCloseTab(idx) : null
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
        <Box width={'100%'} maxHeight={'300px'} overflow="auto">
          <Editor
            value={sqls.data[selectedTab]?.body}
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

        {!isSqlPortalShown && (
          <Button onClick={() => setSqlPortalShown(true)}>
            Show in portal
          </Button>
        )}
        {sqls.data[selectedTab]?.body && (
          <Button onClick={() => runSql(selectedTab)}>Run</Button>
        )}
      </IonToolbar>
      <Box
        marginTop={`${sqlToolbarH}px`}
        display={'flex'}
        width={dimensions ? dimensions.w + 'px' : '100%'}
        height={dimensions ? dimensions.h + 'px' : undefined}
        position={'absolute'}
        border={`1px solid ${getColor('middle-gray')}`}
        flexDirection={'column'}
        overflow={'auto'}
      >
        <Box>
          <Box height={'100%'} width={'100%'}>
            {sqls.data[selectedTab]?.result && sqls.data[selectedTab]?.result}
          </Box>
        </Box>
      </Box>
    </IonContent>
  );
}
