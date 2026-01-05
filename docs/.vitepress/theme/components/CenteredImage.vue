<template>
  <div
    style="
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    "
  >
    <img :src="src" :alt="alt" :style="imgStyle" />
  </div>
</template>

<script setup>
defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  width: { type: String, default: '80%' },
  radius: { type: String, default: '12px' },
});
const imgStyle = {
  maxWidth: width,
  height: 'auto',
  borderRadius: radius,
  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
};
</script>
