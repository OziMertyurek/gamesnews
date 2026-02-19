import type { GameItem } from '../data/siteContent'

export interface HardwareModel {
  name: string
  score: number
}

export interface GameSystemRequirements {
  cpuMinScore: number
  cpuRecScore: number
  gpuMinScore: number
  gpuRecScore: number
  ramMinGb: number
  ramRecGb: number
  storageGb: number
  directx: string
}

export interface UserSystemProfile {
  cpuModel: string
  gpuModel: string
  cpuScore: number
  gpuScore: number
  ramGb: number
  resolution: '1080p' | '1440p' | '4k'
}

export type CompatibilityStatus = 'karsilar' | 'sinirda' | 'karsilamaz'

export interface CompatibilityResult {
  status: CompatibilityStatus
  targetFps: 30 | 60
  avgFpsLow: number
  avgFpsMedium: number
  avgFpsHigh: number
  suggestedPreset: 'Dusuk' | 'Orta' | 'Yuksek' | 'Ultra' | 'Calistirmaz'
  notes: string[]
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function normalizeHardwareName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function toScore(value: number) {
  return clamp(value, 2, 10)
}

function withScore(names: string[], score: number): HardwareModel[] {
  return names.map((name) => ({ name, score }))
}

function uniqModels(models: HardwareModel[]): HardwareModel[] {
  const map = new Map<string, HardwareModel>()
  for (const model of models) {
    map.set(normalizeHardwareName(model.name), model)
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name))
}

export const cpuModels: HardwareModel[] = uniqModels([
  ...withScore([
    'Intel Core i5-2500K',
    'Intel Core i7-2600K',
    'Intel Core i5-3470',
    'Intel Core i5-3570K',
    'Intel Core i7-3770',
    'Intel Core i7-3770K',
    'Intel Core i5-4430',
    'Intel Core i5-4460',
    'Intel Core i5-4570',
    'Intel Core i5-4590',
    'Intel Core i5-4670K',
    'Intel Core i5-4690K',
    'Intel Core i7-4770',
    'Intel Core i7-4790',
    'Intel Core i7-4790K',
  ], 3),
  ...withScore([
    'Intel Core i3-6100',
    'Intel Core i5-6400',
    'Intel Core i5-6500',
    'Intel Core i5-6600K',
    'Intel Core i7-6700',
    'Intel Core i7-6700K',
    'Intel Core i3-7100',
    'Intel Core i5-7400',
    'Intel Core i5-7500',
    'Intel Core i5-7600K',
    'Intel Core i7-7700',
    'Intel Core i7-7700K',
    'Intel Core i3-8100',
    'Intel Core i3-8350K',
    'Intel Core i5-8400',
    'Intel Core i5-8500',
    'Intel Core i5-8600K',
    'Intel Core i7-8700',
    'Intel Core i7-8700K',
    'Intel Core i3-9100F',
    'Intel Core i5-9400F',
    'Intel Core i5-9600K',
    'Intel Core i7-9700',
    'Intel Core i7-9700K',
    'Intel Core i9-9900',
    'Intel Core i9-9900K',
  ], 5),
  ...withScore([
    'Intel Core i3-10100',
    'Intel Core i3-10100F',
    'Intel Core i5-10400',
    'Intel Core i5-10400F',
    'Intel Core i5-10600K',
    'Intel Core i7-10700',
    'Intel Core i7-10700K',
    'Intel Core i9-10900',
    'Intel Core i9-10900K',
    'Intel Core i5-11400',
    'Intel Core i5-11400F',
    'Intel Core i5-11600K',
    'Intel Core i7-11700',
    'Intel Core i7-11700K',
    'Intel Core i9-11900',
    'Intel Core i9-11900K',
  ], 6),
  ...withScore([
    'Intel Core i3-12100',
    'Intel Core i3-12100F',
    'Intel Core i5-12400',
    'Intel Core i5-12400F',
    'Intel Core i5-12500',
    'Intel Core i5-12600K',
    'Intel Core i7-12700',
    'Intel Core i7-12700K',
    'Intel Core i9-12900',
    'Intel Core i9-12900K',
    'Intel Core i5-13400',
    'Intel Core i5-13400F',
    'Intel Core i5-13500',
    'Intel Core i5-13600K',
    'Intel Core i7-13700',
    'Intel Core i7-13700K',
    'Intel Core i9-13900',
    'Intel Core i9-13900K',
    'Intel Core i5-14400',
    'Intel Core i5-14400F',
    'Intel Core i5-14500',
    'Intel Core i5-14600K',
    'Intel Core i7-14700',
    'Intel Core i7-14700K',
    'Intel Core i9-14900',
    'Intel Core i9-14900K',
  ], 8),
  ...withScore([
    'Intel Core Ultra 5 225',
    'Intel Core Ultra 5 225F',
    'Intel Core Ultra 7 265',
    'Intel Core Ultra 7 265K',
    'Intel Core Ultra 9 285',
    'Intel Core Ultra 9 285K',
  ], 9),
  ...withScore([
    'AMD FX-8350',
    'AMD FX-8370',
    'AMD FX-9590',
    'AMD Ryzen 3 1200',
    'AMD Ryzen 3 1300X',
    'AMD Ryzen 5 1400',
    'AMD Ryzen 5 1500X',
    'AMD Ryzen 5 1600',
    'AMD Ryzen 5 1600X',
    'AMD Ryzen 7 1700',
    'AMD Ryzen 7 1700X',
    'AMD Ryzen 7 1800X',
    'AMD Ryzen 3 2200G',
    'AMD Ryzen 5 2400G',
  ], 4),
  ...withScore([
    'AMD Ryzen 3 3100',
    'AMD Ryzen 3 3300X',
    'AMD Ryzen 5 2600',
    'AMD Ryzen 5 2600X',
    'AMD Ryzen 5 3600',
    'AMD Ryzen 5 3600X',
    'AMD Ryzen 5 3500X',
    'AMD Ryzen 7 2700',
    'AMD Ryzen 7 2700X',
    'AMD Ryzen 7 3700X',
    'AMD Ryzen 7 3800X',
    'AMD Ryzen 9 3900X',
    'AMD Ryzen 9 3950X',
  ], 6),
  ...withScore([
    'AMD Ryzen 5 5500',
    'AMD Ryzen 5 5600',
    'AMD Ryzen 5 5600G',
    'AMD Ryzen 5 5600X',
    'AMD Ryzen 7 5700X',
    'AMD Ryzen 7 5700X3D',
    'AMD Ryzen 7 5800',
    'AMD Ryzen 7 5800X',
    'AMD Ryzen 7 5800X3D',
    'AMD Ryzen 9 5900',
    'AMD Ryzen 9 5900X',
    'AMD Ryzen 9 5950X',
  ], 8),
  ...withScore([
    'AMD Ryzen 5 7500F',
    'AMD Ryzen 5 7600',
    'AMD Ryzen 5 7600X',
    'AMD Ryzen 7 7700',
    'AMD Ryzen 7 7700X',
    'AMD Ryzen 7 7800X3D',
    'AMD Ryzen 9 7900',
    'AMD Ryzen 9 7900X',
    'AMD Ryzen 9 7950X',
    'AMD Ryzen 9 7950X3D',
    'AMD Ryzen 5 9600X',
    'AMD Ryzen 7 9700X',
    'AMD Ryzen 9 9900X',
    'AMD Ryzen 9 9950X',
  ], 10),
])

export const gpuModels: HardwareModel[] = uniqModels([
  ...withScore([
    'NVIDIA GTX 750 Ti',
    'NVIDIA GTX 760',
    'NVIDIA GTX 770',
    'NVIDIA GTX 780',
    'NVIDIA GTX 780 Ti',
    'NVIDIA GTX 950',
    'NVIDIA GTX 960',
    'NVIDIA GTX 970',
    'NVIDIA GTX 980',
    'NVIDIA GTX 980 Ti',
  ], 3),
  ...withScore([
    'NVIDIA GTX 1050',
    'NVIDIA GTX 1050 Ti',
    'NVIDIA GTX 1060 3GB',
    'NVIDIA GTX 1060 6GB',
    'NVIDIA GTX 1070',
    'NVIDIA GTX 1070 Ti',
    'NVIDIA GTX 1080',
    'NVIDIA GTX 1080 Ti',
    'NVIDIA GTX 1650',
    'NVIDIA GTX 1650 Super',
    'NVIDIA GTX 1660',
    'NVIDIA GTX 1660 Super',
    'NVIDIA GTX 1660 Ti',
    'NVIDIA RTX 2050',
  ], 5),
  ...withScore([
    'NVIDIA RTX 2060',
    'NVIDIA RTX 2060 Super',
    'NVIDIA RTX 2070',
    'NVIDIA RTX 2070 Super',
    'NVIDIA RTX 2080',
    'NVIDIA RTX 2080 Super',
    'NVIDIA RTX 2080 Ti',
    'NVIDIA RTX 3050',
    'NVIDIA RTX 3060',
    'NVIDIA RTX 3060 Ti',
    'NVIDIA RTX 4060',
    'NVIDIA RTX 4050 Laptop',
    'NVIDIA RTX 4060 Laptop',
  ], 7),
  ...withScore([
    'NVIDIA RTX 3070',
    'NVIDIA RTX 3070 Ti',
    'NVIDIA RTX 3080',
    'NVIDIA RTX 3080 12GB',
    'NVIDIA RTX 3080 Ti',
    'NVIDIA RTX 3090',
    'NVIDIA RTX 3090 Ti',
    'NVIDIA RTX 4060 Ti',
    'NVIDIA RTX 4070',
    'NVIDIA RTX 4070 Super',
    'NVIDIA RTX 4070 Ti',
    'NVIDIA RTX 4070 Ti Super',
    'NVIDIA RTX 4080',
    'NVIDIA RTX 4080 Super',
    'NVIDIA RTX 4090',
    'NVIDIA RTX 4070 Laptop',
    'NVIDIA RTX 4080 Laptop',
    'NVIDIA RTX 4090 Laptop',
  ], 9),
  ...withScore([
    'AMD RX 460',
    'AMD RX 470',
    'AMD RX 480',
    'AMD RX 550',
    'AMD RX 560',
    'AMD RX 570',
    'AMD RX 580',
    'AMD RX 590',
    'AMD RX Vega 56',
    'AMD RX Vega 64',
  ], 4),
  ...withScore([
    'AMD RX 5500 XT',
    'AMD RX 5600 XT',
    'AMD RX 5700',
    'AMD RX 5700 XT',
    'AMD RX 6500 XT',
    'AMD RX 6600',
    'AMD RX 6600 XT',
    'AMD RX 6650 XT',
    'AMD RX 7600',
    'AMD RX 7600 XT',
  ], 6),
  ...withScore([
    'AMD RX 6700',
    'AMD RX 6700 XT',
    'AMD RX 6750 XT',
    'AMD RX 6800',
    'AMD RX 6800 XT',
    'AMD RX 6900 XT',
    'AMD RX 6950 XT',
    'AMD RX 7700 XT',
    'AMD RX 7800 XT',
    'AMD RX 7900 GRE',
    'AMD RX 7900 XT',
    'AMD RX 7900 XTX',
  ], 9),
  ...withScore([
    'Intel Arc A380',
    'Intel Arc A580',
    'Intel Arc A750',
    'Intel Arc A770',
    'Intel Arc B570',
    'Intel Arc B580',
  ], 6),
])

const cpuLookup = new Map(cpuModels.map((m) => [normalizeHardwareName(m.name), m.score]))
const gpuLookup = new Map(gpuModels.map((m) => [normalizeHardwareName(m.name), m.score]))

export function getCpuScoreByModel(model: string) {
  return cpuLookup.get(normalizeHardwareName(model)) ?? null
}

export function getGpuScoreByModel(model: string) {
  return gpuLookup.get(normalizeHardwareName(model)) ?? null
}

const genreDemandBoost: Record<string, number> = {
  shooter: 2,
  'open-world': 2,
  'role-playing': 1,
  simulation: 1,
  'racing-driving': 1,
  sports: 1,
  'music-rhythm': 0,
  platform: 0,
  puzzle: -1,
  'visual-novel': -2,
  trivia: -2,
  'interactive-art': -1,
}

function normalizeDemand(game: GameItem) {
  const yearFactor = clamp((game.releaseYear - 2015) / 3, 0, 4)
  const scoreFactor = clamp((game.score - 7) * 0.9, 0, 2)
  const genreFactor = genreDemandBoost[game.genre] ?? 0
  return clamp(3 + yearFactor + scoreFactor + genreFactor, 2, 9)
}

export function getSystemRequirements(game: GameItem): GameSystemRequirements {
  const demand = normalizeDemand(game)

  const cpuMinScore = toScore(Math.round(demand) - 1)
  const cpuRecScore = toScore(cpuMinScore + 2)
  const gpuMinScore = toScore(Math.round(demand))
  const gpuRecScore = toScore(gpuMinScore + 2)

  const ramMinGb = demand >= 7 ? 16 : demand >= 5 ? 12 : 8
  const ramRecGb = clamp(ramMinGb + 8, 16, 32)

  const storageGb = clamp(Math.round(45 + demand * 14), 35, 180)
  const directx = demand >= 7 ? 'DX12' : 'DX11'

  return {
    cpuMinScore,
    cpuRecScore,
    gpuMinScore,
    gpuRecScore,
    ramMinGb,
    ramRecGb,
    storageGb,
    directx,
  }
}

export function getGameTargetFps(game: GameItem): 30 | 60 {
  if (['shooter', 'sports', 'racing-driving', 'vehicular-combat', 'music-rhythm'].includes(game.genre)) {
    return 60
  }
  return 30
}

function estimatePresetFps(
  req: GameSystemRequirements,
  profile: UserSystemProfile,
  demand: number,
  preset: 'low' | 'medium' | 'high',
) {
  const cpuFactor = profile.cpuScore / req.cpuRecScore
  const gpuFactor = profile.gpuScore / req.gpuRecScore
  const ramFactor = profile.ramGb / req.ramRecGb

  const weighted = cpuFactor * 0.4 + gpuFactor * 0.5 + ramFactor * 0.1

  const resolutionPenalty = profile.resolution === '4k' ? 0.5 : profile.resolution === '1440p' ? 0.75 : 1
  const presetMult = preset === 'low' ? 1.38 : preset === 'medium' ? 1 : 0.76
  const demandPenalty = 1 - (demand - 2) * 0.045

  const fps = 95 * weighted * resolutionPenalty * presetMult * demandPenalty
  return Math.round(clamp(fps, 8, 240))
}

export function evaluateCompatibility(game: GameItem, profile: UserSystemProfile): CompatibilityResult {
  const req = getSystemRequirements(game)
  const demand = normalizeDemand(game)
  const targetFps = getGameTargetFps(game)

  const belowMin =
    profile.cpuScore < req.cpuMinScore ||
    profile.gpuScore < req.gpuMinScore ||
    profile.ramGb < req.ramMinGb

  const belowRec =
    profile.cpuScore < req.cpuRecScore ||
    profile.gpuScore < req.gpuRecScore ||
    profile.ramGb < req.ramRecGb

  const avgFpsLow = estimatePresetFps(req, profile, demand, 'low')
  const avgFpsMedium = estimatePresetFps(req, profile, demand, 'medium')
  const avgFpsHigh = estimatePresetFps(req, profile, demand, 'high')

  let suggestedPreset: CompatibilityResult['suggestedPreset'] = 'Calistirmaz'
  if (avgFpsHigh >= targetFps) suggestedPreset = 'Yuksek'
  else if (avgFpsMedium >= targetFps) suggestedPreset = 'Orta'
  else if (avgFpsLow >= targetFps) suggestedPreset = 'Dusuk'

  const notes: string[] = []
  if (profile.gpuScore < req.gpuMinScore) notes.push('GPU minimum gereksinimin altinda.')
  if (profile.cpuScore < req.cpuMinScore) notes.push('CPU minimum gereksinimin altinda.')
  if (profile.ramGb < req.ramMinGb) notes.push('RAM minimum gereksinimin altinda.')
  if (profile.resolution === '4k') notes.push('4K secimi FPS degerini belirgin dusurur.')

  const status: CompatibilityStatus = belowMin ? 'karsilamaz' : belowRec ? 'sinirda' : 'karsilar'

  return {
    status,
    targetFps,
    avgFpsLow,
    avgFpsMedium,
    avgFpsHigh,
    suggestedPreset,
    notes,
  }
}

export const defaultUserSystemProfile: UserSystemProfile = {
  cpuModel: 'AMD Ryzen 5 5600',
  gpuModel: 'NVIDIA RTX 3060',
  cpuScore: 8,
  gpuScore: 7,
  ramGb: 16,
  resolution: '1080p',
}
