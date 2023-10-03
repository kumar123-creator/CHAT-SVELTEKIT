<script>
  export let onlineUsers;
</script>

<div class="user-list">
  <h3>Online Users:</h3>
  {#each onlineUsers as user}
  <p class="user">{user}</p>
  {/each}
</div>
  
  <style>
.user-list {
    text-align: center;
    margin-bottom: 20px;
  }

  .user {
    margin-bottom: 5px;
    color: #007bff;
    font-weight: bold;
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
  .user-list {
    padding: 10px;
    border-right: 1px solid #ccc;
    width: 200px;
  }

  .user-list h3 {
    margin: 0;
    margin-bottom: 10px;
    color: purple;
  }

  .user-list .user {
    margin: 0;
    margin-bottom: 5px;
    color: #007bff;
    font-weight: bold;
  }

  
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }


  </style>
  
  

  