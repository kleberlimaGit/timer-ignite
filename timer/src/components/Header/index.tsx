import { HeaderContainer } from "./styles";
import {Timer,Scroll} from 'phosphor-react'
import IgniteLogo from '../../assets/ignite-logo.svg'

export function Header() {
    return (
<HeaderContainer>
        <img src={IgniteLogo} />
        <nav>
            <a href=""><Timer size={20}/></a>
            <a href=""><Scroll size={20}/></a>
        </nav>

</HeaderContainer>

    )
}