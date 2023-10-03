// stores/chat.js
import { writable } from 'svelte/store';

const chatStore = writable({
  messages: [],
  currentRoom: null,
});

export default chatStore;
