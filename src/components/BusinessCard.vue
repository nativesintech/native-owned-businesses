<template>
  <div class="business-card">
    <div class="images">
      <!-- TODO(nsahler): Do this in a smart way-->
      <img v-if="business.image_assets.length > 0" :alt="business.name" :src="business.image_assets[0].src">
      <div v-else class="image-placeholder"></div>
    </div>
    <div class="info">
      <header>
        <div class="eyebrow">
          <div class="location">
            <a :href="location_link" v-if="primary_location">
              {{primary_location.name}}
            </a>
          </div>
          <div class="affiliation">{{territory.name}}</div>
        </div>
        <div class="name">{{business.name}}</div>
      </header>
      <div class="subtitle">
        <div class="short_description">{{business.short_description}}</div>
      </div>
      <div style="flex: 1">
        <a
          v-if="business.external_url"
          class="external-url"
          :href="business.external_url"
        >link</a>
      </div>
      <div class="tags" >
        <span v-for="tag in tags" :key="tag.id">{{tag.name}}</span>
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
<style lang="scss" scoped>
  .business-card {
    display: flex;
    flex-flow: row;

    border: 1px solid #151515;

    /* TODO(nsahler): move higher in scope */
    margin-bottom: 15px;

    .images {
      // padding: 15px;
      border-right: 1px solid #151515;
      flex: 1;
      display: flex;
      flex-flow: row;
      height: 250px;

      .image-placeholder {
        background: #DDD;
        width: 100%;
        height: 225px;
      }

      img {
        width: 100%;
        max-width: 100%;
        height: 100%;
        object-fit: cover;
        align-self: center;
      }
    }

    .info {
      display: flex;
      flex-flow: column;
      padding: 15px;
      flex: 3;

      header {
        .eyebrow {
          width: 100%;
          display: flex;
          flex-flow: row;
          justify-content: space-between;
        }

        .eyebrow {
          font-size: 14px;
          margin-bottom: 5px;
          color: #888;
        }

        .name {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 5px;
        }
      }

      .subtitle {
        font-size: 14px;
        margin-bottom: 15px;
        color: #888;

      }

      .external-url {
        color: #888;
        display: inline-block;
        padding: 5px;
        border: 1px solid #151515;
        color: #151515;
        min-width: 50px;
        text-align: center;
        text-decoration: none;
        font-size: 12px;

        align-self: flex-end;

        &:hover {
          background: #151515;
          color: #FFF;
        }

        &:active {
          background: #FFF;
          color: #151515;
        }
      }

      .tags {
        font-size: 12px;

        display: flex;
        flex-flow: row wrap;

        span {
          padding-right: 5px;
          box-sizing: border-box;
          margin-bottom: 2px;
          white-space: nowrap;
        }
      }
    }
  }
</style>
