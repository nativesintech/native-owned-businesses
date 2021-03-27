<template>
  <div class="flex flex-col overflow-hidden md:flex-row border border-gray-600 mb-6 shadow rounded">
    <div
      :class="expanded ? 'md:w-1/2 h-128' : 'md:w-1/4 h-64'"
      class="overflow-hidden rounded-t border-b border-gray-600 flex-shrink
      flex flex-row md:border-0 md:rounded-none md:border-r"
    >
      <!-- TODO(nsahler): Slider -->
      <img
        v-if="business.image_assets.length > 0"
        :alt="business.name"
        :src="business.image_assets[0].src"
        class="w-full h-full max-w-full object-cover self-center"
      >
      <div
        v-else
        class="bg-gray-600 w-full h-full"
      ></div>
    </div>
    <div class="flex flex-col flex-1 w-full flex-grow p-6">
      <header>
        <div class="text-sm w-full flex flex-row justify-between mb-1
          text-gray-800">
          <div class="flex justify-between w-100 flex-grow">
            <div v-if="territory" class="affiliation">{{territory.name}}</div>
          </div>
          <div class="location">
            <a :href="location_link" v-if="business.location">
              {{business.physical_address}}
            </a>
          </div>
        </div>
        <div class="text-xl font-bold mb-1 pb-1 border-b">{{business.name}}</div>
      </header>
      <div class="text-sm flex-grow">
        <div v-if="expanded">{{business.long_description || business.short_description}}</div>
        <div v-else>{{business.short_description}}</div>
      </div>
      <div class="flex flex-row items-end">
        <div class="text-sm flex flex-row align-baseline flex-grow">
          <span
            v-for="tag in tags"
            :key="tag.id"
            class="box-border whitespace-no-wrap text-gray-500 pr-2 flex-end"
            :class="`tag-${tag.name}`"
          >{{tag.name}}</span>
        </div>
        <router-link
          v-if="owner"
          :to="{ name: 'business-edit', params: { id: business.id } }"
          class="flex-end button-knockout px-6 py-2 rounded inline-block mr-4"
        >Edit</router-link>
        <a
          v-if="business.external_url"
          :href="business.external_url"
          :title="business.external_url"
          target="_blank"
          class="flex-end button-knockout px-6 py-2 rounded inline-block"
        >Website</a>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  props: ['business', 'expanded'],
  computed: {
    ...mapState(['user']),
    owner () {
      if (!this.business.owners || !this.user) return false

      return this.business.owners
        .map(owner => String(owner.user_id))
        .includes(this.user.sub)
    },
    territory () {
      const primary = this.business.territories[0]
      return primary ? primary.territory : null
    },
    location_link () {
      let [lng, lat] = this.business.location.coordinates
      return `https://www.google.com/maps/place/${lat},${lng}`
    },
    tags () {
      return this.business.tags.map(i => i.tag)
    }
  }
}
</script>
