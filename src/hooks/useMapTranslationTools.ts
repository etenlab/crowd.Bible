import { useAppContext } from '@/hooks/useAppContext';
import { nanoid } from 'nanoid';
import { useCallback } from 'react';
import { INode, parseSync } from 'svgson';

export enum eProcessStatus {
  NONE = 'NONE',
  PARSING_STARTED = 'PARSING_STARTED',
  PARSING_COMPLETED = 'PARSING_COMPLETED',
  COMPLETED = 'SAVED_IN_DB',
  FAILED = 'FAILED',
}

export type MapDetail = {
  id?: string;
  tempId?: string;
  status: eProcessStatus;
  words?: string[];
  map?: string;
  name?: string;
  langId?: string;
};

export function useMapTranslationTools(
  mapList: MapDetail[],
  setMapList: React.Dispatch<React.SetStateAction<MapDetail[]>>,
) {
  const {
    states: {
      global: { singletons },
      documentTools: { sourceLanguage, targetLanguage },
    },
    actions: { alertFeedback, setLoadingState },
  } = useAppContext();

  const setMapStatus = (tempId: string, state: Partial<MapDetail>) => {
    setMapList((prevList) => {
      const clonedList = [...prevList];
      const idx = clonedList.findIndex((m) => m.tempId === tempId);
      if (idx > -1) {
        clonedList[idx] = { ...clonedList[idx], ...state };
      }
      return clonedList;
    });
  };

  const fileHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, langId: string) => {
      const file = e.target.files?.[0];
      if (file == null) return;
      const id = nanoid();
      setMapList((prevList) => {
        return [
          ...prevList,
          {
            tempId: id,
            name: file.name?.split('.')[0],
            status: eProcessStatus.PARSING_STARTED,
            langId, //langIdRef.current,
          },
        ];
      });
      const fileReader = new FileReader();
      fileReader.onload = function (evt: ProgressEvent<FileReader>) {
        if (evt.target?.readyState !== 2) return;
        if (evt.target.error != null) {
          setMapStatus(id, { status: eProcessStatus.FAILED });
          alertFeedback(
            'error',
            'Error while reading file. Read console for more info',
          );
          return;
        }
        const filecontent = evt.target.result;
        if (!filecontent) {
          setMapStatus(id, { status: eProcessStatus.FAILED });
          alertFeedback(
            'error',
            'Error while reading file. Read console for more info',
          );
          return;
        }
        const originalSvg = filecontent.toString();
        const parsed = parseSync(originalSvg);
        const textArray: string[] = [];
        iterateOverINode(parsed, ['style'], (node) => {
          if (node.type === 'text' || node.type === 'textPath') {
            if (!node.value) return;
            textArray.push(node.value);
          }
        });

        if (textArray.length === 0 && originalSvg) {
          setMapStatus(id, { status: eProcessStatus.FAILED });
          alertFeedback('error', 'No text or textPath tags found');
        } else {
          const base64Svg = Buffer.from(originalSvg, 'utf8').toString('base64');
          setMapStatus(id, {
            status: eProcessStatus.PARSING_COMPLETED,
            map: base64Svg,
            words: textArray,
          });
        }
      };
      fileReader.readAsText(file);
      e.target.value = '';
    },
    [],
  );

  const setMapsByLang = async (langId: string) => {
    if (!singletons) return;
    const res = await singletons.graphThirdLayerService.getMaps(langId);
    setMapList(
      res.map(
        (m) =>
          ({
            id: m.id,
            name: m.name,
            map: m.map,
            status: eProcessStatus.NONE,
            words: [],
          } as MapDetail),
      ),
    );
  };

  /**
   * Should iterate over INode and its children in a consistent order
   * @param node starting node
   * @param skipNodeNames node names to exclude with all its children
   * @param cb callback to be applied
   * @returns
   */
  function iterateOverINode(
    node: INode,
    skipNodeNames: string[],
    cb: (node: INode) => void,
  ) {
    if (skipNodeNames.includes(node.name)) return;
    cb(node);
    for (const child of node.children || []) {
      iterateOverINode(child, skipNodeNames, cb);
    }
  }

  return {
    setMapStatus,
    setMapsByLang,
    fileHandler,
    iterateOverINode,
  };
}
