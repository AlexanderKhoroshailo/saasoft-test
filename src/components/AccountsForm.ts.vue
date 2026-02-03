<template>
  <v-card>
    <v-card-title class="d-flex justify-space-between">
      Учетные записи
      <v-btn icon="mdi-plus" @click="addAccount" />
    </v-card-title>
    <v-card-text>
      <v-card-title v-if="store.accounts?.length" class="d-flex justify-space-between bg-red-lighten-5 mb-1">
        <v-row align="center" no-gutters>
          <v-col cols="auto">
            <v-icon color="red-lighten-2" class="mr-3">mdi-help-circle-outline</v-icon>
          </v-col>
          <v-col>
            <v-label>Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;</v-label>
          </v-col>
        </v-row>
      </v-card-title>
      <v-row v-if="store.accounts?.length" align="center" class="mb-2" dense>
        <v-col cols="3">
          Метка
        </v-col>
        <!-- Тип -->
        <v-col cols="2">
          Тип
        </v-col>

        <!-- Логин -->
        <v-col cols="3">
          Логин
        </v-col>

        <!-- Пароль -->
        <v-col cols="3">
          Пароль
        </v-col>

        <!-- Удалить -->
        <v-col cols="1" class="text-center">
          <v-btn
            icon="mdi-delete-forever"
            color="red"
            variant="text"
            @click="showConfirmDialog(true)"
          />
        </v-col>
      </v-row>
      <AccountItem
        v-for="acc in store.accounts"
        :key="acc.id"
        :account="acc"
        @update="updateAccount"
        @remove="removeAccount(acc.id)"
      />
    </v-card-text>
  </v-card>
  <v-dialog v-model="isConfirmDialog" max-width="400">
    <v-card>
      <v-card-title class="text-h6">Подтверждение</v-card-title>
      <v-card-text>Вы уверены что хотите удалить все учетные записи?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="grey" @click="showConfirmDialog(false)">Нет</v-btn>
        <v-btn text color="red" @click="removeAllAccounts">Да</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { onMounted, Ref, ref } from 'vue';
  import { useAccountsStore } from '@/stores/accounts';
  import type { Account } from "@/types/account";
  import AccountItem from '@/components/AccountItem.ts.vue';

  const store = useAccountsStore();

  const isConfirmDialog: Ref<boolean>  = ref(false)

  onMounted(():void => store.load());

  const removeAllAccounts:Function = ():void => {
    store.removeAllAccounts()
    showConfirmDialog(false)
  }

  const removeAccount:Function = (id: string):void => {
    store.removeAccount(id)
  }

  const updateAccount = (value: Account):void => {
    store.updateAccount(value)
  }

  const addAccount:Function = ():void => {
    store.addAccount()
  }

  const showConfirmDialog:Function = (value: boolean):void => {
    isConfirmDialog.value = value
  }
</script>
