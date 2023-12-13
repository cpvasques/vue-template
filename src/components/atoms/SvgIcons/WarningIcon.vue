<template>
  <svg
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_1_1500)">
      <path
        d="M8.5 4.95837L8.5 9.20837"
        :stroke="color"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8.5 12.0487L8.50708 12.0408"
        :stroke="color"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8.49996 15.5833C12.412 15.5833 15.5833 12.412 15.5833 8.49996C15.5833 4.58794 12.412 1.41663 8.49996 1.41663C4.58794 1.41663 1.41663 4.58794 1.41663 8.49996C1.41663 12.412 4.58794 15.5833 8.49996 15.5833Z"
        :stroke="color"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_1500">
        <rect width="17" height="17" fill="white" />
      </clipPath>
    </defs>
  </svg>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: "#E3403B",
    },
  },
};
</script>
