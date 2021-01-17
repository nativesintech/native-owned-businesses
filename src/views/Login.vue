<template>
  <main>
    <h1 class="text-2xl mb-4 font-bold">Login</h1>
    <form @submit="handle_submit" >
      <label for="email" class="text-sm text-gray-600 leading-normal mb-2">Email</label><br />
      <input required id="email" v-model="email" name="email" class="border-2 border-gray-600 rounded text-lg p-2 mb-4" type="email" /><br/>
      <button class="bg-black text-white px-6 py-2 rounded" type="submit">Login</button>
    </form>
  </main>
</template>
<script>
export default {
  data () {
    return {
      email: undefined
    }
  },
  methods: {
    handle_submit (e) {
      e.preventDefault()

      // Submit Form
    }
  }
}
</script>
