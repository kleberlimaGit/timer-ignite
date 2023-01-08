import { useContext } from "react";
import { CyclesContext } from "../../contexts/CycleContext";
import { formatDistanceToNow, differenceInMinutes } from "date-fns";
import ptBR from "date-fns/esm/locale/pt-BR";

import { HistoryContainer, HistoryList, Status } from "./styles";


export function History() {
  const { cycles } = useContext(CyclesContext);
  
  return (
    <HistoryContainer>
      <h1>History</h1>

      <HistoryList>
        <table>
          <thead>
            <tr>
              <th>Tarefa</th>
              <th>Duração</th>
              <th>Início</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {cycles.map((cycle) => {
              return (
                <tr key={cycle.id}>
                  <td>{cycle.task}</td>
                  <td>
                    {cycle.interruptedDate && differenceInMinutes(cycle.interruptedDate, cycle.startDate) + ' minutos'} 
                    {!cycle.interruptedDate && cycle.minutesAmount + ' minutos'} 
                  </td>
                  <td>{formatDistanceToNow(cycle.startDate, {addSuffix: true, locale:ptBR})}</td>
                  <td>
                    {cycle.finishedDate && (
                      <Status statusColor="green">Concluído</Status>
                    )}
                    {cycle.interruptedDate && (
                      <Status statusColor="red">Interrompido</Status>
                    )}
                    {!cycle.finishedDate && !cycle.interruptedDate && (
                      <Status statusColor="yellow">Em andamento</Status>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  );
}
