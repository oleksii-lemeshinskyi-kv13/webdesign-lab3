<template>
  <tr>
    <td>{{ index }}</td>

    <td>{{ url }}</td>

    <td>
      <a :href="`/${urlKey}`" target="_blank">{{ urlKey }}</a>
    </td>

    <td>
      <button :data-id="urlKey" class="btn btn-sm btn-danger" @click="deleteItem">Delete</button>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'ItemColumn',

  props: {
    index: Number,
    url: String,
    urlKey: String
  },

  methods: {
    deleteItem() {
      this.$emit('delete', this.urlKey)
    }
  }
}
</script>
