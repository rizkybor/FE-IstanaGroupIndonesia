<template>
  <button
    :class="[
      'inline-flex items-center justify-center rounded-xl px-4 py-2 font-medium transition',
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110',
      variant === 'primary' ? 'bg-sky-600 text-white' :
      variant === 'ghost'   ? 'bg-transparent underline' :
                              'bg-gray-200 text-gray-800'
    ]"
    :disabled="disabled"
    v-bind="$attrs"
  ><slot /></button>
</template>
<script setup lang="ts">
defineProps<{ variant?: 'primary'|'secondary'|'ghost'; disabled?: boolean }>()
</script>