import styled, { css } from "styled-components";

export type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonContainerProps {
  variant: ButtonVariant;
}

const buttonVariants = {
  primary: "blue",
  secondary: "gray",
  danger: "red",
};

export const ButtonContainer = styled.button<ButtonContainerProps>`
  width: 100px;
  height: 40px;

    background-color: ${props => props.theme.primary};

 /*  ${(props) => {
    return css`
      background-color: ${buttonVariants[props.variant]};
    `;
  }}*/
`;
