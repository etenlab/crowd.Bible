import { Route } from 'react-router-dom';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useSingletons } from '@/hooks/useSingletons';
import { Node } from '@/models/node/node.entity';
import { TableNameConst } from '@/constants/table-name.constant';

import { BookListPage } from './BookListPage';
import { BookPage } from './BookPage';

type NodePropertyValueData = {
  numUpVotes: number;
  numDownVotes: number;
  numPosts: number;
};
export type NodePropertyValueDatas = Record<string, NodePropertyValueData>;
type VersificationContextType = {
  bibles: Node[];
  nodePropertyValueDatas: NodePropertyValueDatas;
  onIdentifierAdd(id: string, value: string): void;
};

const VersificationContext = createContext<VersificationContextType>(null!);

export function useVersificationContext() {
  return useContext(VersificationContext);
}

export function VersificationPage() {
  const singletons = useSingletons();
  const [bibles, setBibles] = useState<Node[]>([]);
  const [nodePropertyValueDatas, setNodePropertyValueDatas] =
    useState<NodePropertyValueDatas>({});

  const fetchBibles = useCallback(() => {
    if (singletons) {
      loadBibles();

      async function loadBibles() {
        const bibles = await singletons!.nodeRepo.repository.find({
          relations: {
            propertyKeys: {
              propertyValues: true,
            },
            // bible-to-book
            toNodeRelationships: {
              toNode: {
                propertyKeys: {
                  propertyValues: true,
                },
                // book-to-chapter
                toNodeRelationships: {
                  toNode: {
                    propertyKeys: {
                      propertyValues: true,
                    },
                    // chapter-to-verse
                    toNodeRelationships: {
                      toNode: {
                        propertyKeys: {
                          propertyValues: true,
                        },
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

        const nodePropertyValueIds: string[] = [];

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
                for (const { id } of propertyKey.propertyValues || []) {
                  nodePropertyValueIds.push(id);
                }
              }

              for (const verseRel of chapterRel.toNode.toNodeRelationships ||
                []) {
                const propertyKey = verseRel.toNode?.propertyKeys.find(
                  ({ property_key }) => property_key === 'verse-identifier',
                );
                if (propertyKey) {
                  for (const { id } of propertyKey.propertyValues || []) {
                    nodePropertyValueIds.push(id);
                  }
                }

                // verse-to-word-sequence
                verseRel.toNode.toNodeRelationships =
                  await singletons!.relationshipRepo.repository.find({
                    relations: {
                      toNode: {
                        propertyKeys: {
                          propertyValues: true,
                        },
                        // word-sequence-to-word
                        toNodeRelationships: {
                          propertyKeys: {
                            propertyValues: true,
                          },
                          toNode: {
                            propertyKeys: {
                              propertyValues: true,
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
                        )?.propertyValues[0]?.property_value || '{"value": 0}';
                      const jsonB =
                        relB.propertyKeys.find(
                          ({ property_key }) => property_key === 'position',
                        )?.propertyValues[0]?.property_value || '{"value": 0}';
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

        const nodePropertyValueDatas: Record<string, NodePropertyValueData> =
          {};

        for (const id of nodePropertyValueIds) {
          const discussion =
            await singletons!.discussionRepo.repository.findOne({
              relations: {
                posts: true,
              },
              where: {
                table_name: TableNameConst.NODE_PROPERTY_VALUES,
                row: id,
              },
            });
          const candidate = await singletons!.candidateRepo.repository.findOne({
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
          nodePropertyValueDatas[id] = {
            numUpVotes: upVotes.length,
            numDownVotes: downVotes.length,
            numPosts: discussion?.posts ? discussion.posts.length : 0,
          };
        }

        setBibles(bibles);
        setNodePropertyValueDatas(nodePropertyValueDatas);
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
          nodePropertyValueDatas,
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
