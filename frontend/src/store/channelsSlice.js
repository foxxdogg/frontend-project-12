import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { logout } from './authSlice'

const channelsAdapter = createEntityAdapter()

const initialState = channelsAdapter.getInitialState({
  currentChannelId: '1',
})

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel: channelsAdapter.addOne,
    removeChannel: channelsAdapter.removeOne,
    addChannels: channelsAdapter.addMany,
    setCurrentChannel: (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state.currentChannelId = action.payload
    },
    updateChannel: channelsAdapter.updateOne,
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState)
  },
})

export const channelsSelectors = channelsAdapter.getSelectors(
  (state) => state.channels
)
export const {
  addChannel,
  addChannels,
  setCurrentChannel,
  removeChannel,
  updateChannel,
} = channelsSlice.actions
export default channelsSlice.reducer
