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

// Function to send a new message
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
    <!-- Enter Name Section -->
    <div class="input-box">
      <Input bind:value="{senderName}" placeholder=" Enter Your Name" />
      <Button style='background-color:purple' on:click="{enterChat}">Join</Button>
    </div>
  {:else}
    <!-- Chat Container -->
    <div class="chat-container">
      <!-- User List -->
      <div class="user-list">
        <h3>Online Users:</h3>
        {#each onlineUsers as user}
          <p class="user">{user}</p>
        {/each}
      </div>

      <!-- Chat Box -->
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

        <!-- New Message Input Box -->
        <div class="input-box">
          <Input type="text" bind:value="{newMessage}" placeholder="Type your message here..." on:keyup="{(e) => e.key === 'Enter' && handleSubmit()}" />
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

\<style>
  /* Reset some default styles */
  body {
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
  }

  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  /* Chat App Container */
  .chat-app {
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    padding: 20px;
  }

  h1 {
    text-align: center;
    color: #007bff;
    margin-bottom: 20px;
  }

  /* Join Section */
  .join-section {
    display: flex;
    align-items: center;
  }

  .join-button {
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    margin-left: 10px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .join-button:hover {
    background-color: #0056b3;
  }

  /* Chat Container */
  .chat-container {
    display: flex;
  }

  /* User List */
  .user-list {
    width: 200px;
    padding-right: 20px;
    border-right: 1px solid #ccc;
  }

  .user-list h3 {
    color: #007bff;
    margin: 0;
    margin-bottom: 10px;
  }

  .user {
    margin: 0;
    margin-bottom: 5px;
    color: #007bff;
    font-weight: bold;
  }

  /* Chat Box */
  .chat-box {
    flex: 1;
    padding-left: 20px;
    overflow-y: auto;
  }

  /* Message Styling */
  .message {
    background-color: #f5f5f5;
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 10px;
  }

  .message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .message-sender {
    color: #007bff;
    font-weight: bold;
    margin: 0;
  }

  .message-timestamp {
    color: #888;
    font-size: 12px;
  }

  .message-content {
    margin-top: 5px;
    margin-bottom: 5px;
  }

  /* Input Box Styling */
  .input-box {
    display: flex;
    align-items: center;
  }

  .input-box input[type="text"] {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    outline: none;
  }

  .send-button {
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    margin-left: 10px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .send-button:hover {
    background-color: #0056b3;
  }

  /* Modal Styling */
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
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 400px;
  }

  .error-message {
    color: red;
    font-weight: bold;
  }

  .modal-close-btn {
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    margin-top: 10px;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
  }

  .modal-close-btn:hover {
    background-color: #0056b3;
  }
</style>