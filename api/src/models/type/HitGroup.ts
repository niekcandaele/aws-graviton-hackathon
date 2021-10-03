/**
 * @see https://github.com/ValveSoftware/source-sdk-2013/blob/master/mp/src/game/shared/shareddefs.h#L337
 */

export enum HitGroup {
  HITGROUP_GENERIC = 0,
  HITGROUP_HEAD = 1,
  HITGROUP_CHEST = 2,
  HITGROUP_STOMACH = 3,
  HITGROUP_LEFTARM = 4,
  HITGROUP_RIGHTARM = 5,
  HITGROUP_LEFTLEG = 6,
  HITGROUP_RIGHTLEG = 7,
  HITGROUP_GEAR = 10,			// alerts NPC, but doesn't do damage or bleed (1/100th damage)
}

export const HitGroupMapper = {
  [HitGroup.HITGROUP_GENERIC]: 'GENERIC',
  [HitGroup.HITGROUP_HEAD]: 'HEAD',
  [HitGroup.HITGROUP_CHEST]: 'CHEST',
  [HitGroup.HITGROUP_STOMACH]: 'STOMACH',
  [HitGroup.HITGROUP_LEFTARM]: 'LEFTARM',
  [HitGroup.HITGROUP_RIGHTARM]: 'RIGHTARM',
  [HitGroup.HITGROUP_LEFTLEG]: 'LEFTLEG',
  [HitGroup.HITGROUP_RIGHTLEG]: 'RIGHTLEG',
  [HitGroup.HITGROUP_GEAR]: 'GEAR',
};