import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import {
  addChannels,
  channelsSelectors,
  setCurrentChannel,
  addChannel,
  removeChannel,
  updateChannel,
} from '../store/channelsSlice';
import {
  addMessages,
  addMessage,
  selectMessagesByChannel,
  removeMessagesByChannel,
} from '../store/messagesSlice';
import { logout } from '../store/authSlice';
import socket from '../socket';
import AddChannelModal from '../components/AddChannelModal';
import RenameChannelModal from '../components/RenameChannelModal';
import Modal from '../components/Modal';

const MainPage = () => {
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRemoveChannelModalOpen, setIsRemoveChannelModalOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isRenameChannelModalOpen, setIsRenameChannelModalOpen] = useState(false);
  const [channelToDeleteId, setChannelToDeleteId] = useState(null);
  const [channelToRenameName, setChannelToRenameName] = useState(null);
  const [channelToRenameId, setChannelToRenameId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [removeError, setRemoveError] = useState(null);

  const messagesEndRef = useRef(null);
  const activeChannelRef = useRef(null);
  const isFirstScroll = useRef(true);
  const inputRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);
  const currentUser = useSelector((state) => state.auth.user);
  const currentUserName = useSelector((state) => (state.auth.user ? state.auth.user.username : ''));
  const channels = useSelector(channelsSelectors.selectAll);
  const currentChannelId = useSelector(
    (state) => state.channels.currentChannelId,
  );
  const currentChannel = channels.find(
    (channel) => channel.id === currentChannelId,
  );
  const currentChannelName = currentChannel ? currentChannel.name : '';
  const currentChannelMessages = useSelector(
    (state) => selectMessagesByChannel(state, currentChannelId),
  );
  const messages = useSelector((state) => state.messages.entities);

  useEffect(() => {
    console.log('Full Redux State Snapshot:');
    console.log('Token:', token);
    console.log('User:', currentUser);
    console.log('Channels:', channels);
    console.log('Current Channel ID:', currentChannelId);
    console.log('Messages:', messages);
  }, [token, currentUser, channels, currentChannelId, messages]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.classList.add('input-focus');
      const timer = setTimeout(() => {
        inputRef.current.classList.remove('input-focus');
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [currentChannelId]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  const sendMessage = async () => {
    if (!messageText.trim()) return;

    setError(null);
    setIsSending(true);

    const newMessage = {
      body: messageText,
      channelId: currentChannelId,
      username: currentUserName,
    };

    try {
      await axios.post('/api/v1/messages', newMessage, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessageText('');
      setError(null);
    } catch (e) {
      setError('Network issues. Message not sent.');
      console.log(e);
    } finally {
      setIsSending(false);
    }
  };

  const addNewChannel = async (name) => {
    const newChannel = { name };
    const response = await axios.post('/api/v1/channels', newChannel, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
      setError(null);
    };
    const handleDisconnect = () => {
      setIsConnected(false);
      setError(null);
    };
    const handleConnectError = () => setIsConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
    };
  }, []);

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    const fetchData = async (url, action) => {
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(action(response.data));
      } catch (e) {
        console.log(e);
      }
    };

    fetchData('/api/v1/channels', addChannels);
    fetchData('/api/v1/messages', addMessages);

    const handleNewMessage = (payload) => {
      dispatch(addMessage(payload));
    };

    const handleNewChannel = (payload) => {
      dispatch(addChannel(payload));
    };

    const handleRemoveChannel = (payload) => {
      dispatch(removeChannel(payload));
    };

    const handleRenameChannel = (payload) => {
      dispatch(updateChannel(payload));
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('newChannel', handleNewChannel);
    socket.on('removeChannel', handleRemoveChannel);
    socket.on('renameChannel', handleRenameChannel);
    // eslint-disable-next-line consistent-return
    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('newChannel', handleNewChannel);
      socket.off('removeChannel', handleRemoveChannel);
      socket.off('renameChannel', handleRenameChannel);
    };
  }, [token, navigate, dispatch]);

  useEffect(() => {
    if (!currentChannelMessages.length) return;
    if (messagesEndRef.current && typeof window !== 'undefined') {
      if (isFirstScroll.current) {
        window.requestAnimationFrame(() => {
          messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
          isFirstScroll.current = false;
        });
      } else {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [currentChannelMessages]);

  useEffect(() => {
    if (activeChannelRef.current && typeof window !== 'undefined') {
      activeChannelRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [channels]);

  useEffect(() => {
    setError(null);
    isFirstScroll.current = true;
  }, [currentChannelId]);

  return (
    <div className="d-flex flex-column h-100 bg-light">
      {isModalOpen && (
        <AddChannelModal
          handleAdd={async (name) => {
            try {
              setIsAdding(true);
              const newChannel = await addNewChannel(name);
              dispatch(addChannel(newChannel));
              dispatch(setCurrentChannel(newChannel.id));
              setIsModalOpen(false);
            } finally {
              setIsAdding(false);
            }
          }}
          onClose={() => {
            setIsModalOpen(false);
          }}
          channels={channels}
          placeholder="Add channel"
          error={error}
          isSubmitting={isAdding}
        />
      )}

      {isRenameChannelModalOpen && (
        <RenameChannelModal
          handleRename={async (name) => {
            try {
              setIsRenaming(true);
              const editedChannel = { name };
              const response = await axios.patch(`/api/v1/channels/${channelToRenameId}`, editedChannel, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              dispatch(updateChannel({
                id: response.data.id,
                changes: { name: response.data.name },
              }));
              setIsRenameChannelModalOpen(false);
              setChannelToRenameId(null);
              return response.data;
            } finally {
              setIsRenaming(false);
            }
          }}
          onClose={() => {
            setIsRenameChannelModalOpen(false);
            setChannelToRenameId(null);
            setChannelToRenameName(null);
          }}
          channels={channels}
          placeholder="Rename channel"
          channelName={channelToRenameName}
          isSubmitting={isRenaming}
        />
      )}

      {isRemoveChannelModalOpen && (
        <Modal
          title="Remove Channel?"
          initialValues={{}}
          validationSchema={null}
          submitText="Remove"
          isSubmitting={isRemoving}
          error={removeError}
          onClose={() => {
            setIsRemoveChannelModalOpen(false);
            setRemoveError(null);
          }}
          onSubmit={async () => {
            try {
              setIsRemoving(true);
              setRemoveError(null);
              if (currentChannelId === channelToDeleteId) {
                dispatch(setCurrentChannel('1'));
              }
              await axios.delete(`/api/v1/channels/${channelToDeleteId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              dispatch(removeChannel(channelToDeleteId));
              dispatch(removeMessagesByChannel(channelToDeleteId));
              setChannelToDeleteId(null);
              setIsRemoveChannelModalOpen(false);
            } catch (e) {
              console.log(e);
              setRemoveError('Failed to remove channel');
            } finally {
              setIsRemoving(false);
            }
          }}
        >
          <p className="modal-body p-0">Are U Sure?</p>
        </Modal>
      )}

      <div className="navbar bg-white">
        <div className="container">
          <span className="navbar-brand">YouChat</span>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="container h-100 my-4 rounded shadow bg-white overflow-hidden">
        <div className="row h-100">
          <div className="col-4 d-flex bg-light flex-column border-end h-100 pb-5">
            <div className="d-flex align-items-center justify-content-between p-4 mb-4">
              <b>Channels</b>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsModalOpen(true)}
              >
                Add
              </button>
            </div>
            <div className="flex-grow-1 d-flex flex-column h-100 overflow-auto">
              <ul className="nav nav-pills flex-column align-items-center ps-4 pe-4 w-100">
                {channels.map((channel) => (
                  <li className="nav-item w-100" key={channel.id} ref={currentChannelId === channel.id ? activeChannelRef : null}>
                    {!channel.removable ? (
                      <button
                        type="button"
                        className={`btn w-100 rounded-0 text-start no-hover ${
                          channel.id === currentChannelId
                            ? 'btn-secondary'
                            : 'btn-light'
                        }`}
                        onClick={() => dispatch(setCurrentChannel(channel.id))}
                      >
                        #&nbsp;
                        {channel.name}
                      </button>
                    ) : (
                      <div className="btn-group d-flex dropdown">
                        <button
                          type="button"
                          className={`btn w-100 rounded-0 text-start no-hover ${
                            channel.id === currentChannelId
                              ? 'btn-secondary'
                              : 'btn-light'
                          }`}
                          onClick={() => dispatch(setCurrentChannel(channel.id))}
                        >
                          #&nbsp;
                          {channel.name}
                        </button>
                        <button
                          type="button"
                          className={`btn rounded-0 text-start flex-grow-0 dropdown-toggle dropdown-toggle-split no-hover ${
                            channel.id === currentChannelId
                              ? 'btn-secondary'
                              : 'btn-light'
                          }`}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <span className="visually-hidden">Channels control</span>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() => {
                                setChannelToDeleteId(channel.id);
                                setIsRemoveChannelModalOpen(true);
                              }}
                            >
                              Delete
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() => {
                                setChannelToRenameName(channel.name);
                                setChannelToRenameId(channel.id);
                                setIsRenameChannelModalOpen(true);
                              }}
                            >
                              Rename
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-8 p-0 d-flex flex-column h-100">
            <div className="p-4 bg-light border-bottom mb-3">
              <b>
                #&nbsp;
                {currentChannelName}
              </b>
              <p className="text-muted m-0">
                {currentChannelMessages.length}
                &nbsp;messages
              </p>
            </div>
            <div className="overflow-auto px-5">
              {currentChannelMessages.map((msg, index) => (
                <div
                  key={msg.id}
                  className="mb-2 text-break"
                  ref={
                    index === currentChannelMessages.length - 1
                      ? messagesEndRef
                      : null
                  }
                >
                  <b>
                    {msg.username}
                    :
                    {' '}
                  </b>
                  <span>{msg.body}</span>
                </div>
              ))}
            </div>
            <div className="p-5 mt-auto">
              {!isConnected && (
                <div className="alert alert-warning py-2">
                  No network. Connection lost
                </div>
              )}

              {error && <div className="alert alert-danger py-2">{error}</div>}
              <form
                className="d-flex justify-content-between"
                onSubmit={handleSubmit}
              >
                <input
                  ref={inputRef}
                  type="text"
                  className="form-control me-3"
                  placeholder="Enter your message"
                  value={messageText}
                  onChange={(e) => {
                    setMessageText(e.target.value);
                    if (error) setError(null);
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!messageText.trim() || isSending || !isConnected}
                >
                  {isSending ? 'Sending...' : 'Send'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
