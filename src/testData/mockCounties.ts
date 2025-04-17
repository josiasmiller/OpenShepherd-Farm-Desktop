import type { County } from '../database';
import { Success } from '../shared/results/resultTypes';

export const mockCounties = new Success<County[]>([
  { id: '1', name: 'Travis County',   state_id: 'TX' },
  { id: '2', name: 'Maricopa County', state_id: 'AZ' },
]);
