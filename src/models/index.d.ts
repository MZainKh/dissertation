import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type ChatMessagesMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ChatRoomsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UsersMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ChatRoomsUsersMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class ChatMessages {
  readonly id: string;
  readonly content: string;
  readonly usersID: string;
  readonly chatRoomsID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<ChatMessages, ChatMessagesMetaData>);
  static copyOf(source: ChatMessages, mutator: (draft: MutableModel<ChatMessages, ChatMessagesMetaData>) => MutableModel<ChatMessages, ChatMessagesMetaData> | void): ChatMessages;
}

export declare class ChatRooms {
  readonly id: string;
  readonly newMessages?: number | null;
  readonly lastMessage?: ChatMessages | null;
  readonly chatMessages?: (ChatMessages | null)[] | null;
  readonly chatUsers?: (ChatRoomsUsers | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly chatRoomsLastMessageId?: string | null;
  constructor(init: ModelInit<ChatRooms, ChatRoomsMetaData>);
  static copyOf(source: ChatRooms, mutator: (draft: MutableModel<ChatRooms, ChatRoomsMetaData>) => MutableModel<ChatRooms, ChatRoomsMetaData> | void): ChatRooms;
}

export declare class Users {
  readonly id: string;
  readonly name: string;
  readonly imageUri?: string | null;
  readonly status?: string | null;
  readonly chatMessages?: (ChatMessages | null)[] | null;
  readonly chatRooms?: (ChatRoomsUsers | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Users, UsersMetaData>);
  static copyOf(source: Users, mutator: (draft: MutableModel<Users, UsersMetaData>) => MutableModel<Users, UsersMetaData> | void): Users;
}

export declare class ChatRoomsUsers {
  readonly id: string;
  readonly chatRooms: ChatRooms;
  readonly users: Users;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<ChatRoomsUsers, ChatRoomsUsersMetaData>);
  static copyOf(source: ChatRoomsUsers, mutator: (draft: MutableModel<ChatRoomsUsers, ChatRoomsUsersMetaData>) => MutableModel<ChatRoomsUsers, ChatRoomsUsersMetaData> | void): ChatRoomsUsers;
}