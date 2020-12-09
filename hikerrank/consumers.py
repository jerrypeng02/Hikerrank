import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from hikerrank.models import Message, Chat


class ChatConsumer(WebsocketConsumer):

    # 根据前端发过来的数据（即parameter里的data）从数据库里拿出来对应chat instance里的所有messages
    # 把这个messages转化成json发给frontEnd
    def fetch_messages(self, data):
        current_chat = get_object_or_404(Chat, event_id=data['chat_id'])
        messages = Message.objects.filter(id__in=current_chat).order_by('-timestamp').all()[:10]
        content = {
            'command': 'messages',
            'messages': self.messages_to_json(messages)
        }
        # send_message packages content dict into json format and send
        # where send is a method of WebsocketConsumer that send data to frontend
        self.send_message(content)

    #根据从前端发送消息的输入框收集到并且send过来的数据（即parameter里的data）
    #在数据库里建好相应的message instance，把message instance加到对应的chat instance里
    #再把建好的message instance转化成json之后发给channel layer的group
    def new_message(self, data):
        # receive data from frontend as a paramter
        # identify the author of the message, create a message instance in the database
        author_user = get_object_or_404(User, username=data['from'])
        message = Message.objects.create(
            author=author_user,
            content=data['message'])
        # identify the chat instance that the message instance should belong to and added it to chat
        current_chat = get_object_or_404(Chat, event_id=data['chat_id'])
        current_chat.messages.add(message)
        current_chat.save()
        content = {
            'command': 'new_message',
            'message': self.message_to_json(message)
        }
        # 这里的send_chat_message是把新建的message转化成json之后发给channel layer的group
        # 而fetch_messages的send_message是把从数据库中取出来的messages发给frontEnd
        return self.send_chat_message(content)

    # convert a list of messages to a list of json objects
    def messages_to_json(self, messages):
        result = []
        for message in messages:
            result.append(self.message_to_json(message))
        return result

    # convert one message to a json object
    def message_to_json(self, message):
        return {
            'id': message.id,
            'author': message.author.username,
            'content': message.content,
            'timestamp': str(message.timestamp)
        }

    commands = {
        'fetch_messages': fetch_messages,
        'new_message': new_message
    }

    #把这个consumer的channel加到它该在的channel group里
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        # add this consumer's channel to the group that it should belong to
        #(join room group)
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        # Accepts the WebSocket connection.
        self.accept()

    #把这个consummer的channel从它在的channel group里去掉
    def disconnect(self, close_code):
        # remove this consumer's channel from its group
        # (leave the room)
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # 这里receive指的是Receive message from WebSocket
    # consumer从webSocket收到message，就相当于view function从http里收到request
    # 这个method实际上是整个consumer的中枢，它负责根据前端发过来的需求来决定是执行fetch_messages method还是new_message method
    def receive(self, text_data):
        data = json.loads(text_data)
        # data 里的command这个key的value是要执行的method
        # 而我们在55行define了一个叫commands的dict，里面key是method的名字，value就是method自己
        # commands[data['command']]就是call fetch_messages或者new_message 其中一个method
        # fetch_messages是从数据库里拿message的data，把这些data打包成json之后发给frontEnd
        # new
        self.commands[data['command']](self, data)

    #这是在new message中用的那个把新建的message发给channel layer的group的method
    def send_chat_message(self, message):
        async_to_sync(self.channel_layer.group_send)(
            # 这里在向channel layer的group发送这个message时还带了一个叫type的field
            # 这个field的value是其他consumer从group收到这个data之后要call的用来接收并处理这个data的method的名字
            # 这个chat_message method写在最下面119行了
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    #这是在fetch message中用的那个把从数据库中取出来的messages发给前端的method
    def send_message(self, message):
        self.send(text_data=json.dumps(message))

    #最后这个method是负责Receive message from room group之后再把收到的message发给websocket
    def chat_message(self, event):
        message = event['message']
        self.send(text_data=json.dumps(message))
