import React, { useEffect, useReducer, useState } from 'react';
import { IonContent } from '@ionic/react';
import { CrowdBibleUI, MuiMaterial } from '@eten-lab/ui-kit';
import { useSingletons } from '@/src/hooks/useSingletons';
import { useGlobal } from '@/src/hooks/useGlobal';
import { initialState, reducer } from '@/src/reducers';

const { NodeDetails, TitleWithIcon } = CrowdBibleUI;
const { Stack } = MuiMaterial;

interface INodeDetailsPageProps {
  nodeId: string;
  setNodeId: (id: string) => void;
}

export function NodeDetailsPage({ nodeId, setNodeId }: INodeDetailsPageProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { setLoadingState } = useGlobal({ dispatch });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [node, setNode] = useState<any>(null);
  const singletons = useSingletons();

  useEffect(() => {
    const searchNode = async () => {
      if (singletons) {
        const filtered_node = await singletons.nodeRepo.repository.findOne({
          relations: [
            'propertyKeys',
            'propertyKeys.propertyValue',
            'nodeRelationships',
            'nodeRelationships.propertyKeys',
            'nodeRelationships.fromNode',
            'nodeRelationships.toNode',
            'nodeRelationships.toNode.propertyKeys',
            'nodeRelationships.toNode.propertyKeys.propertyValue',
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
        if (filtered_node?.nodeRelationships) {
          for (const node_rel of filtered_node?.nodeRelationships) {
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
          nodeRelationships: new_relationships,
        };
      }
      return null;
    };
    setLoadingState(true);
    searchNode()
      .then((filtered_node) => {
        setNode(filtered_node);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoadingState(false));
  }, [singletons, setLoadingState, nodeId]);

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
        <NodeDetails node={node} setNodeId={setNodeId} />
      </Stack>
    </IonContent>
  );
}
