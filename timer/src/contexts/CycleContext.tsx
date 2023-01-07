import { createContext, ReactNode, useState, useReducer } from "react";

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface CyclesContextData {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: String | null;
  markCycleAsFinishedDate: () => void;
  amountSecondsPassed: number;
  setAmountSecond: (diff:number) => void;
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
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondPassed] = useState(0);

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function markCycleAsFinishedDate() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
            setActiveCycleId(null)
          return { ...cycle, finishedDate: new Date() };
        } else {
          return cycle;
        }
      })
    );
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

    setCycles((state) => [...state, newCycle]);
    setActiveCycleId(newCycle.id);
    setAmountSecondPassed(0);
  }

  function InterrupteCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (activeCycleId === cycle.id) {
          return { ...cycle, interruptedDate: new Date() };
        } else {
          return cycle;
        }
      })
    );

    setActiveCycleId(null);
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
