<script lang="ts" setup>
import {
  RuiAutoComplete,
  RuiButton,
  RuiCheckbox,
  RuiTextField,
} from '@rotki/ui-library';
import { helpers, required } from '@vuelidate/validators';
import { get } from '@vueuse/core';
import { useVuelidate } from '@vuelidate/core';
import { type SignupAddressPayload } from '~/types/signup';
import { toMessages } from '~/utils/validation';
import { type Country } from '~/composables/countries';

const props = defineProps<{
  modelValue: SignupAddressPayload;
  externalResults: Record<string, string[]>;
  captchaId: number;
}>();

const emit = defineEmits<{
  (e: 'back'): void;
  (
    e: 'finish',
    events: {
      recaptchaToken: string;
      onExpired: () => void;
    },
  ): void;
  (e: 'update:model-value', newValue: SignupAddressPayload): void;
  (e: 'update:captcha-id', captchaId: number): void;
}>();

const { modelValue, externalResults } = toRefs(props);

const rules = {
  address1: { required },
  address2: {},
  city: { required },
  postcode: {
    required,
    validateCode: helpers.withMessage(
      'Enter a valid postal code. Only alphabets, numbers, space and -',
      helpers.regex(/^[\d\sA-Za-z-]+$/),
    ),
  },
  country: { required },
  captcha: { required },
  terms: { checked: (value: boolean) => value },
};

const terms: Ref<boolean> = ref(false);

const recaptcha = useRecaptcha();
const { recaptchaPassed, onError, onSuccess, onExpired, recaptchaToken } =
  recaptcha;

const v$ = useVuelidate(
  rules,
  computed(() => ({
    ...get(modelValue),
    captcha: recaptchaToken,
    terms,
  })),
  {
    $autoDirty: true,
    $externalResults: externalResults,
  },
);

const updateValue = (field: string, value: any) => {
  emit('update:model-value', {
    ...get(modelValue),
    [field]: value,
  });
};

const { countries } = useCountries();

const country = computed({
  get() {
    return (
      get(countries).find(({ code }) => code === get(modelValue).country) ||
      null
    );
  },
  set(item: Country | null) {
    updateValue('country', item ? item.code : '');
  },
});

const setCaptchaId = (captchaId: number) => {
  emit('update:captcha-id', captchaId);
};

const finish = () => {
  emit('finish', {
    recaptchaToken: get(recaptchaToken),
    onExpired,
  });
};
</script>

<template>
  <div class="space-y-8 grow">
    <div class="text-h4 text-center">Address</div>
    <div class="space-y-5">
      <RuiTextField
        :model-value="modelValue.address1"
        variant="outlined"
        color="primary"
        autocomplete="address-line1"
        dense
        label="Address line 1"
        hint="Required."
        :error-messages="toMessages(v$.address1)"
        @update:model-value="updateValue('address1', $event)"
      />
      <RuiTextField
        :model-value="modelValue.address2"
        variant="outlined"
        color="primary"
        autocomplete="address-line2"
        dense
        label="Address line 2"
        hint="Required."
        :error-messages="toMessages(v$.address2)"
        @update:model-value="updateValue('address2', $event)"
      />
      <RuiTextField
        :model-value="modelValue.city"
        variant="outlined"
        color="primary"
        autocomplete="address-level2"
        dense
        label="Address line 2"
        hint="Required."
        :error-messages="toMessages(v$.city)"
        @update:model-value="updateValue('city', $event)"
      />
      <RuiTextField
        :model-value="modelValue.postcode"
        variant="outlined"
        color="primary"
        autocomplete="postal-code"
        dense
        label="Postal code"
        hint="Required."
        :error-messages="toMessages(v$.postcode)"
        @update:model-value="updateValue('postcode', $event)"
      />
      <RuiAutoComplete
        v-model="country"
        variant="outlined"
        color="primary"
        autocomplete="country"
        :data="countries"
        key-prop="code"
        text-prop="name"
        dense
        label="Country"
        hint="Required."
        :error-messages="toMessages(v$.country)"
      />
      <Recaptcha
        id="signup-captcha"
        :invalid="v$.captcha.$invalid && v$.captcha.$dirty"
        @error="onError()"
        @expired="onExpired()"
        @success="onSuccess($event)"
        @captcha-id="setCaptchaId($event)"
      />

      <RuiCheckbox v-model="terms" color="primary">
        I have read and agreed to the
        <ButtonLink to="/tos" inline color="primary" external>
          Terms of Service
        </ButtonLink>
        and the
        <ButtonLink inline color="primary" to="/privacy-policy" external>
          Privacy Policy.
        </ButtonLink>
      </RuiCheckbox>
    </div>
  </div>
  <div class="mt-16 grid md:grid-cols-2 gap-4">
    <RuiButton class="w-full" size="lg" @click="emit('back')"> Back </RuiButton>
    <RuiButton
      :disabled="v$.$invalid || !recaptchaPassed"
      color="primary"
      class="w-full"
      size="lg"
      @click="finish()"
    >
      Create Account
    </RuiButton>
  </div>
</template>
