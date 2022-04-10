// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { ChatMessages, ChatRooms, Users, ChatRoomsUsers } = initSchema(schema);

export {
  ChatMessages,
  ChatRooms,
  Users,
  ChatRoomsUsers
};