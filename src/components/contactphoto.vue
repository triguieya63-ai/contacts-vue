<script setup>
defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: 'Photo du contact' },
  taille: { type: Number, default: 48 },
})
</script>

<template>
  <img
    class="photo"
    :src="src"
    :alt="alt"
    :style="{ width: taille + 'px', height: taille + 'px' }"
  />
</template>

<style scoped>
.photo { border-radius: 50%; object-fit: cover; background: #e8ecf8; flex-shrink: 0; }
</style>