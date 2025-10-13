<template>
  <div class="confirm-popup">
    <div class="base-overlay" @click="emit('close')"></div>
    <div class="popup__content">
      <h2 class="base-title" v-html="popupTitle"></h2>
      <Transition name="fade">
        <div class="content__actions-wrapper" v-if="!removeAllUserData">
          <button class="base-button background-green" @click="actionType" type="button">Да</button>
          <button class="base-button background-red" @click="emit('close')" type="button">Нет</button>
        </div>
        <div class="content__actions-wrapper" v-else-if="removeAllUserData">
          <button class="base-button background-green" @click="deleteUser('yes')" type="button">Да</button>
          <button class="base-button background-red" @click="deleteUser('no')" type="button">Нет</button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, onMounted } from 'vue';
import { useAuthStore } from '../store/auth-store';
import { useBlogsStore } from '../store/blogs-store';

const props = defineProps({
  type: String,
  confirmTitle: String,
  blogDataId: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['close'])

const authStore = useAuthStore()
const blogStore = useBlogsStore()

const popupTitle = ref<string>('')
const removeAllUserData = ref<boolean>(false)

const userBlogs = computed<boolean>(() => {
  const blogs = blogStore.blogsList.filter((b: object) => b.author.id === authStore.user.id)

  return blogs.length > 0
})

async function actionType(): Promise<void> {
  if(props.type === 'auth') {
    if(userBlogs.value) {
      removeAllUserData.value = true
      popupTitle.value = `Удалить блоги и комментарии пользователя <span>${authStore.user.name}</span> ?`
    } else {
      deleteUser('yes')
      emit('close')
    }
  } else if(props.type === 'blog') {
    removeAllUserData.value = false

    await blogStore.deleteBlog(props.blogDataId)
    emit('close')
  }
}
async function deleteUser(agree: string) {
  await authStore.deleteUser(agree)

  emit('close')
}

onMounted(() => {
  popupTitle.value = props.confirmTitle || ''
})
</script>

<style lang="scss" scoped>
.popup__content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  height: max-content;
  width: 300px;
  background: var(--base-white);
  border-radius: 5px;
  z-index: 1;

  .base-title { overflow: visible; white-space: normal; text-align: center; }

  .content__actions-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 10px;
  }
}
</style>