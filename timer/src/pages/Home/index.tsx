import { Play } from "phosphor-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { differenceInSeconds } from "date-fns";
import * as zod from "zod";
import { useEffect, useState } from "react";

import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinuteAmountInput,
  Separator,
  StartCountDownButton,
  TaskInput,
} from "./styles";

// controlled -> mantém em tempo real a informaçao do estado do input

//uncontrolled -> busca informaçao do valor do input somente quando precisarmos dela

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "Informe a tarefa"),
  minutesAmount: zod
    .number()
    .min(5, "Valor mínimo deve ser 5 minutos")
    .max(60, "Valor máximo deve ser 60 minutos"),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondPassed] = useState(0);

  const { register, handleSubmit, watch, formState, reset } =
    useForm<NewCycleFormData>({
      resolver: zodResolver(newCycleFormValidationSchema),
      defaultValues: {
        task: "",
        minutesAmount: 5,
      },
    });

  function handleCreateNewCycle(data: NewCycleFormData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    setCycles((state) => [...state, newCycle]);
    setActiveCycleId(newCycle.id);
    setAmountSecondPassed(0)
    reset();
  }

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

  const minutesAmount = Math.floor(currentSeconds / 60);
  const secondsAmount = currentSeconds % 60;

  const minutes = String(minutesAmount).padStart(2, "0");
  const seconds = String(secondsAmount).padStart(2, "0");

  console.log(activeCycle);

  useEffect(() => {
    let interval: number;
    if (activeCycle) {
      interval = setInterval(() => {
        setAmountSecondPassed(differenceInSeconds(new Date(),activeCycle.startDate))
      }, 1000);

      setTimeout(() => {
        clearInterval(interval)
      }, totalSeconds*1000);
    }
    return ( () => {
      clearInterval(interval)
    }
  )
  }, [activeCycle]);

  useEffect(() => {
      if(activeCycle){
        document.title = `Ignite Timer ${minutes}:${seconds}`
      }
  }, [minutes,seconds,activeCycle])

  const task = watch("task");
  const isSubmitDisabled = !task;

  // console.log(formState.errors); // como captura as validaçoes de erro usando o react use form

  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            type="text"
            id="task"
            placeholder="Dê um nome para o seu projeto"
            {...register("task")}
          />

          <label htmlFor="minutesAmount">durante</label>
          <MinuteAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5}
            min={5}
            max={60}
            required
            {...register("minutesAmount", { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        <StartCountDownButton disabled={isSubmitDisabled} type="submit">
          <Play />
          Começar
        </StartCountDownButton>
      </form>
    </HomeContainer>
  );
}
