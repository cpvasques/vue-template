<script lang="ts">
import { PaginationList as RadixPaginationList } from 'reka-ui'
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'PaginationList',
  render() {
    return h(RadixPaginationList, this.$attrs, this.$slots)
  },
})
</script>
