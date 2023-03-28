import React, { useEffect, useState } from 'react';
import { IonContent } from '@ionic/react';
import axios from 'axios';
import { buildNodesBySearchQuery } from '@/src/graphql';
import { useHistory } from 'react-router-dom';
import { CrowdBibleUI } from '@eten-lab/ui-kit';

const { SearchNode } = CrowdBibleUI;

export function SearchNodePage() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [nodes, setNodes] = useState<Node[]>([]);

  useEffect(() => {
    if (!search) {
      setNodes([]);
      return;
    }
    setIsLoading(true);
    axios
      .post(process.env.REACT_APP_GRAPHQL_URL!, {
        query: buildNodesBySearchQuery(search),
      })
      .then((response) => setNodes(response.data.data.nodesBySearch))
      .finally(() => setIsLoading(false));
  }, [search, setIsLoading]);

  return (
    <IonContent>
      /graph-viewer
      <SearchNode
        nodes={nodes}
        isLoading={isLoading}
        history={history}
        setSearch={setSearch}
      />
    </IonContent>
  );
}
