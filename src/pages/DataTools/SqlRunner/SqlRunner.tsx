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
select n.node_id, n.node_type, 
npk.property_key,
npv.property_value 
from nodes n
left join node_property_keys npk on n.node_id = npk.node_id 
left join node_property_values npv on npk.node_property_key_id = npv.node_property_key_id
where n.node_type='word'
--============================================================
`,
    },
    {
      name: 'Info On node',
      body: `
--=== Get info on nodes (relations TO/FROM this node, and info of this node's properties) ======
select nodes.node_id, nodes.node_type, npk.property_key, npv.property_value,

n_to.node_type as "nToType",

n_from.node_type as "n_from_type"

from nodes

left join relationships r_to_other on nodes.node_id = r_to_other.from_node_id
left join relationships r_from_other on nodes.node_id = r_from_other.to_node_id

left join nodes n_to on r_to_other.to_node_id = n_to.node_id
left join nodes n_from on r_from_other.from_node_id = n_from.node_id


left join node_property_keys npk on nodes.node_id = npk.node_id
left join node_property_values npv on npk.node_property_key_id = npv.node_property_key_id
--where nodes.node_type='word'
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
  const dbService = singletons?.dbService;
  const { getColor } = useColorModeContext();
  const [selectedTab, setSelectedTab] = useState(0);
  const [sqls, setSqls] = useState<TSqls>(
    JSON.parse(JSON.stringify(startingDefaultSqls)) as TSqls,
  );
  const [sqlToolbarH, setSqlToolbarH] = useState(40);
  const sqlToolbarRef = React.useRef<HTMLIonToolbarElement>(null);
  const [isSqlsLoaded, setSqlsLoaded] = useState(false);

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

  const resetToDefault = useCallback(async () => {
    const localForage = dbService?.localForage as LocalForage;
    if (!localForage) return;
    await localForage.setItem('sqlRunner', startingDefaultSqls);
    setSqls(JSON.parse(JSON.stringify(startingDefaultSqls)) as TSqls);
  }, [dbService?.localForage]);

  const handleValueChange = useCallback(
    (value: string) => {
      sqls.data[selectedTab].body = value;
      const localForage = dbService?.localForage as LocalForage;
      if (!localForage) return;
      const saveSqls = { ...sqls };
      saveSqls.data = sqls.data.map((d) => ({ name: d.name, body: d.body }));
      localForage.setItem('sqlRunner', saveSqls);
      setSqls({ ...sqls });
    },
    [selectedTab, dbService?.localForage, sqls],
  );

  useEffect(() => {
    const localForage = dbService?.localForage as LocalForage;
    if (!localForage || isSqlsLoaded) return;
    const loadSqls = async () => {
      const loadedSqls = (await localForage.getItem('sqlRunner')) as TSqls;
      if (!loadedSqls) return;
      // loadedSqls.data.forEach((s) => delete s.result);
      setSqls(loadedSqls);
      setSqlsLoaded(true);
    };
    loadSqls();
  }, [dbService?.localForage, isSqlsLoaded]);

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
    <>
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
          <Button
            onClick={() =>
              window.confirm('Reset all sqls?') ? resetToDefault() : null
            }
          >
            Reset sqls to default
          </Button>
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
          {sqls.data[selectedTab]?.result && sqls.data[selectedTab]?.result}
        </Box>
      </IonContent>
    </>
  );
}
