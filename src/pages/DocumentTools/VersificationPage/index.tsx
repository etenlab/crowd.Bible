import { Route } from 'react-router-dom';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { Node } from '@eten-lab/models';

import { useSingletons } from '@/hooks/useSingletons';
import { TableNameConst } from '@/constants/table-name.constant';

import { BookListPage } from './BookListPage';
import { BookPage } from './BookPage';

export type VersificationKeys = Record<
  string,
  {
    propertyValues: {
      id: string;
      property_value: string;
      numUpVotes: number;
      numDownVotes: number;
      numPosts: number;
    }[];
  }
>;
type VersificationContextType = {
  bibles: Node[];
  versificationKeys: VersificationKeys;
  onIdentifierAdd(id: string, value: string): void;
};

const VersificationContext = createContext<VersificationContextType>(null!);

export function useVersificationContext() {
  return useContext(VersificationContext);
}

export function VersificationPage() {
  const singletons = useSingletons();
  const [bibles, setBibles] = useState<Node[]>([]);
  const [versificationKeys, setVersificationKeys] = useState<VersificationKeys>(
    {},
  );

  const fetchBibles = useCallback(() => {
    if (singletons) {
      loadBibles();

      async function loadBibles() {
        const bibles = await singletons!.nodeRepo.repository.find({
          relations: {
            propertyKeys: {
              propertyValue: true,
            },
            // bible-to-book
            toNodeRelationships: {
              toNode: {
                propertyKeys: {
                  propertyValue: true,
                },
                // book-to-chapter
                toNodeRelationships: {
                  toNode: {
                    propertyKeys: true,
                    // chapter-to-verse
                    toNodeRelationships: {
                      toNode: {
                        propertyKeys: true,
                      },
                    },
                  },
                },
              },
            },
          },
          where: {
            node_type: 'bible',
          },
        });

        const versificationKeyIds: string[] = [];

        // verse-to-word-sequence are being loaded separately since typeorm
        // generates too long regexp for the all nested relations and throws an
        // error
        for (const bible of bibles) {
          for (const bookRel of bible.toNodeRelationships || []) {
            for (const chapterRel of bookRel.toNode.toNodeRelationships || []) {
              const propertyKey = chapterRel.toNode?.propertyKeys.find(
                ({ property_key }) => property_key === 'chapter-identifier',
              );
              if (propertyKey) {
                versificationKeyIds.push(propertyKey.id);
              }

              for (const verseRel of chapterRel.toNode.toNodeRelationships ||
                []) {
                const propertyKey = verseRel.toNode?.propertyKeys.find(
                  ({ property_key }) => property_key === 'verse-identifier',
                );
                if (propertyKey) {
                  versificationKeyIds.push(propertyKey.id);
                }

                // verse-to-word-sequence
                verseRel.toNode.toNodeRelationships =
                  await singletons!.relationshipRepo.repository.find({
                    relations: {
                      toNode: {
                        propertyKeys: {
                          propertyValue: true,
                        },
                        // word-sequence-to-word
                        toNodeRelationships: {
                          propertyKeys: {
                            propertyValue: true,
                          },
                          toNode: {
                            propertyKeys: {
                              propertyValue: true,
                            },
                          },
                        },
                      },
                    },
                    where: {
                      from_node_id: verseRel.toNode.id,
                    },
                  });

                for (const wordSeqRel of verseRel.toNode.toNodeRelationships) {
                  (wordSeqRel.toNode.toNodeRelationships || []).sort(
                    (relA, relB) => {
                      const jsonA =
                        relA.propertyKeys.find(
                          ({ property_key }) => property_key === 'position',
                        )?.propertyValue?.property_value || '{"value": 0}';
                      const jsonB =
                        relB.propertyKeys.find(
                          ({ property_key }) => property_key === 'position',
                        )?.propertyValue?.property_value || '{"value": 0}';
                      const positionA = JSON.parse(jsonA).value as number;
                      const positionB = JSON.parse(jsonB).value as number;

                      return positionA > positionB
                        ? 1
                        : positionA < positionB
                        ? -1
                        : 0;
                    },
                  );
                }
              }
            }
          }
        }

        const versificationKeys: VersificationKeys = {};

        for (const keyId of versificationKeyIds) {
          versificationKeys[keyId] = {
            propertyValues: [],
          };

          const values =
            await singletons!.nodePropertyValueRepo.repository.find({
              where: {
                node_property_key_id: keyId,
              },
            });

          for (const { id, property_value } of values) {
            const discussion =
              await singletons!.discussionRepo.repository.findOne({
                relations: {
                  posts: true,
                },
                where: {
                  tableName: TableNameConst.NODE_PROPERTY_VALUES,
                  row: id,
                },
              });
            const candidate =
              await singletons!.candidateRepo.repository.findOne({
                where: {
                  candidate_ref: id,
                },
              });
            const upVotes = candidate
              ? await singletons!.voteRepo.repository.find({
                  where: {
                    candidate_id: candidate.id,
                    vote: true,
                  },
                })
              : [];
            const downVotes = candidate
              ? await singletons!.voteRepo.repository.find({
                  where: {
                    candidate_id: candidate.id,
                    vote: false,
                  },
                })
              : [];
            versificationKeys[keyId].propertyValues.push({
              id,
              property_value,
              numUpVotes: upVotes.length,
              numDownVotes: downVotes.length,
              numPosts: discussion?.posts ? discussion.posts.length : 0,
            });
          }
        }

        setBibles(bibles);
        setVersificationKeys(versificationKeys);
      }
    }
  }, [singletons]);

  function handleIdentifierAdd(id: string, value: string) {
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
          versificationKeys,
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
