<template>
  <div class="avatar-item">
    <input
      v-if="route.fullPath === '/profile'"
      type="file"
      ref="avatarInput"
      accept="image/*"
      @change="handleFileUpload"
      style="display: none;"
    >
    <div 
      class="item__avatar-wrapper" 
      @click="openFilePicker"
    >
      <img 
        v-if="store.user.avatar" 
        :src="getAvatarUrl(store.user.avatar)" 
        class="item__uploaded-avatar"
      >
      <font-awesome-icon
        v-else
        icon="fa-solid fa-user-circle"
        class="item__none-icon"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../store/auth-store';

const route = useRoute()
const store = useAuthStore()
const avatarInput = ref<HTMLInputElement>()

function getAvatarUrl(avatarPath: string) {
  if (avatarPath.startsWith('http')) {
    return avatarPath
  }

  return `${import.meta.env.VITE_API_URL}${avatarPath}`
}
function openFilePicker() {
  if (route.fullPath === '/profile' && avatarInput.value) {
    avatarInput.value.click()
  }
}

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if(!file) return

  await store.updateAvatar(file)

  if(target) {
    target.value = ''
  }
}

</script>

<style lang="scss" scoped>
.avatar-item {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .item__avatar-wrapper {
    cursor: pointer;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;

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
  }

  .item__none-icon {
    width: 100%;
    height: 100%;
    color: var(--base-black);
  }
}
</style>