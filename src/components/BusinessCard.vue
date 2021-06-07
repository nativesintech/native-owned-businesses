<template>
  <div class="flex flex-col overflow-hidden lg:flex-row border border-gray-600 mb-6 shadow rounded">
    <div
      :class="expanded ? 'lg:w-1/2 h-128' : 'lg:w-1/4 h-64'"
      class="overflow-hidden rounded-t border-b border-gray-600 flex-shrink
      flex flex-row lg:border-0 lg:rounded-none lg:border-r"
    >
      <!-- TODO(nsahler): Slider for multiple images -->
      <img
        v-if="business.preview_image"
        :alt="business.name"
        :src="previewImage(business.preview_image)"
        class="w-full h-full max-w-full object-cover self-center"
      />
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
        <router-link :to="linkTo" class="text-xl font-bold mb-1 pb-1 border-b block">
          {{business.name}}
        </router-link>
      </header>
      <div class="text-sm flex-grow mb-6 lg:mb-0">
        <div v-if="expanded">{{business.long_description || business.short_description}}</div>
        <div v-else>{{business.short_description}}</div>
      </div>
      <div class="flex flex-col lg:flex-row lg:items-end">
        <div class="text-sm flex flex-row align-baseline flex-grow mb-6 lg:mb-0">
          <span
            v-for="tag in tags"
            :key="tag.id"
            :class="`box-border whitespace-no-wrap text-gray-500 pr-2 flex-end tag-${tag.name}`"
          >{{tag.name}}</span>
        </div>
        <div class="text-sm flex flex-row align-baseline flex-end">
          <router-link
            v-if="owner"
            :to="{ name: 'business-edit', params: { id: business.id } }"
            class="button-knockout px-6 py-2 rounded inline-block mr-4"
          >Edit</router-link>
          <a
            v-if="business.external_url"
            :href="business.external_url"
            :title="business.external_url"
            target="_blank"
            class="button-knockout px-6 py-2 rounded inline-block"
          >Website</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { previewImage } from '@/helpers'

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
    },
    linkTo () {
      return { name: 'business', params: { id: this.business.id } }
    }
  },
  methods: { previewImage }
}
</script>
