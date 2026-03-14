/**
 * Phone State Detection Composable - Presentation Layer
 * Detects Brazilian state from phone number DDD
 */

import { computed, type Ref } from 'vue'
import { extractDDD, getStateByDDD, type BrazilianState } from '@/domain/phone/entities/BrazilianState'

export function usePhoneState(phoneNumber: Ref<string>) {
  const ddd = computed(() => extractDDD(phoneNumber.value))
  
  const state = computed<BrazilianState | undefined>(() => {
    if (!ddd.value) return undefined
    return getStateByDDD(ddd.value)
  })
  
  const stateCode = computed(() => state.value?.code)
  const stateName = computed(() => state.value?.name)
  const stateFlag = computed(() => state.value?.flag)
  const stateRegion = computed(() => state.value?.region)
  
  return {
    ddd,
    state,
    stateCode,
    stateName,
    stateFlag,
    stateRegion,
  }
}
