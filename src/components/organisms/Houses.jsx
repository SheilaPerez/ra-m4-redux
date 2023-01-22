import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from '../atoms'
import { HouseCard } from '../molecules'
import { FlexBox, Grid } from '../../styles'
import { getHouses, loadMoreHouses } from '../../Store/houses.slice'
import {
  selectHouses,
  selectReqStatus,
  selectCurrentPage,
} from '../../Store/houses.selectors'

const HousesStyled = styled(FlexBox)``

function Houses() {
  const dispatch = useDispatch()
  const houses = useSelector((store) => selectHouses(store.housesSlice))
  const reqStatus = useSelector((store) => selectReqStatus(store.housesSlice))
  const currentPage = useSelector((store) =>
    selectCurrentPage(store.housesSlice),
  )

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
          {houses.map((house) => (
            <HouseCard
              title={house.title}
              price={house.price}
              img={house.image}
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
