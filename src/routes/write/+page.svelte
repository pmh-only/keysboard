<script lang="ts">
  import type { ActionData, PageData } from './$types'

  export let form: ActionData
  export let data: PageData
</script>

<div class="form-container">
  <form method="POST" action="?/writeNewPost" class="form">
    <h2 class="form-title">New post</h2> 

    <p class="notice-success">Post as <strong>{data.userName}</strong>. You can't modify or delete posts once uploaded!</p>

    <div><label>
      <p class="form-label">Post title</p>
      <input type="text" name="title" class="form-input" value={form?.title ?? ''} placeholder="ex) Breaking news!">
    </label></div>

    <div><label>
      <p class="form-label">Post content</p>
      <textarea name="content" class="form-input" value={form?.content ?? ''} placeholder="ex) Minhyeok Park dead!" />
    </label></div>

    {#if form?.missing}
      <p class="notice">Please enter all fields</p>
    {/if}

    <button type="submit" class="form-submit">
      Publish new post!
    </button>
  </form>
</div>

<style lang="postcss">
  .notice {
    @apply border border-red-200 bg-red-100 px-5 py-2 rounded my-2
  }

  .notice-success {
    @apply border border-green-200 bg-green-100 px-5 py-2 rounded my-2
  }

  .form-container {
    @apply flex flex-col items-center
  }

  .form {
    @apply inline-flex flex-col gap-4 px-10 py-20 border border-gray-200 w-full max-w-lg
  }
  
  .form-title {
    @apply text-2xl font-bold text-center
  }

  .form-label {
    @apply py-2
  }

  .form-input {
    @apply focus:outline-none border-2 border-gray-100 focus:border-orange-200 px-5 py-2 text-gray-500 w-full bg-transparent rounded-lg
  }

  textarea.form-input {
    @apply resize-none h-[180px]
  }

  .form-submit {
    @apply bg-orange-100 hover:bg-orange-200 px-5 py-2 rounded-lg font-bold
  }
</style>
