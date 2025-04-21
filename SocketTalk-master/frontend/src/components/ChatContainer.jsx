  import { useChatStore } from "../store/useChatStore";
  import { useEffect ,useRef} from "react";

  import ChatHeader from "./ChatHeader";
  import MessageInput from "./MessageInput";
  import MessageSkeleton from "./skeletons/MessageSkeleton";
  import { useAuthStore } from "../store/useAuthStore";
  import { formatMessageTime } from "../lib/utils";

  const ChatContainer = () => {
    const {
      messages,
      getMessages,
      isMessagesLoading,
      selectedUser,
      subscribeToMessages,
      unsubscribeFromMessages,
    } = useChatStore();

  const {authUser}=useAuthStore();
  const messageEndRef = useRef(null);


    useEffect(() => {
      getMessages(selectedUser._id);
      subscribeToMessages();
      return()=> unsubscribeFromMessages()
    }, [selectedUser._id, getMessages,subscribeToMessages,
      unsubscribeFromMessages]);
    
      //WHEN EVER ANY CHANGE IN MESSAGE NEW MESSAGE SEND OR RECIREVE THEN SCOLL VIEW SMOOTH
      useEffect(() => {
        if (messageEndRef.current && messages) {
          messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, [messages]);

    //skeleton while loading
    if (isMessagesLoading) {
      return (
        <div className="flex-1 flex flex-col overflow-auto">
          <ChatHeader />
          <MessageSkeleton />
          <MessageInput />
        </div>
      );
    }


      return (
        <div className="flex-1 flex flex-col overflow-auto">
          {/*----------------- chat header ------------*/}
          <ChatHeader />

        {/*------------- chat message ---------- */}
          {/* mapping over each message and making it in a div , with class dynamic to the person , in dasiy ui when message send 
          is the authuser then the class will be "chat-end" else if it is anyother user then the  class  is "chat-start  " */}
  <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              ref={messageEndRef}
            >
              <div className=" chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                {/* formatting the time through utility function  */}
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          ))}
        </div>

  {/*-------------------- message input field----------------- */}
          <MessageInput />
        </div>
      );

  };
  export default ChatContainer;