import { Route } from 'react-router-dom';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { BookListPage } from './BookListPage';
import { BookPage } from './BookPage';
import { fakeData } from './fakeData';
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
    setBibles([fakeData]);
  }, []);

  function handleIdentifierAdd(id: number, value: string) {
    alert(
      `Add chapter or verse identifier "${value}" for node_property_key_id "${id}"`,
    );
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
