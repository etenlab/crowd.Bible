import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Like } from 'typeorm';

import { CrowdBibleUI, MuiMaterial } from '@eten-lab/ui-kit';

import { useAppContext } from '@/hooks/useAppContext';
import { useTr } from '@/hooks/useTr';

import { PageLayout } from '@/components/Layout';

const { SearchNode, TitleWithIcon } = CrowdBibleUI;
const { Stack } = MuiMaterial;

export function SearchNodePage() {
  const {
    states: {
      global: { singletons },
    },
    actions: { createLoadingStack },
    logger,
  } = useAppContext();
  const { tr } = useTr();

  const [search, setSearch] = useState('');
  const history = useHistory();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [nodes, setNodes] = useState<any>([]);

  useEffect(() => {
    if (!search) {
      setNodes([]);
      return;
    }

    const { startLoading, stopLoading } = createLoadingStack();
    startLoading();

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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                property_value: Like(`%${search}%`) as any,
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
      .finally(() => stopLoading());
  }, [search, createLoadingStack, singletons, logger]);

  const nodeClickHandler = (id: string) => {
    history.push(`/graph-viewer/${id}`);
  };

  return (
    <PageLayout>
      <Stack
        sx={{ padding: '20px', flexGrow: 1, overflowY: 'auto', gap: '16px' }}
      >
        <TitleWithIcon
          label={tr('Graph Viewer')}
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
    </PageLayout>
  );
}
