import styled from "styled-components";

export const HomeContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3.5rem;
  }
`;

export const BaseCountDownButton = styled.button`
  width: 100%;
  border: 0;
  padding: 1rem;
  border-radius: 4px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  color: ${(props) => props.theme["gray-100"]};

  cursor: pointer;

  transition: 0.3s background-color;
`;

export const StartCountDownButton = styled(BaseCountDownButton)`
  background: ${(props) => props.theme["green-500"]};

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    background: ${(props) => props.theme["green-700"]};
  }
`;
export const StopCountDownButton = styled(BaseCountDownButton)`
  background: ${(props) => props.theme["red-500"]};

  &:hover {
    background: ${(props) => props.theme["red-700"]};
  }
`;
