<script lang="ts">
  import type { ActionData, PageData } from './$types'

  export let data: PageData
  export let form: ActionData
</script>


<div class="form-container">
  <form method="POST" action="?/saveSettings" class="form">
    <h2 class="form-title">User settings</h2>

    <div><label>
      <p class="form-label">Username</p>
      <input type="text" name="userName" value={form?.userName ?? data.userName} class="form-input" placeholder="ex) Minhyeok Park">
    </label></div>

    {#if form?.missing}
      <p class="notice">Please enter your Username</p>
    {/if}

    {#if form?.conflict}
      <p class="notice">Username already clamed. Please try another.</p>
    {/if}

    {#if form?.success === true}
      <p class="notice-success">Settings were applied</p>
    {/if}

    <button type="submit" class="form-submit">
      Apply settings
    </button>
  </form>
</div>

<style lang="postcss">
  .notice {
    @apply border border-red-200 bg-red-100 px-5 py-2 rounded my-2 max-w-md
  }

  .notice-success {
    @apply border border-green-200 bg-green-100 px-5 py-2 rounded my-2 max-w-md
  }

  .form-container {
    @apply flex flex-col items-center
  }

  .form {
    @apply inline-flex flex-col gap-4 px-10 py-20 border border-gray-200 w-full max-w-md
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

  .form-submit {
    @apply bg-orange-100 hover:bg-orange-200 px-5 py-2 rounded-lg font-bold
  }
</style>

