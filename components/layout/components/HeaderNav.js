import styled from 'styled-components';
import { useRouter } from 'next/router';
import Link from 'next/link';

const HeaderNav = () => {
  const Router = useRouter();

  return (
    <HeaderNavWrapper>
      <Link passHref href={'/'}><HeaderNavLinks active={Router.pathname == "/" ? true : false} >
        Campaigns
      </HeaderNavLinks></Link>
      <Link passHref href={'/createcampaign'}><HeaderNavLinks active={Router.pathname == "/createcampaign" ? true : false} >
        Create Campaign
      </HeaderNavLinks></Link>
      <Link passHref href={'/dashboard'}><HeaderNavLinks active={Router.pathname == "/dashboard" ? true : false} >
        Dashboard
      </HeaderNavLinks></Link>
    </HeaderNavWrapper>
  )
}

const HeaderNavWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => props.theme.glassBg};
  padding: 6px;
  height: 54px;
  border-radius: 14px;
  border: 1px solid ${(props) => props.theme.glassBorder};
  box-shadow: ${(props) => props.theme.cardShadow};
  transition: background 0.3s ease;

  @media (max-width: 768px) {
    height: auto;
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
  }
`

const HeaderNavLinks = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.active ? props.theme.primaryColor : 'transparent'};
  height: 100%;
  font-family: 'Inter', sans-serif;
  margin: 6px;
  border-radius: 12px;
  padding: 0 16px;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.08em;
  color: ${(props) => props.active ? '#fff' : props.theme.color};
  border: 1px solid ${(props) => props.active ? props.theme.primaryColor : 'transparent'};
  transition: all 0.2s ease;

  &:hover {
    color: #fff;
    background-color: ${(props) => props.theme.primaryColor};
    border-color: ${(props) => props.theme.primaryColor};
    box-shadow: ${(props) => props.theme.cardHoverShadow};
  }

  @media (max-width: 768px) {
    width: calc(50% - 12px);
    justify-content: center;
    padding: 10px 12px;
  }
`

export default HeaderNav