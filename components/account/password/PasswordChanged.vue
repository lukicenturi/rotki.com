<template>
  <div
    class="container py-16 lg:pt-[250px] lg:pb-32 flex flex-col items-center justify-center"
  >
    <div class="w-[360px] space-y-8">
      <div class="space-y-3">
        <div class="text-h4">Password changed</div>
        <div class="text-body-1 text-rui-text-secondary">
          Your password has been successfully reset. Click below to log in.
        </div>
      </div>
      <ButtonLink
        color="primary"
        variant="default"
        class="w-full"
        size="lg"
        to="/home"
      >
        Continue
      </ButtonLink>
    </div>
  </div>
</template>
