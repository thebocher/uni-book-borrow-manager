import { computed } from "vue";
import { storage } from "./storage";

export const isAuthorized = computed(() => storage.access_token.value !== '');