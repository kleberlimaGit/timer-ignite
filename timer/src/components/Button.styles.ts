import styled from "styled-components";

export type ButtonVariant = 'primary' | 'secondary' | 'danger';


interface ButtonContainerProps {
    variant:ButtonVariant;
} 

const buttonVariants = {
    primary: 'blue',
    secondary: 'gray',
    danger: 'red'
}


export const ButtonContainer = styled.button<ButtonContainerProps> `
  width: 100px;
  height: 40px;

  ${props => {
    return `background-color: ${buttonVariants[props.variant]}`
  }}

`