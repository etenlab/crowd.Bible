import { nanoid } from 'nanoid';

import { ElectionTypeConst } from '@/constants/voting.constant';
import { TableNameConst } from '@/constants/table-name.constant';
import { type SeedService } from './seed.service';

type SeedBible = {
  properties: {
    name: string;
  };
  books: SeedBook[];
};
type SeedBook = {
  properties: {
    name: string;
  };
  chapters: SeedChapter[];
};
type SeedChapter = {
  properties: {
    'chapter-identifier': string;
  };
  verses: SeedVerse[];
};
type SeedVerse = {
  properties: {
    'verse-identifier': string;
  };
  text: string;
};

export class SeedVersificationService {
  constructor(readonly seedService: SeedService) {}

  async init() {
    const verse1 = {
      properties: { 'verse-identifier': '1-2' },
      text: 'In the beginning God created the heavens and the earth',
    };
    const verse2 = {
      properties: { 'verse-identifier': '3-5' },
      text: 'Now the earth was formless and empty',
    };
    const chapter = {
      properties: { 'chapter-identifier': '9' },
      verses: [verse1, verse2],
    };
    const book = {
      properties: { name: 'Genesis' },
      chapters: [chapter],
    };
    const bible = {
      properties: { name: 'NIV' },
      books: [book],
    };

    const bibleId = await this.createBible(bible);
    await this.addVotesAndPostsToChaptersAndVerses(bibleId);
  }

  async createBible(bible: SeedBible) {
    const bibleNode = await this.seedService.nodeRepository.createNode('bible');
    await this.seedService.insertPropsToNode(bibleNode.id, bible.properties);
    let counter = 0;

    for (const book of bible.books) {
      counter += 1;
      const bookId = await this.createBook(book);
      await this.addRelationship('bible-to-book', bibleNode.id, bookId, {
        position: counter,
      });
    }

    return bibleNode.id;
  }

  async createBook(book: SeedBook) {
    const bookNode = await this.seedService.nodeRepository.createNode('book');
    await this.seedService.insertPropsToNode(bookNode.id, book.properties);
    let counter = 0;

    for (const chapter of book.chapters) {
      counter += 1;
      const chapterId = await this.createChapter(chapter);
      await this.addRelationship('book-to-chapter', bookNode.id, chapterId, {
        position: counter,
      });
    }

    return bookNode.id;
  }

  async createChapter(chapter: SeedChapter) {
    const chapterNode = await this.seedService.nodeRepository.createNode(
      'chapter',
    );
    await this.seedService.insertPropsToNode(
      chapterNode.id,
      chapter.properties,
    );
    let counter = 0;

    for (const verse of chapter.verses) {
      counter += 1;
      const verseId = await this.createVerse(verse);
      await this.addRelationship('chapter-to-verse', chapterNode.id, verseId, {
        position: counter,
      });
    }

    return chapterNode.id;
  }

  async createVerse(verse: SeedVerse) {
    const verseNode = await this.seedService.nodeRepository.createNode('verse');
    await this.seedService.insertPropsToNode(verseNode.id, verse.properties);
    const wordSequenceId = await this.createWordSequence(verse.text);
    await this.addRelationship(
      'verse-to-word-sequence',
      verseNode.id,
      wordSequenceId,
    );

    return verseNode.id;
  }

  async createWordSequence(text: string) {
    const wordSequenceNode = await this.seedService.nodeRepository.createNode(
      'word-sequence',
    );
    let counter = 0;

    for (const word of text.split(/\s+/)) {
      counter += 1;
      const wordId = await this.createWord(word);
      await this.addRelationship(
        'word-sequence-to-word',
        wordSequenceNode.id,
        wordId,
        { position: counter },
      );
    }

    return wordSequenceNode.id;
  }

  async createWord(word: string) {
    const wordNode = await this.seedService.nodeRepository.createNode('word');
    await this.seedService.insertPropsToNode(wordNode.id, { word_name: word });
    return wordNode.id;
  }

  async addRelationship(
    relType: string,
    fromNodeId: string,
    toNodeId: string,
    props: Record<string, unknown> = {},
  ) {
    const relationship =
      await this.seedService.relationshipRepository.createRelationship(
        fromNodeId,
        toNodeId,
        relType,
      );

    for (const [key, value] of Object.entries(props)) {
      const relationshipPropKey =
        await this.seedService.relationshipPropertyKeyRepository.getRelationshipPropertyKey(
          relationship!.id,
          key,
        );

      await this.seedService.relationshipPropertyValueRepository.setRelationshipPropertyValue(
        relationshipPropKey!,
        value,
      );
    }
  }

  async addVotesAndPostsToChaptersAndVerses(bibleId: string) {
    const bible = await this.seedService.nodeRepository.repository.findOne({
      relations: {
        // bible-to-book
        toNodeRelationships: {
          toNode: {
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
        id: bibleId,
      },
    });

    if (bible) {
      for (const bookRel of bible.toNodeRelationships || []) {
        for (const chapterRel of bookRel.toNode.toNodeRelationships || []) {
          for (const propertyKey of chapterRel.toNode.propertyKeys || []) {
            for (const propertyValue of propertyKey.propertyValues || []) {
              await this.addRandomVotes(propertyValue.id);
              await this.addRandomPosts(propertyValue.id);
            }
          }
          for (const verseRel of chapterRel.toNode.toNodeRelationships || []) {
            for (const propertyKey of verseRel.toNode.propertyKeys || []) {
              for (const propertyValue of propertyKey.propertyValues || []) {
                await this.addRandomVotes(propertyValue.id);
                await this.addRandomPosts(propertyValue.id);
              }
            }
          }
        }
      }
    }
  }

  async addRandomVotes(id: string) {
    const election = await this.seedService.electionRepository.createElection(
      ElectionTypeConst.TRANSLATION,
      id,
      TableNameConst.NODE_PROPERTY_VALUES,
      TableNameConst.NODE_PROPERTY_VALUES,
    );
    const candidate =
      await this.seedService.candidateRepository.createCandidate(
        election.id,
        id,
      );

    const randomNum = Math.floor(Math.random() * 20) + 1;

    for (let i = 0; i < randomNum; i += 1) {
      await this.addVote(candidate.id);
    }
  }

  async addVote(candidate_id: string) {
    const vote = await this.seedService.voteRepository.repository.create({
      candidate_id,
      user_id: nanoid(),
      vote: !Math.floor(Math.random() * 2),
    });
    await this.seedService.voteRepository.repository.save(vote);
  }

  async addRandomPosts(id: string) {
    const randomNum = Math.floor(Math.random() * 20) + 1;

    for (let i = 0; i < randomNum; i += 1) {
      await this.addPost(
        TableNameConst.NODE_PROPERTY_VALUES,
        id,
        'Lorem Ipsum...',
      );
    }
  }

  async addPost(table_name: string, row: string, plain_text: string) {
    let discussion =
      await this.seedService.discussionRepository.repository.findOne({
        where: {
          table_name,
          row,
        },
      });

    if (!discussion) {
      discussion =
        await this.seedService.discussionRepository.repository.create({
          id: nanoid(),
          table_name,
          row,
        });

      await this.seedService.discussionRepository.repository.save(discussion);
    }

    const post = await this.seedService.postRepository.repository.create({
      id: nanoid(),
      discussion_id: discussion.id,
      plain_text,
      quill_text: plain_text,
      user_id: 1,
    });

    await this.seedService.postRepository.repository.save(post);
  }
}
