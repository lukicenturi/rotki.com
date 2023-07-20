<script lang="ts" setup>
import { RuiButton, RuiTextField } from '@rotki/ui-library';
import { email, minLength, required, sameAs } from '@vuelidate/validators';
import { get, set } from '@vueuse/core';
import { useVuelidate } from '@vuelidate/core';
import { type SignupAccountPayload } from '~/types/signup';
import { toMessages } from '~/utils/validation';
import { type ValidationErrors } from '~/types/common';

const props = defineProps<{
  modelValue: SignupAccountPayload;
  externalResults: ValidationErrors;
}>();

const emit = defineEmits<{
  (e: 'back'): void;
  (e: 'next'): void;
  (e: 'update:model-value', newValue: SignupAccountPayload): void;
}>();

const { modelValue, externalResults } = toRefs(props);

const password = computed(() => get(modelValue).password);

const rules = {
  username: { required },
  password: { required, minLength: minLength(8) },
  confirmPassword: {
    required,
    sameAsPassword: sameAs(password, 'password'),
  },
  email: { required, email },
  githubUsername: {},
};

const $externalResults: Ref<Record<string, string[]>> = ref({});

const v$ = useVuelidate(rules, modelValue, {
  $autoDirty: true,
  $externalResults,
});

watch(
  externalResults,
  (errors) => {
    set($externalResults, errors);
    if (Object.values(errors).some((i) => !!i)) {
      get(v$).$validate();
    }
  },
  { immediate: true },
);

const updateValue = (field: string, value: any) => {
  emit('update:model-value', {
    ...get(modelValue),
    [field]: value,
  });
};
</script>

<template>
  <div class="space-y-8 grow">
    <div class="text-h4 text-center">Account</div>
    <div class="space-y-5">
      <RuiTextField
        :model-value="modelValue.username"
        variant="outlined"
        color="primary"
        dense
        label="Username"
        autocomplete="username"
        hint="Required. Provide a unique username for your new account."
        :error-messages="toMessages(v$.username)"
        @update:model-value="updateValue('username', $event)"
      />
      <RuiTextField
        :model-value="modelValue.email"
        variant="outlined"
        color="primary"
        dense
        autocomplete="email"
        label="Email"
        hint="Required. Provide a valid email address."
        :error-messages="toMessages(v$.email)"
        @update:model-value="updateValue('email', $event)"
      />
      <div class="space-y-1">
        <RuiTextField
          type="password"
          :model-value="modelValue.password"
          variant="outlined"
          dense
          autocomplete="new-password"
          label="Password"
          hide-details
          :error-messages="toMessages(v$.password).length > 0 ? [''] : []"
          @update:model-value="updateValue('password', $event)"
        />
        <ul
          class="ml-4 list-disc text-caption"
          :class="
            toMessages(v$.password).length > 0
              ? 'text-rui-error'
              : 'text-rui-text-secondary'
          "
        >
          <li>
            Your password can't be too similar to your other personal
            information.
          </li>
          <li>Your password must contain at least 8 characters.</li>
          <li>Your password can't be a commonly used password.</li>
          <li>Your password can't be entirely numeric.</li>
        </ul>
      </div>
      <RuiTextField
        type="password"
        :model-value="modelValue.confirmPassword"
        variant="outlined"
        color="primary"
        autocomplete="new-password"
        dense
        label="Repeat password"
        :error-messages="toMessages(v$.confirmPassword)"
        hint="Enter the same password as before, for verification."
        @update:model-value="updateValue('confirmPassword', $event)"
      />

      <RuiTextField
        :model-value="modelValue.githubUsername"
        variant="outlined"
        color="primary"
        dense
        label="Github username"
        :error-messages="toMessages(v$.githubUsername)"
        hint="Optional. Provide Github username for in-Github support."
        @update:model-value="updateValue('githubUsername', $event)"
      />
    </div>
  </div>
  <div class="mt-16 grid md:grid-cols-2 gap-4">
    <RuiButton type="button" class="w-full" size="lg" @click="emit('back')">
      Back
    </RuiButton>
    <RuiButton
      :disabled="v$.$invalid"
      color="primary"
      class="w-full"
      size="lg"
      @click="emit('next')"
    >
      Continue
    </RuiButton>
  </div>
</template>
