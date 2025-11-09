import styled from 'styled-components';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import {App} from '../Layout';
import { useContext } from 'react';
import Wallet from './Wallet';


const HeaderRight = () => {
  const ThemeToggler = useContext(App);

  return (
    <HeaderRightWrapper>
      <Wallet />
      <ThemeToggle onClick={ThemeToggler.changeTheme}>
      {ThemeToggler.theme === 'light' ? <DarkModeIcon /> : <Brightness7Icon />}
      </ThemeToggle>
    </HeaderRightWrapper>
  )
}

const HeaderRightWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  height: 56px;
`
const ThemeToggle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.bgDiv};
  height: 44px;
  width: 44px;
  border-radius: 14px;
  cursor: pointer;
  border: 1px solid ${(props) => props.theme.borderColor};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.bgDivHover};
    box-shadow: ${(props) => props.theme.cardHoverShadow};
  }
`

export default HeaderRight