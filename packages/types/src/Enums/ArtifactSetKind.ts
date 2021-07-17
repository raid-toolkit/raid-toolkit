/**
 */
export enum ArtifactSetKind {
  None = 0, // None
  Life = 1, // Hp
  Attack = 2, // AttackPower
  Defense = 3, // Defense
  Speed = 4, // AttackSpeed
  CriticalChance = 5, // CriticalChance
  CriticalDamage = 6, // CriticalDamage
  Accuracy = 7, // Accuracy
  Resistance = 8, // Resistance
  Lifesteal = 9, // LifeDrain
  Fury = 10, // DamageIncreaseOnHpDecrease
  Daze = 11, // SleepChance
  Cursed = 12, // BlockHealChance
  Frost = 13, // FreezeRateOnDamageReceived
  Frenzy = 14, // Stamina (?)
  Regeneration = 15, // Heal
  Immunity = 16, // BlockDebuff
  Shield = 17, // Shield
  Relentless = 18, // GetExtraTurn
  Savage = 19, // IgnoreDefense
  Destroy = 20, // DecreaseMaxHp
  Stun = 21, // StunChance
  Toxic = 22, // DotRate
  Taunting = 23, // ProvokeChance
  Retaliation = 24, // Counterattack
  Avenging = 25, // CounterattackOnCrit
  Stalwart = 26, // AoeDamageDecrease
  Reflex = 27, // CooldownReductionChance
  Curing = 28, // CriticalHealMultiplier
  Cruel = 29, // AttackPowerAndIgnoreDefense
  Immortal = 30, // HpAndHeal
  DivineOffense = 31, // ShieldAndAttackPower
  DivineCriticalRate = 32, // ShieldAndCriticalChance
  DivineLife = 33, // ShieldAndHp
  DivineSpeed = 34, // ShieldAndSpeed
  SwiftParry = 35, // UnkillableAndSpdAndCrDmg
  Deflection = 36, // BlockReflectDebuffAndHpAndDef
  Resiliance = 37, // HpAndDefence
  Perception = 38, // AccuracyAndSpeed
  Affinitybreaker = 39, // CritDmgAndTransformWeekIntoCritHit
  Untouchable = 40, // ResistanceAndBlockDebuff
  Fatal = 41, // AttackAndCritRate
  Frostbite = 42, // FreezeResistAndRate
  Bloodthirst = 43, // CritRateAndLifeDrain
  Guardian = 44, // PassiveShareDamageAndHeal

  // accessory sets
  Refresh = 1000, // IgnoreCooldown
  Cleansing = 1001, // RemoveDebuff
  Bloodshield = 1002, // ShieldAccessory
  Reaction = 1003, // ChangeHitType
}
