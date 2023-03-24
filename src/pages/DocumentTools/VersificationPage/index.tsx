import { Route } from 'react-router-dom';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import axios from 'axios';

import {
  buildNodesByNodeTypeQuery,
  buildCreateNodePropertyValueMutation,
} from './graphql';
import { BookListPage } from './BookListPage';
import { BookPage } from './BookPage';
import { Bible, VersificationConfig } from './types';

type VersificationContextType = {
  bibles: Bible[];
  onIdentifierAdd(params: {
    identifier: string;
    config: VersificationConfig;
  }): void;
};

const VersificationContext = createContext<VersificationContextType>(null!);

export function useVersificationContext() {
  return useContext(VersificationContext);
}

export function VersificationPage() {
  const [bibles, setBibles] = useState<Bible[]>([]);

  const fetchBibles = useCallback(() => {
    axios
      .post(process.env.REACT_APP_GRAPHQL_URL!, {
        query: buildNodesByNodeTypeQuery('bible'),
      })
      .then((response) => setBibles(response.data.data.nodesByNodeType));
  }, []);

  function handleIdentifierAdd({
    identifier,
    config,
  }: {
    identifier: string;
    config: VersificationConfig;
  }) {
    axios
      .post(process.env.REACT_APP_GRAPHQL_URL!, {
        query: buildCreateNodePropertyValueMutation(
          config.node_property_key_id,
          identifier,
        ),
      })
      .then(() => fetchBibles());
  }

  useEffect(() => {
    fetchBibles();
  }, [fetchBibles]);

  return (
    <>
      <VersificationContext.Provider
        value={{
          bibles,
          onIdentifierAdd: handleIdentifierAdd,
        }}
      >
        <Route exact path="/versification/bible/:bibleId/book/:bookId">
          <BookPage />
        </Route>
        <Route exact path="/versification">
          <BookListPage />
        </Route>
      </VersificationContext.Provider>
    </>
  );
}
