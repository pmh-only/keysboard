<script lang="ts">
  import { onMount } from 'svelte'
  import { startAuthentication } from '@simplewebauthn/browser'
  import type { ActionData, PageData } from './$types'

  export let data: PageData
  export let form: ActionData

  let authenticationError: string | undefined = undefined
  let verificationError: string | undefined = undefined

  onMount(async () => {
    if (form?.success !== true) {
      return
    }

    const authentication = await startAuthentication(form.options)
      .catch((error) => {
        authenticationError = error.message + '\nRefreshing after 5 seconds...'
        
        setTimeout(() => {
          window.location.reload()
        }, 1000 * 5)

        return undefined
      })

    if (authentication === undefined) {
      return
    }
      
    const verification = await fetch('/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        authentication,
        authID: form.authID
      })
    }).then((res) => res.json())
    .catch((error) => ({
      success: false,
      message: error.message
    }))

    if (verification?.success !== true) {
      verificationError = verification.message + '\nRefreshing after 5 seconds...'
      
      setTimeout(() => {
        window.location.reload()
      }, 1000 * 5)

      return
    }

    window.location.assign('/')
  })
</script>

<div class="form-container">
  <form method="POST" action="?/generateAuthenticationOptions" class="form">
    <h2 class="form-title">Login</h2>

    {#if verificationError !== undefined}
      <p class="notice">Error: {verificationError}</p>
    {/if}

    {#if data.fromRegistPage}
      <p class="notice-success">Registration success! Please login for last step!</p>
    {/if}

    <button disabled={form?.success === true} type="submit" class="form-submit">
      {#if form?.success === true}
        Logging in...
      {:else}
        Login via passkey!
      {/if}
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

  .form-submit {
    @apply bg-orange-100 hover:bg-orange-200 px-5 py-2 rounded-lg font-bold
  }
</style>
