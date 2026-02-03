<template>
  <v-row align="center" class="mb-2" dense>
    <!-- Метка -->
    <v-col cols="3">
      <v-text-field
        label="Метка"
        v-model="labelsText"
        hide-details
        density="compact"
        :counter="50"
        :rules="[maxLength50]"
        @blur="handleLabelsBlur"
      />
    </v-col>

    <!-- Тип записи -->
    <v-col cols="2">
      <v-select
        label="Тип записи"
        v-model="localAccount.type"
        hide-details
        density="compact"
        :items="typeOptions"
        @update:model-value="handleTypeChange"
      />
    </v-col>

    <!-- Логин -->
    <v-col :cols="getLoginCols">
      <v-text-field
        label="Логин*"
        v-model.trim="localAccount.login"
        hide-details
        density="compact"
        :error="localAccount.errors.login"
        :counter="100"
        :rules="[requiredField, maxLength100]"
        @blur="handleLoginBlur"
      />
    </v-col>

    <!-- Пароль -->
    <v-col cols="3" v-if="localAccount.type === 'LOCAL'">
      <v-text-field
        label="Пароль*"
        v-model.trim="localAccount.password"
        hide-details
        density="compact"
        :type="getPasswordType"
        :error="localAccount.errors.password"
        :append-inner-icon="getPasswordIcon"
        :counter="100"
        :rules="[requiredField, maxLength100]"
        @blur="handlePasswordBlur"
        @click:append-inner="togglePassword"
      />
    </v-col>

    <!-- Удалить -->
    <v-col cols="1" class="text-center">
      <v-btn
        icon="mdi-delete"
        color="red"
        variant="text"
        @click="emitRemove"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import {computed, ComputedRef, Ref, ref, WritableComputedRef} from 'vue';
import type {Account} from '@/types/account';

const props = defineProps<{ account: Account }>();

  const emit = defineEmits(['update', 'remove']);

  const localAccount: Ref<Account> = ref({ ...props.account });
  const showPassword: Ref<boolean> = ref(false);

  const typeOptions = [
    { title: 'LDAP', value: 'LDAP' },
    { title: 'LOCAL', value: 'LOCAL' }
  ];

  const requiredField = (value: string): boolean | string => {
    return !!value || 'Обязательное поле';
  };

  const maxLength50 = (value: string): boolean | string => {
    return !value || value.length <= 50 || 'Максимум 50 символов';
  };

  const maxLength100 = (value: string): boolean | string => {
    return !value || value.length <= 100 || 'Максимум 100 символов';
  };

  const labelsText: WritableComputedRef<string> = computed({
    get: () => {
      return localAccount.value.labels.map(l => l.text).join('; ');
    },
    set: (value: string) => {
      if (value.length > 50) {
        value = value.substring(0, 50);
      }

      localAccount.value.labels = value
        .split(';')
        .map(v => v.trim())
        .filter(v => v !== '')
        .slice(0, 10)
        .map(v => ({text: v}));
    },
  });

  const handleLabelsBlur = (): void => {
    emit('update', { ...localAccount.value });
  };

  const handleTypeChange = (): void => {
    if (localAccount.value.type !== 'LOCAL') {
      localAccount.value.password = null;
    }
    validateAccount('type');
    emit('update', { ...localAccount.value });
  };

  const handleLoginBlur = (): void => {
    if (localAccount.value.login && localAccount.value.login.length > 100) {
      localAccount.value.login = localAccount.value.login.substring(0, 100);
    }
    validateAccount('login');
    emit('update', { ...localAccount.value });
  };

  const handlePasswordBlur = (): void => {
    if (localAccount.value.password && localAccount.value.password.length > 100) {
      localAccount.value.password = localAccount.value.password.substring(0, 100);
    }
    validateAccount('password');
    emit('update', { ...localAccount.value });
  };

  const getLoginCols: ComputedRef<number> = computed((): number => {
    return localAccount.value.type === 'LOCAL' ? 3 : 6;
  });

  const getPasswordType: ComputedRef<string> = computed((): string => {
    return showPassword.value ? 'text' : 'password';
  });

  const getPasswordIcon: ComputedRef<string> = computed((): string => {
    return showPassword.value ? 'mdi-eye' : 'mdi-eye-off';
  });

  const emitRemove = (): void => {
    emit('remove');
  };

  const togglePassword = (): void => {
    showPassword.value = !showPassword.value;
  };

  const validateAccount = (type: string): void => {
    const acc = localAccount.value;

    if (type === 'login') {
      acc.errors.login = !acc.login || acc.login.length === 0

      if (acc.login && acc.login.length > 100) {
        acc.errors.login = true;
      }
    }

    if (type === 'password') {
      acc.errors.password = acc.type === 'LOCAL' ? (!acc.password || acc.password.length === 0) : false

      if (acc.type === 'LOCAL' && acc.password && acc.password.length > 100) {
        acc.errors.password = true;
      }
    }
  };
</script>