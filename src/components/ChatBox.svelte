<script>
  export let messages;
  let newMessage;
</script>

<div class="chat-box">
  {#each messages as message (message.timestamp)}
    <div class="message">
      <p class="message-sender">{message.senderName}:</p>
      <p class="message-content">{message.messageContent}</p>
      <p class="message-timestamp">
        ({new Date(message.timestamp).toLocaleTimeString()})
      </p>
    </div>
  {/each}
</div>
<style>

	.message {
	  margin-bottom: 8px;
	  padding: 8px;
	  border-radius: 4px;
	  background-color: #fff;
	  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}
	
  
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
  


  :global(body) {
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
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


  

  

  .chat-box {
    display: flex;
    flex-direction: column;
    padding: 10px;
    flex: 1;
    max-height: calc(100vh - 200px); /* Adjust this value to leave space for the user-list and input-box */
    overflow-y: auto;
  }

  .message {
    background-color: #f5f5f5;
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 10px;
    animation: fade-in 0.3s;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .message p {
    margin: 0;
  }

  .message-sender {
    color: #007bff;
    font-weight: bold;
  }

  .message-content {
    margin-top: 5px;
  }

  .message-timestamp {
    color: #888;
    font-size: 12px;
  }

</style>


  
