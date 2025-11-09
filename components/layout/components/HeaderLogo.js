import styled from 'styled-components';

const HeaderLogo = () => {
  return (
    <Logo>
      Trust<span>Fund</span>
    </Logo>
  )
}

const Logo = styled.h1`
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: 32px;
  margin-left: 12px;
  letter-spacing: 0.08em;
  cursor: pointer;
  color: ${(props) => props.theme.color};
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 6px;

  span {
    color: ${(props) => props.theme.primaryColor};
    font-family: 'Inter', sans-serif;
    font-size: 28px;
    letter-spacing: 0;
    text-transform: none;
  }

  @media (max-width: 768px) {
    font-size: 26px;

    span {
      font-size: 24px;
    }
  }
`

export default HeaderLogo