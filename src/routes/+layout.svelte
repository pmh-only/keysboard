<script>
  import "../app.css"
  import Navbar from '$lib/Navbar.svelte'
</script>

<Navbar />
<article class="main">
  <slot />
</article>
