class WebSocketService {
  static instance = null;
  callbacks = {};

  // 保证有这个class instance有一个instance（这里instance是一个class static variable的名字）
  // 如果目前没有就建一个
  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  constructor() {
    this.socketRef = null;
  }

  connect(chat_id) {

    // 用目前chat room的path建一个WebSocket的instance，并把它作为这个class instance的static variable instance
    const path = "ws://" + window.location.hostname+":"+window.location.port+ "/ws/chat/"+chat_id+"/";

    this.socketRef = new WebSocket(path);

    //下面这几个method就是负责在这个webScoket instance干每件事时在console print出对应的信息，没什么用
    this.socketRef.onopen = () => {
      console.log("WebSocket open");
    };
    this.socketNewMessage(JSON.stringify({
      command: 'fetch_messages'
    }));
    this.socketRef.onmessage = e => {
      this.socketNewMessage(e.data);
    };
    this.socketRef.onerror = e => {
      console.log(e.message);
    };
    this.socketRef.onclose = () => {
      console.log("WebSocket closed let's reopen");
      this.connect();
    };
  }

  socketNewMessage(data) {
    const parsedData = JSON.parse(data);
    const command = parsedData.command;
    if (Object.keys(this.callbacks).length === 0) {
      return;
    }
    if (command === "messages") {
      this.callbacks[command](parsedData.messages);
    }
    if (command === "new_message") {
      this.callbacks[command](parsedData.message);
    }
  }

  fetchMessages(username, chat_id) {
    this.sendMessage({
      command: "fetch_messages",
      username: username,
      chat_id: chat_id
    });
  }

  newChatMessage(message) {
    this.sendMessage({
      command: "new_message",
      from: message.from,
      message: message.content,
      chat_id: message.chat_id
    });
  }

  //messagesCallback, newMessageCallback只是parameter
  addCallbacks(messagesCallback, newMessageCallback) {
    this.callbacks["messages"] = messagesCallback;
    this.callbacks["new_message"] = newMessageCallback;
  }

  sendMessage(data) {
    try {
      this.socketRef.send(JSON.stringify({ ...data }));
    } catch (err) {
      console.log(err.message);
    }
  }

  //用来在chat.js里的waitForSocketConnection method里check一个WebSocketInstance的state的
  state() {
    return this.socketRef.readyState;
  }
}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;
