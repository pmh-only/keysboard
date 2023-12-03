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
      <a href="/login">
        Login
      </a>
      <a href="/signin">
        <button class="regist">
          Regist
        </button>
      </a>
    </div>
  </div>
</nav>

<article class="main">
  <slot />
</article>

<style lang="postcss">
  .navbar {
    @apply w-full shadow py-2 flex justify-center items-center
  }
  
  .nav-container {
    @apply w-full max-w-7xl px-3 flex justify-between items-center
  }

  .title {
    @apply text-lg font-bold flex gap-3 items-center
  }
  
  .logo {
    @apply w-6 object-contain
  }

  .nav-buttons {
    @apply flex gap-3 items-center
  }

  .regist {
    @apply px-3 py-1 bg-orange-200 rounded-lg hover:bg-orange-300
  }
</style>
