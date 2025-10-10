<template>
  <div class="avatar-item">
    <input
      type="file"
      ref="avatarInput"
      accept="image/*"
      @change="handleFileUpload"
      style="display: none;"
    >
    <button class="item__avatar-wrapper" @click.stop.prevent="openFilePicker">
      <img
        v-if="imagePreview" 
        :src="imagePreview" 
        class="item__uploaded-avatar"
      >
      <img 
        v-else-if="store.user.avatar"
        :src="getAvatarUrl(store.user.avatar)" 
        class="item__uploaded-avatar"
      >
      <font-awesome-icon
        v-else-if="!store.user.avatar && imagePreview.trim() === ''"
        icon="fa-solid fa-user-circle"
        class="item__none-icon"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../store/auth-store';

const route = useRoute()
const store = useAuthStore()
const avatarInput = ref<HTMLInputElement>()
const imagePreview = ref<string>('')

function getAvatarUrl(avatarPath: string) {
  if (avatarPath.startsWith('http')) {
    return avatarPath
  }
  return `${import.meta.env.VITE_API_URL}${avatarPath}`
}
function openFilePicker() {
  if (avatarInput.value) {
    avatarInput.value.click()
  }
}
function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string)
      } else {
        reject(new Error('Не удалось загрузить изображение'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Ошибка при чтении файла'))
    }
    
    reader.readAsDataURL(file)
  })
}


async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  imagePreview.value = await createImagePreview(file)

  await store.updateAvatar(file)
}
</script>

<style lang="scss" scoped>
.avatar-item {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .item__avatar-wrapper {
    position: absolute;
    cursor: pointer;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
    background: none;
    border: none;
    top: 0;
    left: 0;

    .item__uploaded-avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transform: scale(1.01);
      transition: .5s;

      @media (hover: hover) {
        &:hover {
          transform: scale(1.1);
        }
      }
    }

    .item__none-icon {
      width: 100%;
      height: 100%;
      color: var(--base-black);
      transition: .5s;

      @media (hover:hover) {
        &:hover {
          color: var(--base-grey);
        }
      }
    }
  }
}
</style>