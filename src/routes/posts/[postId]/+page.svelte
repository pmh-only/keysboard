<script lang="ts">
  import type { PageData } from './$types'

  export let data: PageData
</script>

<h2 class="title">
  {data.post.title}
  <small>by {data.post.user.userName}</small>
</h2>

<article class="content">{data.post.content}</article>

<style lang="postcss">
  .title {
    @apply text-2xl font-bold
  }
  
  .title > small {
    @apply text-sm font-normal
  }

  .content {
    @apply whitespace-pre-wrap p-10
  }
</style>
