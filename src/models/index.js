// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const MessageStatus = {
  "SENT": "SENT",
  "DELIVERED": "DELIVERED",
  "READ": "READ"
};

const { Message, User, ChatRoom, ChatRoomUser } = initSchema(schema);

export {
  Message,
  User,
  ChatRoom,
  ChatRoomUser,
  MessageStatus
};