<script>
  import "../app.css"
  import Navbar from '$lib/components/Navbar.svelte'
</script>

<div class="wrap">
  <Navbar />
  <article class="main">
    <slot />
  </article>
</div>

<style lang="postcss">
  .wrap {
    @apply flex flex-col min-h-screen gap-4 items-center
  }

  .main {
    @apply w-full grow max-w-7xl px-4
  }
</style>
