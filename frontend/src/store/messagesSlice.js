import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';

const messagesAdapter = createEntityAdapter();

const initialState = messagesAdapter.getInitialState();

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: messagesAdapter.addOne,
    addMessages: messagesAdapter.addMany,
  },
});

export const messagesSelectors = messagesAdapter.getSelectors((state) => state.messages);
export const selectMessagesByChannel = createSelector(
  [messagesSelectors.selectAll, (_, channelId) => channelId],
  (messages, channelId) => messages.filter((m) => m.channelId === channelId),
);

export const { addMessage, addMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
