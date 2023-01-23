import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from '../atoms'
import { HouseCard } from '../molecules'
import { FlexBox, Grid } from '../../styles'
import { getHouses, loadMoreHouses } from '../../Store/houses.slice'
import { filterHouses } from '../../helpers'

const HousesStyled = styled(FlexBox)``

function Houses() {
  const dispatch = useDispatch()
  const housesSlice = useSelector((store) => store.housesSlice)
  const { reqStatus, houses, currentPage, selectedCity, selectedType } =
    housesSlice

  useEffect(() => {
    dispatch(getHouses(currentPage))
  }, [dispatch, currentPage])

  const loadMore = () => {
    dispatch(loadMoreHouses())
  }

  return (
    <HousesStyled>
      {reqStatus.isLoading && <div>Loading...</div>}
      {reqStatus.isError && <div>Error</div>}
      {reqStatus.isSuccess && (
        <Grid gridGap="32px">
          {houses.allIds
            .filter((houseId) =>
              filterHouses(houses.byId[houseId], selectedCity, selectedType),
            )
            .map((houseId) => (
              <HouseCard
                title={houses.byId[houseId].title}
                price={houses.byId[houseId].price}
                img={houses.byId[houseId].image}
              />
            ))}
        </Grid>
      )}
      <FlexBox align="center">
        {reqStatus.hasMore && (
          <Button style={{ marginTop: '2rem' }} onClick={loadMore}>
            Load more
          </Button>
        )}
      </FlexBox>
    </HousesStyled>
  )
}

export default styled(Houses)``
