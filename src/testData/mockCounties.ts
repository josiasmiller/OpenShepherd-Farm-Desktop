import type { County } from '@app/api';
import { Success } from '@common/core';

export const mockCounties = new Success<County[]>([
  { id: '1', name: 'Travis County',   state_id: 'TX' },
  { id: '2', name: 'Maricopa County', state_id: 'AZ' },
]);
