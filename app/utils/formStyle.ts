export const formSwitchUi = {
  base: "data-[state=checked]:bg-brand-cyan focus-visible:outline-brand-cyan",
  icon: "group-data-[state=checked]:text-brand-cyan",
} as const;

export const formRadioGroupUi = {
  base: "focus-visible:outline-brand-cyan",
  indicator: "bg-brand-cyan",
} as const;

export const formBtnOutlineCTOUi = {
  base: "ring-brand-cyan/50 text-brand-cyan hover:bg-brand-cyan/10",
  indicator: "bg-brand-cyan",
} as const;

export const formBtnCTOUi = {
  base: "bg-brand-cyan text-white hover:bg-brand-cyan/90 active:bg-brand-cyan/80 ring-1 ring-transparent focus-visible:ring-brand-cyan/50",
  indicator: "bg-white",
} as const;

export const formBtnError = {
  base: "bg-brand-red text-white hover:bg-brand-red/90 active:bg-brand-red/80 ring-1 ring-transparent focus-visible:ring-brand-red/50",
  indicator: "bg-white",
} as const;
