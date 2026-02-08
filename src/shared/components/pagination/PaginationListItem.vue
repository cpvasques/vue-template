<script lang="ts">
import { PaginationListItem as RadixPaginationListItem } from 'reka-ui'
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'PaginationListItem',
  render() {
    return h(RadixPaginationListItem, this.$attrs, this.$slots)
  },
})
</script>
