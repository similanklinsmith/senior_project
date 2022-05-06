<template>
  <BaseHeader
    :headerText="`Calendar Overview`"
    :contentText="`This screen illustrates your calendar schedule.`"
  >
  </BaseHeader>
</template>

<script>
import BaseHeader from "@/components/UI/BaseHeader.vue";
export default {
  name: "CalendarView",
  components: { BaseHeader },
};
</script>

<style lang="scss" scoped></style>
