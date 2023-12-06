<script lang="ts">
  export let isLoggined: boolean
  export let userName: string
</script>

<nav class="navbar">
  <div class="nav-container">
    <div>
      <a href="/">
        <h1 class="title">
          <img src="/favicon.png" alt="Logo" class="logo" />
          KeysBoard
        </h1>
      </a>
    </div>
    <div class="nav-buttons">
      {#if isLoggined}
        <p>
          Welcome, {userName}
          <a href="/settings">
            (change)
          </a>
        </p>
        <a href="/logout">
          logout
        </a>
        <a href="/write">
          <button class="nav-button">
            Post!
          </button>
        </a>
      {:else}
        <a href="/auth">
          Login
        </a>
        <a href="/regist">
          <button class="nav-button">
            Regist
          </button>
        </a>
      {/if}
    </div>
  </div>
</nav>

<style lang="postcss">
  .navbar {
    @apply w-full border-b border-b-gray-200 py-4 flex justify-center items-center sticky top-0 bg-white
  }
  
  .nav-container {
    @apply w-full max-w-7xl px-3 flex flex-wrap justify-between items-center
  }

  .title {
    @apply text-2xl font-bold flex gap-3 items-center
  }
  
  .logo {
    @apply w-8 object-contain
  }

  .nav-buttons {
    @apply flex gap-3 items-center
  }

  .nav-button {
    @apply px-3 py-1 bg-orange-200 rounded-lg hover:bg-orange-300
  }
</style>
