<template>
  <div class="flex flex-row border border-gray-600 mb-6 shadow rounded">
    <div class="border-r border-gray-600 flex-shrink flex flex-row h-64 w-1/4
      rounded-l overflow-hidden">
      <!-- TODO(nsahler): Slider -->
      <img
        v-if="business.image_assets.length > 0"
        :alt="business.name"
        :src="business.image_assets[0].src"
        class="w-full h-full max-w-full object-cover self-center"
      >
      <div
        v-else
        class="bg-gray-600 w-full h-64"
      ></div>
    </div>
    <div class="flex flex-col flex-1 w-3/4 flex-grow p-6">
      <header>
        <div class="text-sm w-full flex flex-row justify-between mb-1
          text-gray-800">
          <div class="affiliation">{{territory.name}}</div>
          <div class="location">
            <a :href="location_link" v-if="primary_location">
              {{primary_location.name}}
            </a>
          </div>
        </div>
        <div class="text-xl font-bold mb-1 pb-1 border-b">{{business.name}}</div>
      </header>
      <div class="text-sm">
        <div class="short_description">{{business.short_description}}</div>
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
  props: ['business'],
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
