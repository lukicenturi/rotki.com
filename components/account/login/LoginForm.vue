<script setup lang="ts">
import {
  RuiAlert,
  RuiButton,
  RuiRevealableTextField,
  RuiTextField,
} from '@rotki/ui-library';
import { get, set } from '@vueuse/core';
import { required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import { useMainStore } from '~/store';

const props = withDefaults(defineProps<{ modal?: boolean }>(), {
  modal: false,
});

const emit = defineEmits<{ (e: 'complete'): void }>();

const { modal } = toRefs(props);
const username: Ref<string> = ref('');
const password: Ref<string> = ref('');
const loading: Ref<boolean> = ref(false);
const error: Ref<string> = ref('');
const hadError: Ref<boolean> = ref(false);

const rules = {
  username: { required },
  password: { required },
};

const v$ = useVuelidate(
  rules,
  {
    username,
    password,
  },
  {
    $autoDirty: true,
  },
);

const { login } = useMainStore();

const performLogin = async () => {
  set(loading, true);
  set(
    error,
    await login({
      username: username.value,
      password: password.value,
    }),
  );
  set(loading, false);

  if (!get(error)) {
    if (get(modal)) {
      emit('complete');
    } else {
      await navigateTo('/home');
    }
  } else {
    set(hadError, true);
  }
};
</script>

<template>
  <div class="w-[360px] space-y-8">
    <div class="space-y-3">
      <div class="text-h4">Sign in</div>
      <div class="text-body-1 text-rui-text-secondary">
        Premium users unlock the full potential of rotki by removing all limits
        and unlocking all features.
      </div>
    </div>
    <form @submit.prevent="">
      <div class="space-y-5">
        <RuiTextField
          id="username"
          v-model="username"
          dense
          variant="outlined"
          label="Username"
          autocomplete="username"
          hide-details
          color="primary"
          :error-messages="error ? [error] : []"
          @focus="error = ''"
        />

        <RuiRevealableTextField
          id="password"
          v-model="password"
          variant="outlined"
          dense
          label="Password"
          autocomplete="current-password"
          hide-details
          color="primary"
          :error-messages="error ? [error] : []"
          @enter="performLogin()"
          @focus="error = ''"
        />
      </div>

      <div class="flex justify-end mb-6 mt-2">
        <ButtonLink to="/password/recover" inline>
          Forgot password?
        </ButtonLink>
      </div>

      <div v-if="error" class="text-body-1 text-center text-rui-error pb-6">
        {{ error }}
      </div>

      <RuiButton
        :disabled="v$.$invalid || loading"
        color="primary"
        :loading="loading"
        class="w-full"
        size="lg"
        @click="performLogin()"
      >
        Continue
      </RuiButton>
    </form>
    <div class="flex items-center justify-center">
      <span class="text-rui-text-secondary"> First time premium? </span>
      <ButtonLink to="/signup" inline color="primary"> Sign up now </ButtonLink>
    </div>
  </div>
  <div v-if="hadError" class="mt-14 w-[660px]">
    <RuiAlert
      type="error"
      description="If you are writing your username and password from the app, we remind you that they are independent accounts."
    />
  </div>
</template>
