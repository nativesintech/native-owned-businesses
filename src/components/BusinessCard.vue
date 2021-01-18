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
            <div class="affiliation">{{territory.name}}</div>
            <div v-if="edit"><router-link :to="{ name: 'owner-business-edit', params: { id: business.id } }">Edit</router-link></div>
          </div>
          <div class="location">
            <a :href="location_link" v-if="primary_location">
              {{primary_location.name}}
            </a>
          </div>
        </div>
        <div class="text-xl font-bold mb-1 pb-1 border-b">{{business.name}}</div>
      </header>
      <div class="text-sm">
        <div v-if="expanded">{{business.long_description}}</div>
        <div v-else>{{business.short_description}}</div>
      </div>
      <div style="flex: 1">
        <a
          v-if="business.external_url"
          class="link-style"
          :href="business.external_url"
        >link</a>
      </div>
      <div class="text-sm flex flex-row">
        <span
          v-for="tag in tags"
          :key="tag.id"
          class="box-border whitespace-no-wrap text-gray-500 pr-2"
        >{{tag.name}}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['business', 'expanded', 'edit'],
  computed: {
    territory () {
      const primary = this.business.territories[0]
      return primary ? primary.territory : null
    },
    primary_location () {
      return this.business.locations[0] || null
    },
    location_link () {
      let [lat, lon] = this.primary_location.location.coordinates
      return `https://www.google.com/maps/place/${lat},${lon}`
    },
    tags () {
      return this.business.tags.map(i => i.tag)
    }
  }
}
</script>
