import { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectMessagesByChannel } from '../store/messagesSlice'

function MessagesList() {
  // const [error, setError] = useState(null);
  const messagesEndRef = useRef(null)
  const currentChannelId = useSelector(state => state.channels.currentChannelId)
  const currentChannelMessages = useSelector(state =>
    selectMessagesByChannel(state, currentChannelId),
  )
  const isFirstScroll = useRef(true)

  useEffect(() => {
    // setError(null);
    isFirstScroll.current = true
  }, [currentChannelId])

  useEffect(() => {
    if (!currentChannelMessages.length) return
    if (messagesEndRef.current && typeof window !== 'undefined') {
      if (isFirstScroll.current) {
        window.requestAnimationFrame(() => {
          messagesEndRef.current.scrollIntoView({ behavior: 'auto' })
          isFirstScroll.current = false
        })
      }
      else {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [currentChannelMessages])

  return (
    <div className="overflow-auto px-5">
      {currentChannelMessages.map((msg, index) => (
        <div
          key={msg.id}
          className="mb-2 text-break"
          ref={index === currentChannelMessages.length - 1 ? messagesEndRef : null}
        >
          <b>
            {msg.username}
            : 
          </b>
          <span>{msg.body}</span>
        </div>
      ))}
    </div>
  )
}

export default MessagesList
