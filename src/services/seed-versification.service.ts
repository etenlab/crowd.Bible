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

    await this.createBible(bible);
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
}
