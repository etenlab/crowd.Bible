import React, { useState } from 'react';
import { SearchNodePage } from './SearchNodePage';
import { NodeDetailsPage } from './NodeDetailsPage';

export function GraphViewerPage() {
  const [nodeId, setNodeId] = useState('');

  return (
    <>
      {!nodeId ? (
        <SearchNodePage setNodeId={setNodeId} />
      ) : (
        <NodeDetailsPage nodeId={nodeId} setNodeId={setNodeId} />
      )}
    </>
  );
}
