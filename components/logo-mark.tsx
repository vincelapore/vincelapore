'use client'

const LOGO_PATH =
  'M285.904 203.227L490.345 120.628L572.684 324.423L368.242 407.021L368.473 407.591L164.677 489.93L0 82.3389L203.796 0L285.904 203.227Z'

export function LogoMark({
  className = '',
  fill = 'currentColor',
}: {
  className?: string
  fill?: string
}) {
  return (
    <svg
      width="573"
      height="490"
      viewBox="-10 -10 593 510"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path d={LOGO_PATH} fill={fill} />
    </svg>
  )
}
