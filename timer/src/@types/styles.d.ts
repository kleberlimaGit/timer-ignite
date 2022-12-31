import 'styled-components';
import { defaultTheme } from '../styles/themes/default'

type ThemeType = typeof defaultTheme;

/* cria/sobrescreve uma tipagem para o modulo do styled components*/
declare module 'styled-components' {
    export interface DefaultTheme extends ThemeType {}
}