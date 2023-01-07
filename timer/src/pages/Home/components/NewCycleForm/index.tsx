import { useContext } from "react";
import { useForm } from "react-hook-form/dist/useForm";
import { CyclesContext } from "../..";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { FormContainer, MinuteAmountInput, TaskInput } from "./styles";
import { useFormContext } from "react-hook-form";

export function NewCycleForm() {
  const { activeCycle, activeCycleId, markCycleAsFinishedDate } =
    useContext(CyclesContext);

    const { register } = useFormContext();

  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>
      <TaskInput
        type="text"
        id="task"
        placeholder="Dê um nome para o seu projeto"
        disabled={!!activeCycle}
        {...register("task")}
      />

      <label htmlFor="minutesAmount">durante</label>
      <MinuteAmountInput
        type="number"
        id="minutesAmount"
        placeholder="00"
        step={5}
        min={1}
        max={60}
        disabled={!!activeCycle}
        required
        {...register("minutesAmount", { valueAsNumber: true })}
      />

      <span>minutos.</span>
    </FormContainer>
  );
}
