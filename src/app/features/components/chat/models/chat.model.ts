

export interface Message {
  id: number;
  issuer: string;
  recipient: string;
  content: string;
  date: string;
  time: string;
  status: string;
}

export interface Conversation {
  userId: number;
  username: string;
  image: string;
  lastMessageContent?: string;
  lastMessageDate?: string;
}
