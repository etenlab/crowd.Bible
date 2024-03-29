import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';

import { CrowdBibleUI, MuiMaterial } from '@eten-lab/ui-kit';

import { useAppContext } from '@/hooks/useAppContext';
import { useTr } from '@/hooks/useTr';

import { PageLayout } from '@/components/Layout';

const { NodeDetails, TitleWithIcon } = CrowdBibleUI;
const { Stack } = MuiMaterial;

export function NodeDetailsPage() {
  const {
    states: {
      global: { singletons },
    },
    actions: { createLoadingStack },
    logger,
  } = useAppContext();
  const { tr } = useTr();

  const history = useHistory();
  const { nodeId } = useParams<{ nodeId: string }>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [node, setNode] = useState<any>(null);

  useEffect(() => {
    const searchNode = async () => {
      if (singletons) {
        const filtered_node = await singletons.nodeRepo.repository.findOne({
          relations: [
            'propertyKeys',
            'propertyKeys.propertyValue',
            'toNodeRelationships',
            'toNodeRelationships.propertyKeys',
            'toNodeRelationships.fromNode',
            'toNodeRelationships.toNode',
            'toNodeRelationships.toNode.propertyKeys',
            'toNodeRelationships.toNode.propertyKeys.propertyValue',
          ],
          where: {
            id: nodeId,
          },
        });

        if (!filtered_node) {
          return null;
        }
        const nodePropertyKeys = filtered_node?.propertyKeys.map(
          (property_key) => {
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
          },
        );
        const new_relationships = [];
        if (filtered_node?.toNodeRelationships) {
          for (const node_rel of filtered_node?.toNodeRelationships) {
            const relPropertyKeys = node_rel.propertyKeys.map(
              (property_key) => {
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
              },
            );
            const new_toNode = {
              ...node_rel.toNode,
              upVotes: 25,
              downVotes: 12,
              posts: [],
              propertyKeys: node_rel.toNode.propertyKeys.map((property_key) => {
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
              }),
            };
            new_relationships.push({
              ...node_rel,
              upVotes: 25,
              downVotes: 12,
              posts: [],
              toNode: new_toNode,
              propertyKeys: relPropertyKeys,
            });
          }
        }

        return {
          ...filtered_node,
          upVotes: 25,
          downVotes: 12,
          posts: [],
          propertyKeys: nodePropertyKeys,
          toNodeRelationships: new_relationships,
        };
      }
      return null;
    };

    const { startLoading, stopLoading } = createLoadingStack();
    startLoading();
    searchNode()
      .then((filtered_node) => {
        setNode(filtered_node);
      })
      .catch((err) => logger.error(err))
      .finally(() => stopLoading());
  }, [singletons, createLoadingStack, nodeId, logger]);

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
          withBackIcon
          withCloseIcon={false}
          onClose={() => {}}
          onBack={() => {
            history.goBack();
          }}
        />
        <NodeDetails node={node} nodeClickHandler={nodeClickHandler} />
      </Stack>
    </PageLayout>
  );
}
