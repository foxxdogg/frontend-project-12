import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import leoProfanity from 'leo-profanity';
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
import socket from '../socket';
import AddChannelModal from '../components/AddChannelModal';
import RenameChannelModal from '../components/RenameChannelModal';
import RemoveChannelModal from '../components/RemoveChannelModal';
import Header from '../components/Header';
import MessagesList from '../components/MessagesList';
import useLogout from '../hooks/useLogout';

leoProfanity.loadDictionary('en');
leoProfanity.loadDictionary('ru');

const MainPage = () => {
  const { t } = useTranslation();

  const [messageText, setMessageText] = useState('');
  const [messageError, setMessageError] = useState(null);

  const [error, setError] = useState(null);

  const [isConnected, setIsConnected] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const [modals, setModals] = useState({
    add: false,
    rename: false,
    remove: false,
  });
  const closeModal = (type) => {
    setModals((prev) => ({ ...prev, [type]: false }));
  };
  const openModal = (type) => {
    setModals((prev) => ({ ...prev, [type]: true }));
  };

  const [isRemoving, setIsRemoving] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [channelToDeleteId, setChannelToDeleteId] = useState(null);
  const [channelToRenameName, setChannelToRenameName] = useState(null);
  const [channelToRenameId, setChannelToRenameId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [removeError, setRemoveError] = useState(null);

  const activeChannelRef = useRef(null);
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

  useEffect(() => {
    if (!currentUser || !token) {
      navigate('/login', { replace: true });
    }
  }, [currentUser, token, navigate]);

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

  const handleLogout = useLogout();

  const sendMessage = async () => {
    if (!messageText.trim()) return;
    setMessageError(null);
    setIsSending(true);
    const cleanMessage = leoProfanity.clean(messageText);
    const newMessage = {
      body: cleanMessage,
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
      setMessageError(null);
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      toast.error(t('notSent'));
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
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
      setError(null);
    };
    const handleDisconnect = () => {
      setIsConnected(false);
      toast.error(t('connectionError'));
      // setError(null);
    };
    const handleConnectError = () => {
      setIsConnected(false);
      toast.error(t('connectionError'));
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
    };
  }, [t]);

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
      // eslint-disable-next-line no-unused-vars
      } catch (e) {
        toast.error(t('serverError'));
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
  }, [token, navigate, dispatch, t]);

  useEffect(() => {
    if (activeChannelRef.current && typeof window !== 'undefined') {
      activeChannelRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [channels]);

  return (
    <div className="d-flex flex-column h-100 bg-light">
      {modals.add && (
        <AddChannelModal
          handleAdd={async (name) => {
            try {
              setIsAdding(true);
              const cleanName = leoProfanity.clean(name).trim();
              const newChannel = await addNewChannel(cleanName);
              dispatch(addChannel(newChannel));
              dispatch(setCurrentChannel(newChannel.id));
              toast.success(t('addChannelSuccess'));
              closeModal('add');
            } finally {
              setIsAdding(false);
            }
          }}
          onClose={() => {
            closeModal('add');
          }}
          channels={channels}
          error={error}
          isSubmitting={isAdding}
        />
      )}

      {modals.rename && (
        <RenameChannelModal
          handleRename={async (name) => {
            try {
              setIsRenaming(true);
              const cleanName = leoProfanity.clean(name);
              const editedChannel = { name: cleanName };
              const response = await axios.patch(`/api/v1/channels/${channelToRenameId}`, editedChannel, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              dispatch(updateChannel({
                id: response.data.id,
                changes: { name: response.data.name },
              }));
              toast.success(t('renameChannelSuccess'));
              closeModal('rename');
              setChannelToRenameId(null);
              return response.data;
            } finally {
              setIsRenaming(false);
            }
          }}
          onClose={() => {
            closeModal('rename');
            setChannelToRenameId(null);
            setChannelToRenameName(null);
          }}
          channels={channels}
          placeholder={t('renameChannelPlaceholder')}
          channelName={channelToRenameName}
          isSubmitting={isRenaming}
        />
      )}

      {modals.remove && (
        <RemoveChannelModal
          isSubmitting={isRemoving}
          error={removeError}
          onClose={() => {
            closeModal('remove');
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
              toast.success(t('removeChannelSuccess'));
              setChannelToDeleteId(null);
              closeModal('remove');
            } catch (e) {
              console.log(e);
              setRemoveError(t('removeChannelFailure'));
            } finally {
              setIsRemoving(false);
            }
          }}
        />
      )}

      <Header handleLogout={handleLogout} />
      <div className="container h-100 my-4 rounded shadow bg-white overflow-hidden">
        <div className="row h-100">
          <div className="col-4 d-flex bg-light flex-column border-end h-100 pb-5">
            <div className="d-flex align-items-center justify-content-between p-4 mb-4">
              <b>{t('channels')}</b>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => openModal('add')}
              >
                {t('add')}
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
                          <span className="visually-hidden">{t('channelsControl')}</span>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() => {
                                setChannelToDeleteId(channel.id);
                                openModal('remove');
                              }}
                            >
                              {t('delete')}
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() => {
                                setChannelToRenameName(channel.name);
                                setChannelToRenameId(channel.id);
                                openModal('rename');
                              }}
                            >
                              {t('rename')}
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
                {t('messages', { count: currentChannelMessages.length })}
              </p>
            </div>
            <MessagesList />
            <div className="p-5 mt-auto">
              {!isConnected && (
                <div className="alert alert-warning py-2">
                  {t('connectionError')}
                </div>
              )}

              {messageError && <div className="alert alert-danger py-2">{messageError}</div>}
              <form
                className="d-flex justify-content-between"
                onSubmit={handleSubmit}
              >
                <input
                  ref={inputRef}
                  type="text"
                  className="form-control me-3"
                  placeholder={t('enterMessagePlaceholder')}
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
                  {isSending ? t('sending') : t('send')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default MainPage;
