import { differenceInSeconds } from "date-fns";
import { createContext, ReactNode, useState } from "react";

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface CyclesContextData {
  cycles: Cycle[]
  activeCycle: Cycle | undefined;
  activeCycleId: String | null;
  markCycleAsFinishedDate: (activeCycle: Cycle) => void;
  amountSecondsPassed: number;
  setAmountSecond: () => void;
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

  function markCycleAsFinishedDate(activeCycle: Cycle) {
    setCycles((state) => [...state, activeCycle]);
    setActiveCycleId(null);
  }

  function setAmountSecond() {
    if (activeCycle) {
      setAmountSecondPassed(
        differenceInSeconds(new Date(), activeCycle.startDate)
      );
    }
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
    // reset();
  }

  function InterrupteCycle() {
    setCycles(
      cycles.map((cycle) => {
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
        cycles
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
