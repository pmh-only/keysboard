<script lang="ts">
  import type { PageData } from './$types'

  export let data: PageData
</script>

<table class="table">
  <thead>
    <tr>
      <th>#</th>
      <th>Title</th>
      <th>Author</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>{data.post.id}</td>
      <td><a href={`/posts/${data.post.id}`}>{data.post.title}</a></td>
      <td>{data.post.user.userName}</td>
    </tr>
  </tbody>
</table>

<article class="content">{data.post.content}</article>

<style lang="postcss">
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
    @apply text-center font-bold
  }

  .content {
    @apply whitespace-pre-wrap p-10
  }
</style>
