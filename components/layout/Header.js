import styled from 'styled-components';
import HeaderLogo from './components/HeaderLogo'
import HeaderNav from './components/HeaderNav'
import HeaderRight from './components/HeaderRight'

const Header = () => {
  return (
    <HeaderShell>
      <HeaderWrapper>
        <HeaderLogo />
        <HeaderNav />
        <HeaderRight />
      </HeaderWrapper>
    </HeaderShell>
  )
};

const HeaderShell = styled.header`
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  justify-content: center;
  padding: 18px 24px 12px;
  backdrop-filter: blur(18px);
  transition: all 0.4s ease;

  @media (max-width: 768px) {
    padding: 14px 16px 10px;
  }
`

const HeaderWrapper = styled.div`
  width: min(1120px, 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 24px;
  background: ${(props) => props.theme.glassBg};
  border: 1px solid ${(props) => props.theme.glassBorder};
  border-radius: 18px;
  box-shadow: ${(props) => props.theme.cardShadow};
  transition: background 0.3s ease, box-shadow 0.3s ease;

  @media (max-width: 992px) {
    padding: 12px 18px;
  }

  @media (max-width: 768px) {
    gap: 18px;
    flex-wrap: wrap;
  }
`

export default Header