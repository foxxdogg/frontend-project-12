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
    removeMessagesByChannel: (state, action) => {
      const channelId = action.payload;
      const messagesToRemove = Object.values(state.entities)
        .filter((msg) => msg.channelId === channelId)
        .map((msg) => msg.id);
      messagesAdapter.removeMany(state, messagesToRemove);
    },
  },
});

export const messagesSelectors = messagesAdapter.getSelectors((state) => state.messages);
export const selectMessagesByChannel = createSelector(
  [messagesSelectors.selectAll, (_, channelId) => channelId],
  (messages, channelId) => messages.filter((m) => m.channelId === channelId),
);

export const { addMessage, addMessages, removeMessagesByChannel } = messagesSlice.actions;
export default messagesSlice.reducer;
