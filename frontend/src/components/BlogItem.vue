<template>
  <div :class="isYourBlog ? 'blog-item background-green' : 'blog-item'">
    <div class="item__actions-wrapper">
      <button class="base-button background-blue" @click="openPopup('comment')">
        <font-awesome-icon icon="fa-solid fa-comment" />
        Комментировать
      </button>
      <button
        v-if="authStore.user.id === props.blogData?.author.id"
        class="base-button background-green"
        @click="openPopup('update')"
      >
        <font-awesome-icon icon="fa-solid fa-pen-to-square" />
        Редактировать
      </button>
      <button
        v-if="authStore.user.id === props.blogData?.author.id"
        class="base-button background-red"
        @click="blogStore.deleteBlog(props.blogData?.id)"
      >
        <font-awesome-icon icon="fa-solid fa-trash" />
        Удалить
      </button>
    </div>
    <h2 class="base-title">{{ props.blogData?.title }}</h2>
    <div class="item__text-wrapper">
      <p class="base-description">{{ props.blogData?.description }}</p>
    </div>
    <div class="item__comments-wrapper">
      <button class="base-button" @click="toggleComments">
        <font-awesome-icon :icon="isCommentsOpen ? 'fa-solid fa-minus' : 'fa-solid fa-plus'" />
        Смотреть комментарии
      </button>
      <Transition name="fade">
        <div class="comments__list" v-if="isCommentsOpen">
          <div class="list__comment-item"
            v-if="props.blogData?.comments.length > 0"
            v-for="comment in props.blogData?.comments"
            :key="comment.id"
          >
            <div class="item__text-wrapper">
              <p class="base-description">{{ comment.text }}</p>
            </div>
            <div class="item__info bottom5 right5">
              <p class="info__text"><span>Комментарий от: </span>{{ comment.author.email }}</p>
              <p class="info__text">{{ useDateFormat(comment.createdAt, 'DD:MM:YYYY HH:mm:ss') }}</p>
            </div>
          </div>
          <div class="empty-wrapper" v-else>
            <p>Пусто</p>
          </div>
        </div>
      </Transition>
    </div>
    <div class="item__info bottom10 right10">
      <p class="info__text"><span>Пост от: </span>{{ props.blogData?.author.email }}</p>
      <p class="info__text">{{ useDateFormat(props.blogData?.createdAt, 'DD:MM:YYYY HH:mm:ss') }}</p>
    </div>
  </div>
  <Transition name="fade">
    <PopupItem
      v-if="isPopupOpen"
      :type="popupType"
      :blogData="props.blogData"
      @close="closePopup"
    />
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, defineProps } from 'vue';
import { useDateFormat } from '@vueuse/core';
import { useBlogsStore } from '../store/blogs-store';
import { useAuthStore } from '../store/auth-store';
import PopupItem from './PopupItem.vue';

const blogStore = useBlogsStore()
const authStore = useAuthStore()

const props = defineProps({
  blogData: Object
})

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

const isCommentsOpen = ref<boolean>(false)
function toggleComments(): void {
  isCommentsOpen.value = !isCommentsOpen.value
}

const isYourBlog = computed(() => {
  return props.blogData?.author.id === authStore.user.id
})
</script>

<style lang="scss" scoped>
.blog-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  border: 1px solid var(--base-black);
  border-radius: 5px;
  width: 100%;
  padding: 20px 20px 30px;
  background: var(--base-white);

  .item__actions-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    margin-bottom: 20px;
    gap: 10px;

    @media (max-width: 900px) {
      justify-content: flex-start;
    }

    @media (max-width: 600px) {
      flex-direction: column;

      button {
        width: 100%;
      }
    }
  }
  
  .item__info {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 10px;

    &.top5 { top: 5px; }
    &.bottom5 { bottom: 5px; }
    &.top10 { top: 10px; }
    &.bottom10 { bottom: 10px; }
    &.right5 { right: 5px; }
    &.right10 { right: 10px; }

    .info__text {
      font-size: 10px;
      color: var(--base-grey);
      font-weight: 400;

      span {
        color: var(--base-black);
      }
    }
  }

  .item__text-wrapper {
    width: 100%;
    max-height: 200px;
    overflow: auto;
  }

  .item__comments-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    max-height: 200px;
    gap: 20px;
    margin-top: 50px;

    .comments__list {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      overflow: auto;
      width: 100%;
      height: 100%;
      gap: 5px;

      .list__comment-item {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        border: 1px solid var(--base-grey);
        border-radius: 5px;
        width: 100%;
        height: 100px;
        padding: 10px 15px;
      }
    }
  }
}
</style>