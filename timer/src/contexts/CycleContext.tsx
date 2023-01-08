import { createContext, ReactNode, useState, useReducer } from "react";
import { ActionTypes, addNewCycleAction, interrupteCycle, markCurrentCycleAsFinished } from "../reducers/cycles/actions";
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer";

interface CyclesContextData {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: String | null;
  markCycleAsFinishedDate: () => void;
  amountSecondsPassed: number;
  setAmountSecond: (diff: number) => void;
  CreateNewCycle: (data: CreateCycleData) => void;
  InterrupteCycle: () => void;
}

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

export const CyclesContext = createContext({} as CyclesContextData);

interface CyclesContextsProvidesProps {
  children: ReactNode;
}

export function CyclesContextProvider({
  children,
}: CyclesContextsProvidesProps) {
  //
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer, {
    // dados inicial do objeto   
    cycles: [],
    activeCycleId: null,
  });

  const [amountSecondsPassed, setAmountSecondPassed] = useState(0);

  const { cycles, activeCycleId } = cyclesState;

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function markCycleAsFinishedDate() {
    dispatch(markCurrentCycleAsFinished());
  }

  function setAmountSecond(diff: number) {
    setAmountSecondPassed(diff);
  }

  function CreateNewCycle(data: CreateCycleData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };
    dispatch(addNewCycleAction(newCycle));
    // setCycles((state) => [...state, newCycle]);
    setAmountSecondPassed(0);
  }

  function InterrupteCycle() {
    dispatch(interrupteCycle());
    document.title = "Ignite Timer";
  }

  return (
    <CyclesContext.Provider
      value={{
        activeCycle,
        activeCycleId,
        markCycleAsFinishedDate,
        amountSecondsPassed,
        setAmountSecond,
        CreateNewCycle,
        InterrupteCycle,
        cycles,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
