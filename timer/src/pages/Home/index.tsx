import { HandPalm, Play } from "phosphor-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { createContext, useEffect, useState } from "react";

import {
  HomeContainer,
  StartCountDownButton,
  StopCountDownButton,
} from "./styles";
import { NewCycleForm } from "./components/NewCycleForm";
import { CountDown } from "./components/CountDown";
import { differenceInSeconds } from "date-fns";

// controlled -> mantém em tempo real a informaçao do estado do input

//uncontrolled -> busca informaçao do valor do input somente quando precisarmos dela

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface CyclesContextData {
  activeCycle: Cycle | undefined;
  activeCycleId: String | null;
  markCycleAsFinishedDate: (activeCycle: Cycle) => void;
  amountSecondsPassed: number;
  setAmountSecond: () => void;
}

export const CyclesContext = createContext({} as CyclesContextData);

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondPassed] = useState(0);

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, "Informe a tarefa"),
    minutesAmount: zod
      .number()
      .min(1, "Valor mínimo deve ser 5 minutos")
      .max(60, "Valor máximo deve ser 60 minutos"),
  });

  type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 5,
    },
  });
  const { handleSubmit, watch, formState, reset } = newCycleForm;
  // console.log(formState.errors); // como captura as validaçoes de erro usando o react use form

  function handleCreateNewCycle(data: NewCycleFormData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    setCycles((state) => [...state, newCycle]);
    setActiveCycleId(newCycle.id);
    setAmountSecondPassed(0);
    reset();
  }

  function markCycleAsFinishedDate(activeCycle: Cycle) {
    setCycles((state) => [...state, activeCycle]);
    setActiveCycleId(null);
  }

  function setAmountSecond(){
    if(activeCycle){
      setAmountSecondPassed(
        differenceInSeconds(new Date(), activeCycle.startDate)
      );
    }
  }

  function handleInterrupteCycle() {
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

  const task = watch("task");
  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <CyclesContext.Provider
          value={{ activeCycle, activeCycleId, markCycleAsFinishedDate, amountSecondsPassed, setAmountSecond }}
        >
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <CountDown />
        </CyclesContext.Provider>

        {activeCycle ? (
          <StopCountDownButton onClick={handleInterrupteCycle} type="button">
            <HandPalm />
            Interromper
          </StopCountDownButton>
        ) : (
          <StartCountDownButton disabled={isSubmitDisabled} type="submit">
            <Play />
            Começar
          </StartCountDownButton>
        )}
      </form>
    </HomeContainer>
  );
}
