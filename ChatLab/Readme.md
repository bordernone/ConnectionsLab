# ChatLab

A real-time group chat app using socket.io and NodeJs.

### Features
1. Real-time chat using socket.io
2. Mobile friendly design
3. Added auto-scroll feature to automatically scroll to the bottom when a new message is received or sent
4. Minimalist Facebook-like chat interface

### Challenges
1. Layout was the main challenge for me. 
   1. I wanted the interface to look similar to Facebook chat but not very detailed. 
   2. Used CSS flex along with other properties to separate the user's own messages from other users' messages
2. Scroll: I wanted to remove the scrollbar but still allow users to scroll. I read online that I can do it by setting certain browser-specific properties of the scrollbar. 

        .chat-body {
            flex-grow: 1;
            flex: 1;
            overflow-y: scroll;
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        .chat-body::-webkit-scrollbar {
            display: none;
        }
