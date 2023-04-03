// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { useHistory, useParams } from 'react-router-dom';
// import { buildNodeQuery } from '@/src/graphql';
import { IonContent } from '@ionic/react';
// import { CrowdBibleUI } from '@eten-lab/ui-kit';

// const { NodeDetails } = CrowdBibleUI;

export function NodeDetailsPage() {
  // const history = useHistory();
  // const { nodeId } = useParams<{ nodeId: string }>();
  // const [isLoading, setIsLoading] = useState(false);
  // const [node, setNode] = useState<null | Node>(null);

  // useEffect(() => {
  //   setIsLoading(true);
  //   axios
  //     .post(process.env.REACT_APP_GRAPHQL_URL!, {
  //       query: buildNodeQuery(nodeId),
  //     })
  //     .then((response) => setNode(response.data.data.node))
  //     .finally(() => setIsLoading(false));
  // }, [nodeId, setIsLoading]);

  return (
    <IonContent>
      /graph-viewer
      {/* <NodeDetails node={node} isLoading={isLoading} history={history} /> */}
    </IonContent>
  );
}
