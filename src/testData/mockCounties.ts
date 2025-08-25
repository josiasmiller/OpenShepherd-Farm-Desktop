import type { County } from '../main/database';
import { Success } from 'packages/core/src/resultTypes';

export const mockCounties = new Success<County[]>([
  { id: '1', name: 'Travis County',   state_id: 'TX' },
  { id: '2', name: 'Maricopa County', state_id: 'AZ' },
]);
