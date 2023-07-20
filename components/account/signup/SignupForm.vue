<script lang="ts" setup>
import { RuiFooterStepper, RuiStepper, StepperState } from '@rotki/ui-library';
import { type Ref } from 'vue';
import { get, set } from '@vueuse/core';
import { FetchError } from 'ofetch';
import { type StepperStep } from '@rotki/ui-library/dist/types/stepper';
import {
  type SignupAccountPayload,
  type SignupAddressPayload,
  type SignupCustomerInformationPayload,
  type SignupPayload,
} from '~/types/signup';
import { fetchWithCsrf } from '~/utils/api';

const accountForm = ref<SignupAccountPayload>({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  githubUsername: '',
});

const customerInformationForm = ref<SignupCustomerInformationPayload>({
  firstName: '',
  lastName: '',
  companyName: '',
  vatId: '',
});

const addressForm = ref<SignupAddressPayload>({
  address1: '',
  address2: '',
  city: '',
  postcode: '',
  country: '',
});

const loading: Ref<boolean> = ref(false);
const captchaId: Ref<number> = ref(0);
const $externalResults: Ref<Record<string, string[]>> = ref({});

const signup = async ({
  recaptchaToken,
  onExpired,
}: {
  recaptchaToken: string;
  onExpired: () => void;
}) => {
  set(loading, true);

  const payload: SignupPayload = {
    ...get(accountForm),
    ...get(customerInformationForm),
    ...get(addressForm),
  };

  try {
    await fetchWithCsrf<void>('/webapi/signup/', {
      method: 'post',
      body: {
        captcha: recaptchaToken,
        ...payload,
      },
    });
    await navigateTo({ path: '/activation' });
  } catch (e: any) {
    if (
      e instanceof FetchError &&
      e.status === 400 &&
      e.data &&
      typeof e.data.message === 'object'
    ) {
      window.grecaptcha?.reset(get(captchaId));
      onExpired();
      setErrors(e.data.message);
    }
  }
  set(loading, false);
};

const step: Ref<number> = ref(1);
const steps: ComputedRef<StepperStep[]> = computed(() => {
  const texts = [
    { title: 'Introduction', description: 'First step' },
    { title: 'Account', description: 'Set your credentials' },
    {
      title: 'Customer Information',
      description: 'Information for invoice of payments',
    },
    {
      title: 'Address',
      description: 'Will only be used for invoice of payments',
    },
  ];

  const currentStep = get(step);

  return texts.map((text, index) => {
    let stepStatus: StepperState = StepperState.inactive;

    if (index + 1 === currentStep) {
      stepStatus = StepperState.active;
    }

    if (index + 1 < currentStep) {
      stepStatus = StepperState.done;
    }

    return {
      ...text,
      state: stepStatus,
    };
  });
});

const horizontalStepperRef = ref<HTMLDivElement>();

const adjustHorizontalStepper = () => {
  nextTick(() => {
    const elem = get(horizontalStepperRef);
    if (elem) {
      const a = elem.querySelector('div[class*=active]');
      a?.scrollIntoView?.({
        behavior: 'smooth',
        inline: 'center',
      });
    }
  });
};

const back = () => {
  set(step, Math.max(get(step) - 1, 1));
  adjustHorizontalStepper();
};
const next = () => {
  set(step, Math.min(get(step) + 1, 4));
  adjustHorizontalStepper();
};

const haveIntersectionKeys = (obj1: object, obj2: object) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  return keys1.some((key) => keys2.includes(key));
};

const setErrors = (errors: Record<string, string[]>) => {
  set($externalResults, errors);

  if (haveIntersectionKeys(errors, get(accountForm))) {
    set(step, 2);
    return;
  } else if (haveIntersectionKeys(errors, get(customerInformationForm))) {
    set(step, 3);
    return;
  } else if (haveIntersectionKeys(errors, get(addressForm))) {
    set(step, 4);
    return;
  }
};
</script>

<template>
  <div
    class="container flex flex-col lg:flex-row pt-4 pb-8 lg:py-14 h-full grow lg:items-start"
  >
    <div
      ref="horizontalStepperRef"
      class="lg:hidden mb-14 no-scrollbar whitespace-nowrap overflow-auto [&>div>div]:pt-4"
    >
      <RuiStepper custom orientation="horizontal" :steps="steps" />
    </div>

    <div class="flex justify-center grow">
      <div class="w-[440px] flex flex-col justify-between">
        <SignupIntroduction v-if="step === 1" @next="next()" />
        <SignupAccount
          v-if="step === 2"
          v-model="accountForm"
          :external-results="$externalResults"
          @back="back()"
          @next="next()"
        />
        <SignupCustomerInformation
          v-if="step === 3"
          v-model="customerInformationForm"
          :external-results="$externalResults"
          @back="back()"
          @next="next()"
        />
        <SignupAddress
          v-if="step === 4"
          v-model="addressForm"
          v-model:captcha-id="captchaId"
          :external-results="$externalResults"
          @back="back()"
          @finish="signup($event)"
        />
        <div class="mt-4 p-6">
          <RuiFooterStepper v-model="step" :pages="4" variant="pill" />
        </div>
      </div>
    </div>

    <div class="hidden lg:block w-[332px] sticky top-0">
      <RuiStepper custom orientation="vertical" :steps="steps" />
    </div>
  </div>
</template>
