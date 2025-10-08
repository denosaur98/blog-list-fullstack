<template>
  <div class="popup-item">
    <div class="base-overlay" @click="emit('close')"></div>
    <div class="popup__content">
      <h2 class="base-title">{{ popupTypeTitle }}</h2>
      <input
        v-if="props.type !== 'comment'"
        class="base-input"
        placeholder="Введите название блога:"
        v-model="title"
      >
      <textarea
        class="base-input textarea"
        :placeholder="props.type !== 'comment' ? 'Введите описание блога:' : 'Введите комментарий:'"
        v-model="description"
      />
      <button
        :class="validateForm ? 'base-button background-green' : 'base-button disabled'"
        style="width: 100%;"
        @click="popupTypeAction"
        :disabled="!validateForm"
      >
        Отправить
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, onMounted } from 'vue';
import { useBlogsStore } from '../store/blogs-store';
import type { BlogInterface } from '../interfaces/blog-interface';
import type { CommentInterface } from '../interfaces/comment-interface';

const props = defineProps({
  type: String,
  blogData: {
    type: Object,
    default: {}
  }
})
const emit = defineEmits(['close'])

const store = useBlogsStore()

const popupTypeTitle = computed<String>(() => {
  if(props.type === 'create') {
    return 'Создать блог'
  } else if(props.type === 'update') {
    return `Редактировать блог: ${props.blogData.title}`
  } else {
    return `Комментировать блог: ${props.blogData.title}`
  }
})

const title = ref<String>('')
const description = ref<String>('')

const validateForm = computed<Boolean>(() => {
  if(props.type === 'create') {
    if(title.value.trim() !== '') {
      return true
    } else {
      return false
    }
  } else if(props.type === 'update') {
    if(title.value.trim() !== '' && description.value.trim() !== '') {
      return true
    } else {
      return false
    }
  } else if(props.type === 'comment') {
    if(description.value.trim() !== '') {
      return true
    } else {
      return false
    }
  }
})

function popupTypeAction(): void {
  if(props.type === 'create') {
    createBlog()
  } else if(props.type === 'update') {
    updateBlog()
  } else {
    addComment()
  }
}

async function createBlog(): Promise<void> {
  const blog: BlogInterface = {
    title: title.value,
    description: description.value
  }

  await store.createBlog(blog)

  emit('close')
}
async function updateBlog(): Promise<void> {
  const blog: BlogInterface = {
    title: title.value,
    description: description.value
  }

  await store.updateBlog(props.blogData.id, blog)

  emit('close')
}
async function addComment(): Promise<void> {
  const blog: CommentInterface = {
    text: description.value
  }

  await store.addComment(props.blogData.id, blog)

  emit('close')
}

onMounted(() => {
  if(props.type === 'update') {
    title.value = props.blogData.title
    description.value = props.blogData.description
  }
})
</script>

<style lang="scss" scoped>
.popup__content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--base-white);
  z-index: 2;
  border-radius: 5px;
  width: 500px;
  height: max-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  gap: 10px;

  @media (max-width: 900px) {
    width: 90%;
  }

  @media (max-width: 600px) {
    padding: 30px 20px;
  }
}
</style>