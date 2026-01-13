import { BirthType, BirthNotification } from '@app/api';
import { InsertAnimalTableInput } from '../../../../../../database';
import { isUUIDv4 } from '@common/core';

export function mapBirthNotificationToInsertAnimalInput(bn: BirthNotification, birthType: BirthType): InsertAnimalTableInput {

  if (!isUUIDv4(bn.sex.id)) {
    throw new Error("sex.id is not a UUIDv4 key: " + bn.sex.id);
  }

  if (!isUUIDv4(bn.birthType.id)) {
    throw new Error("birthtype.id is not a UUIDv4 key: " + bn.birthType.id);
  }

  if (!isUUIDv4(bn.weightUnits.id)) {
    throw new Error("weightUnits.id is not a UUIDv4 key: " + bn.weightUnits.id);
  }

  if (!isUUIDv4(bn.sireId)) {
    throw new Error("sireId is not a UUIDv4 key: " + bn.sireId);
  }

  if (!isUUIDv4(bn.damId)) {
    throw new Error("damId is not a UUIDv4 key: " + bn.damId);
  }

  return {
    name: bn.animalName,
    sexId: bn.sex.id,
    birthdate: bn.birthdate,
    birthTime: "00:00:00", // for now, set at midnight
    birthType: birthType,
    birthWeight: bn.weight,
    birthWeightUnitsId: bn.weightUnits.id,
    birthOrder: 1,
    rearType: null,
    weanedDate: null,
    deathDate: null,
    deathReasonId: null,
    sireId: bn.sireId,
    damId: bn.damId,
    handReared: false, // todo --> this information is NOT present in the birth JSON as of now
  };
}
