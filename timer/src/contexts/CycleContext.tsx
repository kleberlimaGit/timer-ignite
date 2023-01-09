import { differenceInSeconds } from "date-fns";
import { createContext, ReactNode, useState, useReducer, useEffect } from "react";
import { addNewCycleAction, interrupteCycle, markCurrentCycleAsFinished } from "../reducers/cycles/actions";
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
  },() => {
    const storageStateAsJSON = localStorage.getItem('@CYCLES-STATE')
    if(storageStateAsJSON){
      return JSON.parse(storageStateAsJSON)
    }
  });

  const { cycles, activeCycleId } = cyclesState;
  
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);
  const [amountSecondsPassed, setAmountSecondPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate));
    }
    return 0;
  });

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@CYCLES-STATE', stateJSON)

  },[cyclesState])



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
