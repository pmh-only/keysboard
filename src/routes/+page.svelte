<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData
</script>

<h2 class="title">All Posts <small>{data.posts.length} posts</small></h2>

<table class="table">
  <thead>
    <tr>
      <th>#</th>
      <th>Title</th>
      <th>Author</th>
    </tr>
  </thead>
  <tbody>
    {#each data.posts as post}
      <tr>
        <td>{post.id}</td>
        <td><a href={`/posts/${post.id}`}>{post.title}</a></td>
        <td>{post.user.userName}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style lang="postcss">
  .title {
    @apply text-2xl font-bold
  }
  
  .title > small {
    @apply text-sm font-normal
  }

  .table {
    @apply w-full
  }

  .table thead {
    @apply border-b border-b-gray-300
  }

  .table tbody tr {
    @apply hover:bg-gray-100
  }

  .table th, td {
  @apply text-left py-5
  }

  .table th:first-of-type, td:first-of-type {
    @apply text-center font-bold w-24
  }

  .table th:last-of-type, td:last-of-type {
    @apply w-24 text-ellipsis whitespace-nowrap overflow-hidden block
  }
</style>
