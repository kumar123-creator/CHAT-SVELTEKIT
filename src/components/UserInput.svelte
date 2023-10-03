<script>
  export let newMessage;
  export let senderName;

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

<div class="input-box">
  <input type="text" bind:value="{newMessage}" placeholder="Type your message here..." on:keyup="{(e) => e.key === 'Enter' && handleSubmit()}" />
  <button on:click="{handleSubmit}">Send</button>
</div>

<style>  
	input[type="text"] {
	  flex: 1;
	  padding: 10px;
	  border: 1px solid #ccc;
	  border-radius: 4px;
	  margin-right: 8px;
	}
  
	button {
	  padding: 10px 16px;
	  border: none;
	  border-radius: 4px;
	  background-color: #007bff;
	  color: #fff;
	  cursor: pointer;
	  transition: background-color 0.2s ease-in-out;
	}
  
	button:hover {
	  background-color: #0056b3;
	}
	


  :global(body) {
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
  }


  .input-box {
    display: flex;
    margin-bottom: 20px;
    animation: slide-up 0.3s;
  }

  @keyframes slide-up {
    from {
      transform: translateY(50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .input-box input[type="text"] {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    outline: none;
  }

  .input-box button {
    padding: 10px 20px;
    border: none;
    background-color: #007bff;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
  }

  

  
  .input-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
  }

  .input-box input[type="text"] {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    outline: none;
  }

  .input-box button {
    padding: 10px 20px;
    border: none;
    background-color: green; /* Adjust the background color as needed */
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
  }

  .input-box button:hover {
    background-color: #0056b3;
  }
  
</style>

