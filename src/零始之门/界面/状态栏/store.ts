import { defineStore } from 'pinia';
import { ref } from 'vue';
import { defineMvuDataStore } from '@util/mvu';
import { Schema } from './schema';

const runtime = globalThis as Record<string, any>;
const canUseMvu =
  typeof runtime.getCurrentMessageId === 'function' &&
  typeof runtime.getVariables === 'function' &&
  typeof runtime.updateVariablesWith === 'function' &&
  typeof runtime.errorCatched === 'function';

export const useStatusDataStore = canUseMvu
  ? defineMvuDataStore(Schema, {
      type: 'message',
      message_id: runtime.getCurrentMessageId(),
    })
  : defineStore('zero-gate-status-preview', () => {
      const previewData = runtime.__ZERO_GATE_STATUS_PREVIEW_DATA__ ?? {};
      const data = ref(Schema.parse(previewData));
      return { data };
    });
