<script>
	import { onMount } from 'svelte';
	import { initializeApp } from 'firebase/app';
	import { getDatabase, ref, push, onValue } from 'firebase/database';
  import 'flowbite/dist/flowbite.css';
  import { Input, Button, Modal } from 'flowbite-svelte';
	import ChatBox from '../components/ChatBox.svelte';
  import UserInput from '../components/UserInput.svelte';
  import OnlineUsersList from '../components/OnlineUsersList.svelte';
	
	
	// Firebase configuration (replace with your own values)
	const firebaseConfig = {
	  apiKey: 'AIzaSyCKmOylWL1JPX8SRtShn2Cx1QaqmcDERaM',
	  databaseURL: 'https://chat-app-dd642-default-rtdb.firebaseio.com',
	  projectId: 'chat-app-dd642',
	};
	
	// Initialize Firebase
	const firebaseApp = initializeApp(firebaseConfig);
	let messages = [];
	let newMessage = '';
	let senderName = ''; // Variable to store the sender's name
    let messageContent = ''; // Variable to store the message content
	let hasEnteredName = false; // Flag to track whether the user has entered their name
    let onlineUsers = []; // Array to store the names of online users
    let showModal = false;

	// Function to close the modal
	const closeModal = () => {
    showModal = false;
  };

  const sendMessage = () => {
  if (senderName.trim() === '') {
    // Prevent sending messages without a sender name
    return;
  }

  // Trim the message content to remove leading and trailing spaces
  messageContent = messageContent.trim();

  if (messageContent === '') {
    // Prevent sending empty messages
    return;
  }

  // Define the maximum allowed message content length (adjust as needed)
  const maxMessageLength = 2;
  if (messageContent.length > maxMessageLength) {
    // Prevent sending excessively long messages
    // Show the modal with the error message
    showModal = true;
    return;
  }

  const database = getDatabase();
  const newMessageRef = push(ref(database, 'messages'), {
    senderName,
    messageContent,
    timestamp: Date.now(),
  });

  // Add the new message to the local messages array
  messages = [...messages, {
    senderName,
    messageContent,
    timestamp: Date.now(),
  }];

  messageContent = ''; // Clear the message content after sending
};

  // Function to show a notification
  const showNotification = (message) => {
    if (!('Notification' in window)) {
      console.log('Notifications not supported by your browser.');
      return;
    }

    // Request permission to show notifications (required by some browsers)
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        const notification = new Notification('New Message', {
          body: `${message.senderName}: ${message.messageContent}`,
        });
        notification.onclick = () => {
          // Handle the click event if the user clicks on the notification
          // For example, you can redirect the user to the chat window or bring it to focus.
        };
      }
    });
  };

  // Function to handle incoming messages
  const handleIncomingMessages = () => {
    const database = getDatabase();
    onValue(ref(database, 'messages'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        messages = Object.keys(data).map((key) => data[key]);

        // Filter out messages with undefined sender names or message content
        messages = messages.filter((message) => message.senderName && message.messageContent);

        // Check if the user is actively viewing the chat
        const isUserViewingChat = document.hasFocus();
        
        // Show a notification only if the user is not actively viewing the chat
        if (!isUserViewingChat) {
          // Get the latest message
          const latestMessage = messages[messages.length - 1];
          showNotification(latestMessage);
        }
      }
    });
  };
  onMount(() => {
    handleIncomingMessages();
  });

  // Function to handle the user submitting their name
  const enterChat = () => {
    if (senderName.trim() !== '') {
      hasEnteredName = true;
      onlineUsers = [...onlineUsers, senderName]; // Add the user to the online users list
    }
  };

   // Function to handle the user leaving the chat
   const leaveChat = () => {
    hasEnteredName = false;
    onlineUsers = onlineUsers.filter((user) => user !== senderName); // Remove the user from the online users list
  };

   // Function to handle the user sending a new message
   const handleSubmit = () => {
    if (newMessage.trim() !== '') {
      const database = getDatabase();
      const newMessageRef = push(ref(database, 'messages'), {
        senderName: senderName, // Use the senderName from the existing code
        messageContent: newMessage, // Use the newMessage variable
        timestamp: Date.now(),
      });

      newMessage = ''; // Clear the input box after sending the message
    }
  };
  
</script>


<main>
  <h1>CHAT-APP</h1>

  {#if !hasEnteredName}
    <div class="input-box">
      <Input bind:value="{senderName}" placeholder=" Enter Your Name" />
      <Button style='background-color:purple' on:click="{enterChat}">Join</Button>
    </div>
  {:else}
  <div class="chat-container">
    <div class="user-list">
      <h3>Online Users:</h3>
      {#each onlineUsers as user}
        <p class="user">{user}</p>
      {/each}
    </div>

    <div class="chat-box">
      {#each messages as message}
        <div class="message">
          <p class="message-sender">{message.senderName}:</p>
          <p class="message-content">{message.messageContent}</p>
          <p class="message-timestamp">
            ({new Date(message.timestamp).toLocaleTimeString()})
          </p>
        </div>
      {/each}

      <div class="input-box">
        <Input
          type="text"
          bind:value="{newMessage}"
          placeholder="Type your message here..."
          on:keyup="{(e) => e.key === 'Enter' && handleSubmit()}"
        />
        <Button style='background-color:blue' on:click="{handleSubmit}">Send</Button>
      </div>
    </div>
  </div>
  {/if}

  {#if showModal}
    <!-- Replace modal content -->
    <Modal on:close="{closeModal}">
      <div slot="header">Error</div>
      <div slot="body" class="modal-content">
        <p class="error-message">
          {#if senderName.trim() === ''}
            Please enter your name.
          {:else}
            {#if messageContent.trim() === ''}
              Please enter a message.
            {:else}
              Message exceeds the maximum length.
            {/if}
          {/if}
        </p>
        <Button slot="footer" class="modal-close-btn" on:click="{closeModal}">OK</Button>
      </div>
    </Modal>
  {/if}
</main>

<style>
  main {
    max-width: 100%;
    margin: 0;
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  h1 {
    text-align: center;
    margin: 0;
    padding: 10px;
    background-color: #075e54;
    color: white;
  }

  .chat-container {
    flex: 1;
    display: flex;
    background-color: #f0f0f0;
  }

  .user-list {
    padding: 20px;
    min-width: 250px;
    max-width: 250px;
    background-color: #075e54;
    color: white;
    overflow-y: auto;
  }

  .user-list h3 {
    margin: 0;
    margin-bottom: 10px;
    font-size: 18px;
  }

  .user-list .user {
    margin: 0;
    margin-bottom: 5px;
    font-size: 16px;
  }

  .chat-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px;
    background-color: #f0f0f0;
    overflow-y: auto;
  }

  .message {
    max-width: 70%;
    margin-bottom: 20px;
    padding: 10px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .message p {
    margin: 0;
    font-size: 16px;
  }

  .message-sender {
    color: #075e54;
    font-weight: bold;
  }

  .message-content {
    margin-top: 5px;
  }

  .message-timestamp {
    color: #888;
    font-size: 12px;
  }

  .input-box {
    display: flex;
    align-items: center;
    background-color: #fff;
    border-top: 1px solid #ccc;
    padding: 10px;
  }

  .input-box input[type="text"] {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 0;
    font-size: 16px;
  }

  .input-box button {
    padding: 10px 20px;
    border: none;
    background-color: #075e54;
    color: white;
    cursor: pointer;
    font-size: 16px;
  }

  .input-box button:hover {
    background-color: #128c7e;
  }

  /* Style for the modal (you can adjust this as needed) */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  .modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    max-width: 400px;
  }

  .error-message {
    color: red;
    font-weight: bold;
  }

  .modal-close-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    background-color: #075e54;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
    margin-top: 10px;
  }

  .modal-close-btn:hover {
    background-color: #128c7e;
  }
</style>
