import { useState } from 'react';

import {
  DragDropContext,
  StrictModeDroppable,
  Draggable,
  DropResult,
  DraggableLocation,
} from '@/components/Droppable';

import { Button, MuiMaterial } from '@eten-lab/ui-kit';

import { useTr } from '@/hooks/useTr';

import { PageLayout } from '@/components/Layout';

const { Box } = MuiMaterial;

// fake data generator
const getItems = (count: number, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k + offset}-${new Date().getTime()}`,
    content: `item ${k + offset}`,
  }));

const reorder = (
  list: { id: string; content: string }[],
  startIndex: number,
  endIndex: number,
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (
  source: Iterable<unknown> | ArrayLike<unknown>,
  destination: Iterable<unknown> | ArrayLike<unknown>,
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation,
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: { [key: string]: any } = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};
const grid = 8;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: `${grid * 2}px`,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle,
  position: 'static',
});

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: `${grid}px`,
  width: 250,
});

export function PlaygroundPage() {
  const { tr } = useTr();

  const [state, setState] = useState([getItems(10), getItems(5, 10)]);

  function onDragEnd(result: DropResult) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd] = items;
      setState(newState);
    } else {
      const result = move(state[sInd], state[dInd], source, destination);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setState(newState.filter((group) => group.length));
    }
  }

  return (
    <PageLayout>
      <Box>
        <Button
          type="button"
          onClick={() => {
            setState([...state, []]);
          }}
        >
          {tr('Add new group')}
        </Button>
        <Button
          type="button"
          onClick={() => {
            setState([...state, getItems(1)]);
          }}
        >
          {tr('Add new item')}
        </Button>
        <Box sx={{ display: 'flex' }}>
          <DragDropContext onDragEnd={onDragEnd}>
            {state.map((el, ind) => (
              <StrictModeDroppable key={ind} droppableId={`${ind}`}>
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    sx={getListStyle(snapshot.isDraggingOver)}
                    {...provided.droppableProps}
                  >
                    {el.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style,
                            )}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-around',
                              }}
                            >
                              {item.content}
                              <Button
                                type="button"
                                onClick={() => {
                                  const newState = [...state];
                                  newState[ind].splice(index, 1);
                                  setState(
                                    newState.filter((group) => group.length),
                                  );
                                }}
                              >
                                {tr('Delete')}
                              </Button>
                            </Box>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </StrictModeDroppable>
            ))}
          </DragDropContext>
        </Box>
      </Box>
    </PageLayout>
  );
}
