<template>
  <form
    class="d-flex flex-column"
    @submit.prevent="onSubmit"
  >
    <div class="content-wrapper">
      <div v-if="fetchStatus === OpStatus.PENDING" class="fetch-badge">Loading...</div>
      <div v-if="fetchStatus === OpStatus.ERROR" class="fetch-badge">Something went wrong... Please come back later!</div>
      <div
        class="content"
        :class="{active: fetchStatus === OpStatus.SUCCESS}"
      >
        <div class="mb-3 d-flex gap-4">
          <BookPosterOutput
            v-model="isPosterOk"
            :src="book.posterUrl"
            :alt="book.title"
            :placeholder="IMAGE_PLACEHOLDER"
          />

          <div class="d-flex flex-column flex-grow-1">
            <BookTitleInput
              class="mb-3"
              v-model="book.title"
              :disabled="disabled"
            />

            <BookPosterInput
              class="mb-3"
              v-model="book.posterUrl"
              :placeholder="IMAGE_PLACEHOLDER"
              :disabled="disabled"
              @update:proxy="syncPosterUrl"
            />
          </div>
        </div>

        <BookAuthorsInput
          class="mb-3"
          v-model="book.authorIds"
          :disabled="disabled"
        />

        <div class="row mb-3">
          <BookIsbnInput
            class="col"
            v-model="book.isbn"
            :disabled="disabled"
          />

          <BookYearInput
            class="col"
            v-model="book.year"
            :disabled="disabled"
          />
        </div>

        <BookDescriptionInput
          class="mb-3"
          v-model="book.description"
          :disabled="disabled"
        />

        <BookTagsInput
          class="mb-3"
          v-model="book.tags"
          :disabled="disabled"
        />

        <div class="row mb-3">
          <BookCategoryInput
            class="col"
            v-model="book.category"
            :disabled="disabled"
          />

          <BookPriceInput
            class="col"
            v-model="book.price"
            :disabled="disabled"
          />
        </div>
      </div>
    </div>

    <div class="mt-4 mb-3 d-flex justify-content-between gap-2">
      <button
        type="button"
        class="btn btn-secondary d-flex align-items-center gap-1"
        @click="router.back()"
      >
        <ReturnIcon/>
        Back
      </button>
      <button
        type="reset"
        class="btn btn-danger me-auto d-flex align-items-center gap-1"
        @click.prevent="onReset"
        :disabled="disabled"
      >
        <ResetIcon/>
        Reset
      </button>
      <button
        type="submit"
        class="btn btn-primary d-flex align-items-center gap-1"
        :disabled="disabled"
      >
        <slot>Submit</slot>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import {computed, onBeforeMount, ref, watch} from 'vue'
import {nanoid} from 'nanoid'
import _ from 'lodash'

import ResetIcon from '@/assets/icons/reset.svg'
import ReturnIcon from '@/assets/icons/return.svg'
import BookYearInput from '@/components/book/inputs/BookYearInput.vue'
import BookIsbnInput from '@/components/book/inputs/BookIsbnInput.vue'
import BookAuthorsInput from '@/components/book/inputs/BookAuthorsInput.vue'
import BookTitleInput from '@/components/book/inputs/BookTitleInput.vue'
import BookPosterInput from '@/components/book/inputs/BookPosterInput.vue'
import BookPriceInput from '@/components/book/inputs/BookPriceInput.vue'
import BookCategoryInput from '@/components/book/inputs/BookCategoryInput.vue'
import BookTagsInput from '@/components/book/inputs/BookTagsInput.vue'
import BookDescriptionInput from '@/components/book/inputs/BookDescriptionInput.vue'
import BookPosterOutput from '@/components/book/outputs/BookPosterOutput.vue'
import type {BookModel} from '@/helpers/book-types'
import {useBookStore} from '@/stores/book-store'
import {useRouter} from 'vue-router'
import {OpStatus} from '@/helpers/op-types'
import {SET_FILTER} from '@/helpers/collection-helpers'

const router = useRouter()
const {fetchBooks, getFetchStatus} = useBookStore()

const IMAGE_PLACEHOLDER = `https://via.placeholder.com/128x180`

const props = defineProps<{
  modelValue?: BookModel
}>()

const emit = defineEmits<{
  (e: `update:model-value`, book: BookModel): void
}>()

const createBook = (): BookModel => ({
  id: nanoid(),
  title: ``,
  description: ``,
  authorIds: [],
  category: ``
})

const fetchStatus = computed(getFetchStatus)
const disabled = computed(() => fetchStatus.value !== OpStatus.SUCCESS)
const book = ref(createBook())
const posterUrl = computed(() => book.value.posterUrl)
const isPosterOk = ref(true)

const onReset = () => {
  book.value = createBook()
  Object.assign(book.value, props.modelValue)
  book.value.authorIds = props.modelValue?.authorIds?.slice() ?? []
}

const syncPosterUrl = _.debounce((value) => {
  book.value.posterUrl = value
}, 500, {leading: false, trailing: true})

const onSubmit = () => {
  syncPosterUrl.flush()
  book.value.authorIds = book.value.authorIds.filter(Boolean).filter(SET_FILTER)

  emit(`update:model-value`, {...book.value})
}

watch(props, onReset, {immediate: true})

watch(posterUrl, () => {
  isPosterOk.value = !!posterUrl.value
}, {immediate: true})

onBeforeMount(fetchBooks)
</script>

<style lang="scss" scoped>
.content-wrapper {
  position: relative;
}

.fetch-badge {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;

  font-size: 2em;
  text-shadow: 2px 2px white;
}

.content {
  &:not(.active) {
    filter: blur(5px);
  }
}

.btn:disabled {
  filter: blur(5px);
}
</style>
