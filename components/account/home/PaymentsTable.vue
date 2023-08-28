<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { get } from '@vueuse/core';
import { type TableColumn } from '@rotki/ui-library/dist/components/tables/DataTable.vue';
import { useMainStore } from '~/store';

const { t } = useI18n();

const headers: TableColumn[] = [
  {
    label: t('common.plan'),
    key: 'plan',
    cellClass: 'font-bold',
    class: 'capitalize',
  },
  {
    label: t('account.payments.headers.paid_at'),
    key: 'paidAt',
    sortable: true,
  },
  {
    label: t('account.payments.headers.amount_in_symbol', { symbol: '€' }),
    key: 'eurAmount',
    sortable: true,
    align: 'end',
  },
  { label: t('common.status'), key: 'status', class: 'capitalize' },
  {
    label: t('common.actions'),
    key: 'actions',
    align: 'end',
    class: 'capitalize',
  },
];

const store = useMainStore();
const { account } = storeToRefs(store);
const payments = computed(() => {
  const userAccount = get(account);
  if (!userAccount) {
    return [];
  }

  return userAccount.payments.sort(
    (a, b) => new Date(a.paidAt).getTime() - new Date(b.paidAt).getTime(),
  );
});

const pagination = ref({ limit: 10, page: 1 });
</script>

<template>
  <div>
    <div class="text-h6 mb-6">{{ t('account.payments.title') }}</div>
    <RuiDataTable
      :pagination="{ ...pagination, total: payments.length }"
      class="border rounded-xl"
      :cols="headers"
      :rows="payments"
      :empty="{ description: t('account.payments.no_payments_found') }"
      row-attr="identifier"
      @update:pagination="pagination = $event"
    >
      <template #item.status>
        <RuiChip size="sm"> {{ t('account.payments.paid') }} </RuiChip>
      </template>

      <template #item.actions="{ row }">
        <ButtonLink
          :to="`/webapi/download/receipt/${row.identifier}`"
          color="primary"
          external
        >
          {{ t('actions.download') }}
        </ButtonLink>
      </template>
    </RuiDataTable>
  </div>
</template>
