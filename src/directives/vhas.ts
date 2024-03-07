import pinia from '@/store'
import useUserStore from '@/store/modules/user'

const userStore = useUserStore(pinia)

export default {
  mounted(el: any, binding: any) {
    if (!userStore.buttons.includes(binding.value)) {
      el.parentNode.removeChild(el)
    }
  }
}
