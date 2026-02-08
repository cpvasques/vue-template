<script lang="ts">
import { PaginationRoot as RadixPaginationRoot } from 'reka-ui'
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'PaginationRoot',
  render() {
    return h(RadixPaginationRoot, this.$attrs, this.$slots)
  },
})
</script>
