<script lang="ts">
  import { onMount } from "svelte";
  import type { ActionData } from "./$types";
  import { startRegistration } from '@simplewebauthn/browser'

  export let form: ActionData
  let registrationError: string | undefined = undefined
  let verificationError: string | undefined = undefined

  onMount(async () => {
    if (form?.success !== true) {
      return
    }

    const registration = await startRegistration(form.options)
      .catch((error) => {
        registrationError = error.message + '\nRefreshing after 5 seconds...'
        
        setTimeout(() => {
          window.location.reload()
        }, 1000 * 5)

        return undefined
      })

    if (registration === undefined) {
      return
    }
      
    const verification = await fetch('/regist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        registration,
        userID: form.userID,
        userName: form.userName
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

    window.location.assign('/login?regist=true')
  })
</script>

<div class="form-container">
  <form method="POST" action="?/generateRegistrationOptions" class="form">
    <h2 class="form-title">Registration</h2>
  
    <div><label>
      <p class="form-label">Login ID</p>
      <input disabled={form?.success === true} type="text" name="user_id" value={form?.userID ?? ''} class="form-input">
    </label></div>
    <div><label>
      <p class="form-label">Nickname</p>
      <input disabled={form?.success === true} type="text" name="user_name" value={form?.userName ?? ''} class="form-input">
    </label></div>

    {#if form?.missing}
      <p class="notice">Please enter all fields.</p>
    {/if}

    {#if form?.short}
      <p class="notice">ID is too short. Please enter at least 6 characters.</p>
    {/if}

    {#if form?.conflict}
      <p class="notice">ID is too short. Please enter at least 6 characters.</p>
    {/if}

    {#if registrationError !== undefined}
      <p class="notice">Error: {registrationError}</p>
    {/if}

    <button disabled={form?.success === true} type="submit" class="form-submit">
      {#if form?.success === true}
        Creating...
      {:else}
        Create passkey!
      {/if}
    </button>
  </form>
</div>


<style lang="postcss">
  .notice {
    @apply border border-red-200 bg-red-100 px-5 py-2 rounded my-2 max-w-md
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
