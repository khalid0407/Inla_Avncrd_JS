export const mockMessages = [
  {
    id: '1',
    text: 'Hello! How can I help you today?',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    isUser: false,
    username: 'SupportBot',
  },
  {
    id: '2',
    text: 'Hi! I have a question about my account.',
    createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    isUser: true,
    username: 'You',
  },
  {
    id: '3',
    text: 'Of course! Please provide more details.',
    createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    isUser: false,
    username: 'SupportBot',
  },
  {
    id: '4',
    text: 'I cannot log in to my account.',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    isUser: true,
    username: 'You',
  },
  {
    id: '5',
    text: 'Let me check that for you.',
    createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    isUser: false,
    username: 'SupportBot',
  },
];