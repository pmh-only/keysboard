<script lang="ts">
  import "../app.pcss"
  import type { LayoutData } from './$types';
  import Navbar from '$lib/components/Navbar.svelte'
  
  export let data: LayoutData
</script>

<div class="wrap">
  <Navbar isLoggined={data.isLoggined} userName={data.userName ?? ''} />
  <article class="main">
    <slot />
  </article>
</div>

<style lang="postcss">
  .wrap {
    @apply flex flex-col min-h-screen items-center
  }

  .main {
    @apply w-full grow max-w-7xl px-4 py-5
  }
</style>
