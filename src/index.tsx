import 'reflect-metadata';
import React from 'react';
import { createRoot } from 'react-dom/client';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

import { DbService } from '@/services/db.service';
import { SyncService } from '@/services/sync.service';
import { SeedService } from '@/services/seed.service';
import { NodeRepository } from '@/repositories/node/node.repository';
import { NodePropertyKeyRepository } from '@/repositories/node/node-property-key.repository';
import { NodePropertyValueRepository } from '@/repositories/node/node-property-value.repository';
import { NodeTypeRepository } from '@/repositories/node/node-type.repository';
import { RelationshipTypeRepository } from '@/repositories/relationship/relationship-type.repository';
import { RelationshipPropertyValueRepository } from '@/repositories/relationship/relationship-property-value.repository';
import { RelationshipPropertyKeyRepository } from '@/repositories/relationship/relationship-property-key.repository';
import { RelationshipRepository } from '@/repositories/relationship/relationship.repository';
import { SyncSessionRepository } from '@/repositories/sync-session.repository';

import App from './App';

// singletons
export const dbService = new DbService();
export const syncSessionRepository = new SyncSessionRepository(dbService);
export const syncService = new SyncService(dbService, syncSessionRepository);
export const nodeRepository = new NodeRepository(dbService, syncService);
export const nodePropertyKeyRepository = new NodePropertyKeyRepository(
  dbService,
  syncService,
);
export const nodePropertyValueRepository = new NodePropertyValueRepository(
  dbService,
  syncService,
);
export const nodeTypeRepository = new NodeTypeRepository(
  dbService,
  syncService,
);
export const relationshipRepository = new RelationshipRepository(
  dbService,
  syncService,
);
export const relationshipProperyKeyRepository =
  new RelationshipPropertyKeyRepository(dbService, syncService);
export const relationshipPropertyValueRepository =
  new RelationshipPropertyValueRepository(dbService, syncService);
export const relationshipTypeRepository = new RelationshipTypeRepository(
  dbService,
  syncService,
);

export const seedService = new SeedService(
  nodeRepository,
  nodeTypeRepository,
  nodePropertyKeyRepository,
  nodePropertyValueRepository,
  relationshipRepository,
  relationshipTypeRepository,
  relationshipProperyKeyRepository,
  relationshipPropertyValueRepository,
);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
