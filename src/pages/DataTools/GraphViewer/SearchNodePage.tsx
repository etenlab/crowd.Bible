import React, { useEffect, useReducer, useState } from 'react';
import { IonContent } from '@ionic/react';
import { CrowdBibleUI, MuiMaterial } from '@eten-lab/ui-kit';
import { useSingletons } from '@/src/hooks/useSingletons';
import { Like } from 'typeorm';
import { useGlobal } from '@/src/hooks/useGlobal';
import { initialState, reducer } from '@/src/reducers';

const { SearchNode, TitleWithIcon } = CrowdBibleUI;
const { Stack } = MuiMaterial;

interface ISearchNodePageProps {
  setNodeId: (id: string) => void;
}

export function SearchNodePage({ setNodeId }: ISearchNodePageProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { setLoadingState } = useGlobal({ dispatch });
  const [search, setSearch] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [nodes, setNodes] = useState<any>([]);
  const singletons = useSingletons();

  useEffect(() => {
    if (!search) {
      setNodes([]);
      return;
    }
    setLoadingState(true);

    const searchNode = async () => {
      if (singletons) {
        const table_id = await singletons.tableService.createTable('table_1');
        const col_id = await singletons.tableService.createColumn(
          table_id,
          'col-1',
        );
        const row_id = await singletons.tableService.createRow(table_id);
        await singletons.tableService.createCell(col_id, row_id, 'cell-1-1');
        const nodes = await singletons.nodeRepo.repository.find({
          relations: [
            'propertyKeys',
            'propertyKeys.propertyValue',
            'nodeRelationships',
          ],
          where: {
            propertyKeys: {
              propertyValue: {
                property_value: Like(`%${search}%`),
              },
            },
          },
        });

        const new_nodes = [];
        for (const node of nodes) {
          const propertyKeys = node.propertyKeys.map((property_key) => {
            return {
              ...property_key,
              upVotes: 25,
              downVotes: 12,
              posts: [],
              propertyValue: {
                ...property_key.propertyValue,
                upVotes: 25,
                downVotes: 12,
                posts: [],
              },
            };
          });
          new_nodes.push({
            ...node,
            propertyKeys,
          });
        }

        return new_nodes;
      }
      return [];
    };
    searchNode()
      .then((filtered_nodes) => {
        setNodes(filtered_nodes);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoadingState(false));
  }, [search, setLoadingState, singletons]);

  return (
    <IonContent>
      <Stack
        sx={{ padding: '20px', flexGrow: 1, overflowY: 'auto', gap: '16px' }}
      >
        <TitleWithIcon
          label="Graph Viewer"
          onClose={() => {
            setNodeId('');
          }}
          onBack={() => {}}
        />
        <SearchNode
          nodes={nodes}
          setNodeId={setNodeId}
          search={search}
          setSearch={setSearch}
        />
      </Stack>
    </IonContent>
  );
}
