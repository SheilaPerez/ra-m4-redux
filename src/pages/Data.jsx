import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Body } from '../components/layout'
import { getHouses } from '../Store/houses.slice'

function Data() {
  const dispatch = useDispatch()
  const houses = useSelector((state) => state.housesStore.houses)
  const { allIds, byId } = houses
  useEffect(() => {
    dispatch(getHouses())
  }, [dispatch])

  return (
    <Body>
      {allIds.map((id) => (
        <div>
          <p>{byId[id].title}</p>
        </div>
      ))}
    </Body>
  )
}

export default Data
