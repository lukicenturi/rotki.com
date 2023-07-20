<script lang="ts" setup>
import { RuiButton, RuiTextField } from '@rotki/ui-library';
import { required } from '@vuelidate/validators';
import { get, set } from '@vueuse/core';
import { useVuelidate } from '@vuelidate/core';
import { type SignupCustomerInformationPayload } from '~/types/signup';
import { toMessages } from '~/utils/validation';
import { type ValidationErrors } from '~/types/common';

const props = defineProps<{
  modelValue: SignupCustomerInformationPayload;
  externalResults: ValidationErrors;
}>();

const emit = defineEmits<{
  (e: 'back'): void;
  (e: 'next'): void;
  (e: 'update:model-value', newValue: SignupCustomerInformationPayload): void;
}>();

const { modelValue, externalResults } = toRefs(props);

const rules = {
  firstName: { required },
  lastName: { required },
  companyName: {},
  vatId: {},
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
    <div class="text-h4 text-center">Customer Information</div>
    <div class="space-y-5">
      <RuiTextField
        :model-value="modelValue.firstName"
        variant="outlined"
        color="primary"
        autocomplete="given-name"
        dense
        label="First name"
        hint="Required. Will only be used for invoice of payments."
        :error-messages="toMessages(v$.firstName)"
        @update:model-value="updateValue('firstName', $event)"
        @blur="v$.firstName.$touch()"
      />
      <RuiTextField
        :model-value="modelValue.lastName"
        variant="outlined"
        color="primary"
        autocomplete="family-name"
        dense
        label="Last name"
        hint="Required. Will only be used for invoice of payments."
        :error-messages="toMessages(v$.lastName)"
        @update:model-value="updateValue('lastName', $event)"
        @blur="v$.lastName.$touch()"
      />
      <RuiTextField
        :model-value="modelValue.companyName"
        variant="outlined"
        color="primary"
        autocomplete="organization"
        dense
        label="Company name"
        hint="Optional. If you want to be invoiced as a company the given company name will be added to the invoice."
        :error-messages="toMessages(v$.companyName)"
        @update:model-value="updateValue('companyName', $event)"
        @blur="v$.companyName.$touch()"
      />
      <RuiTextField
        :model-value="modelValue.vatId"
        variant="outlined"
        color="primary"
        dense
        label="VAT ID"
        hint="Optional. If you want to be invoiced as a company, the provided VAT ID will be added to the invoice."
        :error-messages="toMessages(v$.vatId)"
        @update:model-value="updateValue('vatId', $event)"
        @blur="v$.vatId.$touch()"
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
