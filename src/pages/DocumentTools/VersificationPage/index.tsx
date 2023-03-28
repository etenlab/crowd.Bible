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
import { Bible } from './types';

type VersificationContextType = {
  bibles: Bible[];
  onIdentifierAdd(id: number, value: string): void;
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

  function handleIdentifierAdd(id: number, value: string) {
    axios
      .post(process.env.REACT_APP_GRAPHQL_URL!, {
        query: buildCreateNodePropertyValueMutation(id, value),
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
