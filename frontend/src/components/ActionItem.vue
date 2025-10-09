<template>
  <div class="action-item">
    <input
      class="base-input"
      placeholder="Введите название блога:"
      :value="props.modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
    <button class="base-button" @click="openPopup('create')">
      <font-awesome-icon icon="fa-solid fa-plus" />
      Создать
    </button>
  </div>
  <Transition name="fade">
    <PopupItem
      v-if="isPopupOpen"
      :type="popupType"
      @close="closePopup"
    />
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { defineProps, defineEmits } from 'vue';
import PopupItem from './PopupItem.vue';

const props = defineProps({
  modelValue: String
})
const emit = defineEmits(['update:modelValue'])

const isPopupOpen = ref<boolean>(false)
const popupType = ref<string>('')
function openPopup(type: string): void {
  isPopupOpen.value = true
  popupType.value = type
}
function closePopup(): void {
  isPopupOpen.value = false
  popupType.value = ''
}
</script>

<style lang="scss" scoped>
.action-item {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 10px;

  @media (max-width: 600px) {
    flex-direction: column;

    button {
      width: 100%;
    }
  }
}
</style>