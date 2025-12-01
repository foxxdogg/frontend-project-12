import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { addChannels, channelsSelectors, setCurrentChannel } from '../store/channelsSlice';
import {
  addMessages, addMessage, selectMessagesByChannel,
} from '../store/messagesSlice';
import { logout } from '../store/authSlice';
import socket from '../socket';

const MainPage = () => {
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const channels = useSelector(channelsSelectors.selectAll);
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  const currentChannelMessages = useSelector(
    (state) => selectMessagesByChannel(state, currentChannelId),
  );
  const currentChannel = channels.find((channel) => channel.id === currentChannelId);
  const currentChannelName = currentChannel ? currentChannel.name : '';
  const currentUserName = useSelector(
    (state) => (state.auth.user ? state.auth.user.username : ''),
  );
  const isFirstScroll = useRef(true);

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
      setError('Проблемы с сетью. Сообщение не отправлено.');
      console.log(e);
    } finally {
      setIsSending(false);
    }
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

    socket.on('newMessage', handleNewMessage);

    // eslint-disable-next-line consistent-return
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [token, navigate, dispatch]);

  useEffect(() => {
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

  return (
    <div className="d-flex flex-column h-100 bg-light">
      <div className="navbar bg-white">
        <div className="container">
          <span className="navbar-brand">YouChat</span>
          <button type="button" className="btn btn-primary" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div className="container h-100 my-4 rounded shadow bg-white overflow-hidden">
        <div className="row h-100">
          <div className="col-4 bg-light flex-column border-end">
            <div className="d-flex align-items-center justify-content-between p-4 mb-4">
              <b>Channels</b>
              <button type="button" className="btn btn-primary">Add</button>
            </div>
            <div>
              <ul className="nav nav-pills flex-column align-items-center ps-4 pe-4 w-100">
                {channels.map((channel) => (
                  <li className="nav-item w-100" key={channel.id}>
                    <button
                      type="button"
                      className={`btn w-100 rounded-0 text-start ${channel.id === currentChannelId ? 'btn-secondary' : 'btn-light'}`}
                      onClick={() => dispatch(setCurrentChannel(channel.id))}
                    >
                      #
                      {channel.name}
                    </button>
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
                <div key={msg.id} className="mb-2 text-break" ref={index === currentChannelMessages.length - 1 ? messagesEndRef : null}>
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
                  Нет сети. Подключение потеряно.
                </div>
              )}

              {error && (
              <div className="alert alert-danger py-2">
                {error}
              </div>
              )}
              <form className="d-flex justify-content-between" onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="form-control me-3"
                  placeholder="Enter your message"
                  value={messageText}
                  onChange={(e) => {
                    setMessageText(e.target.value);
                    if (error) setError(null);
                  }}
                />
                <button type="submit" className="btn btn-primary" disabled={!messageText.trim() || isSending || !isConnected}>{isSending ? 'Sending...' : 'Send'}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
