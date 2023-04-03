import React, { useEffect, useState } from 'react';
import { IonContent } from '@ionic/react';
import { CrowdBibleUI, MuiMaterial } from '@eten-lab/ui-kit';
import { useSingletons } from '@/src/hooks/useSingletons';
import { Like } from 'typeorm';

const { SearchNode, TitleWithIcon } = CrowdBibleUI;
const { Stack } = MuiMaterial;

interface ISearchNodePageProps {
  setNodeId: (id: string) => void;
}

export function SearchNodePage({ setNodeId }: ISearchNodePageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [nodes, setNodes] = useState<any>([]);
  const singletons = useSingletons();

  useEffect(() => {
    if (!search) {
      setNodes([]);
      return;
    }
    setIsLoading(true);

    const searchNode = async () => {
      if (singletons) {
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
        console.log(nodes);
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
        console.log(filtered_nodes);
        setNodes(filtered_nodes);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }, [search, singletons, setIsLoading]);

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
          isLoading={isLoading}
          setNodeId={setNodeId}
          search={search}
          setSearch={setSearch}
        />
      </Stack>
    </IonContent>
  );
}
