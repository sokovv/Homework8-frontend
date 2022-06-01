import Chat from './Chat';

const chat = new Chat(document.querySelector('.chat'), 'ws://localhost:7070/ws');

chat.init();
