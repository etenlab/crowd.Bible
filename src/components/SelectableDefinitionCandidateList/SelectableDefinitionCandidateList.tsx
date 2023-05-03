import { useState, useEffect, useMemo, memo } from 'react';

import { useAppContext } from '@/hooks/useAppContext';
import { useSiteText } from '@/hooks/useSiteText';

import { VotableContent } from '@/dtos/votable-item.dto';

import {
  DescriptionList,
  type DescriptionItem,
} from '@/components/DescriptionList';

type SelectableDefinitionCandidateListProps = {
  word: string;
  languageId: Nanoid;
  description: string;
  onChangeDescription(description: string | null): void;
};

function SelectableDefinitionCandidateListPure({
  word,
  languageId,
  description,
  onChangeDescription,
}: SelectableDefinitionCandidateListProps) {
  const {
    states: {
      global: { singletons },
    },
  } = useAppContext();
  const { getDefinitioinVotableContentByWord } = useSiteText();

  const [definitionVotableContent, setDefintionVotableContent] = useState<
    VotableContent[]
  >([]);
  const [selectedDefinitionId, setSelectedDefinitionId] =
    useState<Nanoid | null>(null);
  const [definitionDescription, setDefinitionDescription] =
    useState<string>('');

  // fetch defintions whenever change word
  useEffect(() => {
    if (singletons && word.trim().length > 0) {
      getDefinitioinVotableContentByWord(word.trim(), languageId).then(
        setDefintionVotableContent,
      );
    }
  }, [word, languageId, singletons, getDefinitioinVotableContentByWord]);

  const handleSelectRadio = async (definitionId: Nanoid) => {
    setSelectedDefinitionId(definitionId);
    const votable = definitionVotableContent.find(
      (votable) => votable.id === definitionId,
    );

    if (!votable) {
      onChangeDescription('');
      setDefinitionDescription('');
    } else {
      onChangeDescription(votable.content);
      setDefinitionDescription(votable.content);
    }
  };

  const items: DescriptionItem[] = useMemo(() => {
    return definitionVotableContent
      .filter((votable) => votable.id)
      .map(
        (votable) =>
          ({
            id: votable.id,
            description: votable.content,
            vote: {
              upVotes: votable.upVotes,
              downVotes: votable.downVotes,
              candidateId: votable.candidateId,
            },
          } as DescriptionItem),
      );
  }, [definitionVotableContent]);

  if (items.length === 0) {
    return null;
  }

  const selectedId =
    description === definitionDescription ? selectedDefinitionId : null;

  return (
    <DescriptionList
      title="Definition Candidates"
      items={items}
      radioBtn={{
        checkedId: selectedId,
        onSelectRadio: handleSelectRadio,
      }}
    />
  );
}

export const SelectableDefinitionCandidateList = memo(
  SelectableDefinitionCandidateListPure,
);
