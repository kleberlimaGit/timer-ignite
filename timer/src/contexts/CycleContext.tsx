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

interface CyclesState {
  cycles: Cycle[];
  activeCycleId: string | null;
}

export function CyclesContextProvider({
  children,
}: CyclesContextsProvidesProps) {
  //
  const [cyclesState, dispatch] = useReducer(
    (state: CyclesState, action: any) => {
      switch (action.type) {
        case "ADD_NEW_CYCLE":
          return {
            ...state,
            cycles: [...state.cycles, action.payload.newCycle],
            activeCycleId: action.payload.newCycle.id,
          };
        case "INTERRUPT_CURRENT_CYCLE":
          return {
            ...state,
            cycles: state.cycles.map((cycle) => {
              if (state.activeCycleId === cycle.id) {
                return { ...cycle, interruptedDate: new Date() };
              } else {
                return cycle;
              }
            }),
            activeCycleId: null,
          };

        case "MARK_CURRENT_CYCLE_AS_FINISH":
          return {
            ...state,
            cycles: state.cycles.map((cycle) => {
              if (state.activeCycleId === cycle.id) {
                return { ...cycle, finishedDate: new Date() };
              } else {
                return cycle;
              }
            }),
            activeCycleId: null,
          };
        default:
          console.log("algum erro ocorreu");
          break;
      }

      return state;
    },
    {
      cycles: [],
      activeCycleId: null,
    }
  );

  const [amountSecondsPassed, setAmountSecondPassed] = useState(0);

  const { cycles, activeCycleId } = cyclesState;

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function markCycleAsFinishedDate() {
    dispatch({
      type: "MARK_CURRENT_CYCLE_AS_FINISH",
      payload: {
        activeCycleId,
      },
    });
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
    dispatch({
      type: "ADD_NEW_CYCLE",
      payload: {
        newCycle,
      },
    });
    // setCycles((state) => [...state, newCycle]);
    setAmountSecondPassed(0);
  }

  function InterrupteCycle() {
    dispatch({
      type: "INTERRUPT_CURRENT_CYCLE",
      payload: {
        activeCycleId,
      },
    });
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
