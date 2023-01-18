import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { main } from '../../constants'

const MainMenuStyled = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    margin-left: 1rem;

    &:first-child {
      margin-left: 0;
    }
  }
`
const LinkStyled = styled(NavLink)`
  text-decoration: none;
  cursor: pointer;
  color: black;

  &.active {
    font-weight: bold;
  }
`

function MainMenu() {
  return (
    <MainMenuStyled>
      {Object.values(main).map(({ path, label }) => (
        <li key={path}>
          <LinkStyled to={path}>{label}</LinkStyled>
        </li>
      ))}
    </MainMenuStyled>
  )
}

export default styled(MainMenu)``
