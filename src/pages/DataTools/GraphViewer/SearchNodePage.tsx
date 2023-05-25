import React, { useEffect, useReducer, useState } from 'react';
import { IonContent } from '@ionic/react';
import { CrowdBibleUI, MuiMaterial } from '@eten-lab/ui-kit';
import { Like } from 'typeorm';
import { useGlobal } from '@/src/hooks/useGlobal';
import { initialState, reducer } from '@/src/reducers';
import { useHistory } from 'react-router';
import { useAppContext } from '../../../hooks/useAppContext';

const { SearchNode, TitleWithIcon } = CrowdBibleUI;
const { Stack } = MuiMaterial;

export function SearchNodePage() {
  const {
    states: {
      global: { singletons },
    },
    logger,
  } = useAppContext();
  const [, dispatch] = useReducer(reducer, initialState);
  const { setLoadingState } = useGlobal({ dispatch });
  const [search, setSearch] = useState('');
  const history = useHistory();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [nodes, setNodes] = useState<any>([]);

  useEffect(() => {
    if (!search) {
      setNodes([]);
      return;
    }
    setLoadingState(true);

    const searchNode = async () => {
      if (singletons) {
        const nodes = await singletons.nodeRepo.repository.find({
          relations: [
            'propertyKeys',
            'propertyKeys.propertyValue',
            'fromNodeRelationships',
            'toNodeRelationships',
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
      .catch((err) => logger.error(err))
      .finally(() => setLoadingState(false));
  }, [search, setLoadingState, singletons, logger]);

  const nodeClickHandler = (id: string) => {
    history.push(`/graph-viewer/${id}`);
  };

  return (
    <IonContent>
      <Stack
        sx={{ padding: '20px', flexGrow: 1, overflowY: 'auto', gap: '16px' }}
      >
        <TitleWithIcon
          label="Graph Viewer"
          withCloseIcon={false}
          onClose={() => {}}
          onBack={() => {}}
        />
        <SearchNode
          nodes={nodes}
          nodeClickHandler={nodeClickHandler}
          search={search}
          setSearch={setSearch}
        />
      </Stack>
    </IonContent>
  );
}
