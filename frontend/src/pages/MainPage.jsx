import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { addChannels, channelsSelectors, setCurrentChannel } from '../store/channelsSlice';
import { addMessages, messagesSelectors } from '../store/messagesSlice';
import { logout } from '../store/authSlice';

const MainPage = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const channels = useSelector(channelsSelectors.selectAll);
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  const currentChannelMessages = useSelector((state) => messagesSelectors.selectAll(state).filter(
    (message) => message.channelId === currentChannelId,
  ));

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
      } catch (error) {
        console.log(error);
      }
    };

    fetchData('/api/v1/channels', addChannels);
    fetchData('/api/v1/messages', addMessages);
  }, [token, navigate, dispatch]);

  return (
    <div className="d-flex flex-column h-100 bg-light">
      <div className="navbar bg-white">
        <div className="container">
          <span className="navbar-brand">YouChat</span>
          <button type="button" className="btn btn-primary" onClick={() => dispatch(logout())}>Logout</button>
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
                <span># </span>
                Random
              </b>
              <p className="text-muted m-0">0 messages</p>
            </div>
            <div className="overflow-auto px-5">
              {currentChannelMessages.map((msg) => (
                <div key={msg.id} className="mb-2 text-break">
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
              <form className="d-flex justify-content-between">
                <input type="text" className="form-control me-3" placeholder="Enter your message" />
                <button type="submit" className="btn btn-primary">Send</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
