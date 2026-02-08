import { setupWorker } from 'msw/browser'

import { handlers } from '@/shared/mocks/handlers'

export const worker = setupWorker(...handlers)
