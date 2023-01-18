import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from '../atoms'
import { HouseCard } from '../molecules'
import { useFetch } from '../../hooks'
import { FlexBox, Grid } from '../../styles'
import { urls } from '../../constants'
import { getHouses, loadMoreHouses } from '../../Store/houses.slice'

const HousesStyled = styled(FlexBox)``

function Houses() {
  const { loading, isError, isSuccess } = useFetch(urls.houses)
  const dispatch = useDispatch()
  const housesStore = useSelector((store) => store.housesStore)
  const { houses } = housesStore

  useEffect(() => {
    dispatch(getHouses())
  }, [dispatch])

  const loadMore = () => {
    dispatch(loadMoreHouses())
  }

  return (
    <HousesStyled>
      {loading && <div>Loading...</div>}
      {isError && <div>Error</div>}
      {isSuccess && (
        <Grid gridGap="32px">
          {houses.pagedHouses.map((house) => (
            <HouseCard
              key={house.id}
              title={house.title}
              price={`${house.price}€`}
              img={house.image}
              link=""
            />
          ))}
        </Grid>
      )}
      <FlexBox align="center">
        {!houses.hideShowMore && (
          <Button style={{ marginTop: '2rem' }} onClick={loadMore}>
            Load more
          </Button>
        )}
      </FlexBox>
    </HousesStyled>
  )
}

export default styled(Houses)``
