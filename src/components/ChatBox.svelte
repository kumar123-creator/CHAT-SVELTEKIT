<script>
	import { onMount } from 'svelte';
	import { initializeApp } from 'firebase/app';
	import { getDatabase, ref, push, onValue } from 'firebase/database';
  import 'flowbite/dist/flowbite.css';
  import { Input, Button, Modal } from 'flowbite-svelte';
	
	// Firebase configuration (replace with your own values)
	const firebaseConfig = {
	  apiKey: 'AIzaSyCKmOylWL1JPX8SRtShn2Cx1QaqmcDERaM',
	  databaseURL: 'https://chat-app-dd642-default-rtdb.firebaseio.com',
	  projectId: 'chat-app-dd642',
	};
	
	// Initialize Firebase
	const firebaseApp = initializeApp(firebaseConfig);
  const db = getDatabase(firebaseApp);
	const messagesRef = ref(db, 'messages');
	const onlineUsersRef = ref(db, 'onlineUsers');
	let messages = [];
	let newMessage = '';
	let senderName = ''; // Variable to store the sender's name
  let messageContent = ''; // Variable to store the message content
	let hasEnteredName = false; // Flag to track whether the user has entered their name
  let onlineUsers = []; // Array to store the names of online users
  let showModal = false;
  let errorMessage = ''; // Variable to store the error message


onMount(() => {
  // Check for a user session in localStorage
  const storedSenderName = localStorage.getItem('senderName');
  if (storedSenderName) {
    senderName = storedSenderName;
    hasEnteredName = true;
    // Fetch the chat messages and online users from localStorage if needed
    // Example: messages = JSON.parse(localStorage.getItem('messages')) || [];
    // Example: onlineUsers = JSON.parse(localStorage.getItem('onlineUsers')) || [];
  } else {
    // User has not joined the chat, so they should see the join chat screen
    hasEnteredName = false;
  }
  });

  
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

// Function to format the timestamp based on whether it's the same day or different day
function formatTimestamp(timestamp) {
  const messageDate = new Date(timestamp);
  const today = new Date();

  if (
    messageDate.getDate() === today.getDate() &&
    messageDate.getMonth() === today.getMonth() &&
    messageDate.getFullYear() === today.getFullYear()
  ) {
    // If the message was sent today, display only the time
    return messageDate.toLocaleTimeString();
  } else {
    // If the message was sent on a different day, display the date and time
    return messageDate.toLocaleString();
  }
}


onMount(() => {
	  onValue(messagesRef, (snapshot) => {
		messages = Object.values(snapshot.val() || {});
	  });
  
	  onValue(onlineUsersRef, (snapshot) => {
		onlineUsers = Object.values(snapshot.val() || {});
		
	  });
	});
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

 
  const enterChat = () => {
    if (senderName.trim().length >= 5) {
      const userExists = onlineUsers.some((user) => user.senderName === senderName);
      if (!userExists) {
        push(onlineUsersRef, { senderName }).then(() => {
          hasEnteredName = true; // Set the flag to indicate the user joined the chat
          // Save the user's name in local storage
          localStorage.setItem('senderName', senderName);
        });
      } else {
        hasEnteredName = true; // Set the flag to indicate the user joined the chat
        console.log("User already exists");
        // Save the user's name in local storage
        localStorage.setItem('senderName', senderName);
      }
    } else {
      errorMessage = "Name should have at least 5 characters"; // Set the error message
    }
  }


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
  <div class="card">
    <h2>WELCOME TO CHAT APP</h2>
    <div class="input-box">
      <Input bind:value="{senderName}" placeholder="Enter Your Name" />
      <Button style='background-color:purple' on:click="{enterChat}">Join</Button>
    </div>
    {#if errorMessage}
      <p class="error-message">{errorMessage}</p> <!-- Display the error message -->
    {/if}
  </div>
  {:else}
  <div class="top-right">
    <Button style='background-color:red; color:white;' on:click="{leaveChat}">Logout</Button>
  </div>
  <div class="chat-container">
    <div class="online-users">
      <h3>Online Users:</h3>
      <ul>
        {#each onlineUsers as user (user.senderName)}
          <li class="online-user">
            <i class="fas fa-user"></i> {user.senderName}
          </li>
        {/each}
      </ul>
  
    </div>

    <div class="chat-box">
      {#each messages as message}
      <div class="message {message.senderName === senderName ? 'sent' : 'received'}">
          <p class="message-sender">{message.senderName}:</p>
          <p class="message-content">{message.messageContent}</p>
          <div class="message-timestamp">
            ({formatTimestamp(message.timestamp)})
          </div>
          
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
  .card {
    max-width: 800px;
    margin: 0 auto;
    margin-top: 200px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    padding: 20px;
    text-align: center;
  }

  .card h2 {
    margin-top: 0;
    color: darkblue;
    font-size: larger;
    font-style: italic;
    font-weight: bold;
  }

    .message.sent {
    align-self: flex-end;
    background-color: lightgreen; 
  }

  .message.received {
    align-self: flex-start;
    background-color: lightgoldenrodyellow; 
  }
  .top-right {
  position: absolute;
  top: 0px;
  right: 10px;
}
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

  .online-users {
    min-width: 250px;
    max-width: 250px;
    background-color: #075e54;
    color: white;
    overflow-y: auto;
    padding: 20px;
  }

  .online-users h3 {
    margin: 0;
    margin-bottom: 10px;
    font-size: 18px;
  }

  .online-users ul {
    list-style-type: none;
    padding: 0;
  }

  .online-user {
    margin: 0;
    margin-bottom: 5px;
    font-size: 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .online-user i {
    margin-right: 8px;
    font-size: 16px;
  }

  .online-user:hover {
    background-color: #128c7e; /* Change background color on hover */
  }
  .chat-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px;
    background-color: #f0f0f0;
    overflow-y: auto;
    max-width: 80%; /* Increase the max-width to your desired width (e.g., 80%) */
    margin: 0 auto; /* Center the chatbox horizontally */
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
</style>
