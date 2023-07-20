<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { minLength, required, sameAs } from '@vuelidate/validators';
import { get, set } from '@vueuse/core';
import { type Ref } from 'vue';
import { FetchError } from 'ofetch';
import {
  RuiButton,
  RuiProgress,
  RuiRevealableTextField,
} from '@rotki/ui-library';
import { fetchWithCsrf } from '~/utils/api';
import { toMessages } from '~/utils/validation';

function setupTokenValidation() {
  const route = useRoute();
  const { uid, token } = route.params;
  const validating: Ref<boolean> = ref(true);
  const isValid: Ref<boolean> = ref(true);

  const validateToken = async () => {
    try {
      await fetchWithCsrf<void>('/webapi/password-reset/validate/', {
        method: 'post',
        body: {
          uid,
          token,
        },
      });
    } catch (e: any) {
      if (!(e instanceof FetchError && e.status === 404)) {
        logger.error(e);
      }
      set(isValid, false);
    } finally {
      set(validating, false);
    }
  };

  onMounted(async () => await validateToken());
  return { validating, isValid };
}

function setupFormValidation(
  password: Ref<string>,
  passwordConfirmation: Ref<string>,
  $externalResults: Ref<NonNullable<unknown>>,
) {
  const rules = {
    password: { required, minLength: minLength(8) },
    passwordConfirmation: {
      required,
      sameAsPassword: sameAs(password, 'password'),
    },
  };

  const v$ = useVuelidate(
    rules,
    { password, passwordConfirmation },
    {
      $autoDirty: true,
      $externalResults,
    },
  );

  const valid = computed(() => !get(v$).$invalid);
  return { v$, valid };
}

const password = ref('');
const passwordConfirmation = ref('');
const $externalResults = ref({});

const route = useRoute();
const { uid, token } = route.params;
const submitting: Ref<boolean> = ref(false);

const submit = async () => {
  set(submitting, true);
  try {
    await fetchWithCsrf<void>('/webapi/password-reset/confirm/', {
      method: 'post',
      body: {
        uid,
        token,
        password: get(password),
        password_confirmation: get(passwordConfirmation),
      },
    });
    await navigateTo({
      path: '/password/changed',
    });
  } catch (e: any) {
    if (e instanceof FetchError && e.status === 400) {
      const message = e.data.message;
      if (message && typeof message === 'object') {
        set($externalResults, {
          password: message.password,
          passwordConfirmation: message.password_confirmation,
        });
      }
    } else {
      logger.error(e);
    }
  } finally {
    set(submitting, false);
  }
};

const { validating, isValid } = setupTokenValidation();
const { valid, v$ } = setupFormValidation(
  password,
  passwordConfirmation,
  $externalResults,
);
</script>

<template>
  <div
    class="container py-16 lg:pt-[200px] lg:pb-32 flex flex-col items-center justify-center"
  >
    <div class="w-[360px]">
      <div v-if="validating" class="flex justify-center">
        <RuiProgress variant="indeterminate" circular color="primary" />
      </div>
      <div v-else-if="!isValid" class="space-y-3">
        <div class="text-h4">Invalid password reset link</div>
        <div class="text-body-1 text-rui-text-secondary">
          The link you followed doesn't seem like a valid password reset link.
        </div>
      </div>
      <div v-else class="space-y-8">
        <div class="text-h4">Provide your new password</div>
        <form class="space-y-6" @submit.prevent="">
          <div class="space-y-5">
            <div class="space-y-1">
              <RuiRevealableTextField
                id="password"
                v-model="password"
                dense
                variant="outlined"
                label="New password"
                hide-details
                color="primary"
                :error-messages="toMessages(v$.password)"
              />
              <ul class="ml-4 list-disc text-rui-text-secondary text-caption">
                <li>
                  Your password can't be too similar to your other personal
                  information.
                </li>
                <li>Your password must contain at least 8 characters.</li>
                <li>Your password can't be a commonly used password.</li>
                <li>Your password can't be entirely numeric.</li>
              </ul>
            </div>
            <div>
              <RuiRevealableTextField
                id="password-confirmation"
                v-model="passwordConfirmation"
                dense
                variant="outlined"
                label="Confirm new password"
                hint="Enter the same password as before, for verification."
                color="primary"
                :error-messages="toMessages(v$.passwordConfirmation)"
              />
            </div>
          </div>
          <div>
            <RuiButton
              color="primary"
              :disabled="!valid"
              class="w-full"
              size="lg"
              :loading="submitting"
              @click="submit()"
            >
              Submit
            </RuiButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
