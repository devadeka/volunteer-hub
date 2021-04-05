import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"

import { navLinks } from "../../config"

const StyledNav = styled.nav`
  display: none;
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: flex;
    justify-content: flex-end;
    width: 31.25rem;
    background: ${({ theme }) => theme.colors.background};
    a {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
  .nav-link {
    font-size: 1rem;
    font-weight: 700;
    text-align: center;
    position: relative;
    padding: 0;
    margin-right: 1rem;
    &::before {
      transition: 200ms ease-out;
      height: 0.1563rem;
      content: "";
      position: absolute;
      background-color: ${({ theme }) => theme.colors.primary};
      width: 0%;
      bottom: -0.125rem;
    }
    &:hover::before {
      width: 100%;
    }
    &:last-child {
      margin-right: 0;
    }
  }
`

const Navbar = () => {
  const { menu } = navLinks
  return (
    <StyledNav>
      {menu.map(({ name, url }, key) => {
        return (
          <Link className="nav-link" key={key} to={url}>
            {name}
          </Link>
        )
      })}
    </StyledNav>
  )
}

export default Navbar
