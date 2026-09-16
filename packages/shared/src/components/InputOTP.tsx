import { useContext, type ComponentProps } from 'react'
import { OTPInput, OTPInputContext } from 'input-otp'

export function InputOTP({
  className,
  containerClassName,
  ...props
}: ComponentProps<typeof OTPInput> & { containerClassName?: string }) {
  const containerClasses = ['flex w-full items-center has-disabled:opacity-50', containerClassName]
    .filter(Boolean)
    .join(' ')
  const inputClasses = ['disabled:cursor-not-allowed', className].filter(Boolean).join(' ')

  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={containerClasses}
      spellCheck={false}
      className={inputClasses}
      {...props}
    />
  )
}

export function InputOTPGroup({ className, ...props }: ComponentProps<'div'>) {
  const classes = [
    'flex flex-1 items-center rounded-lg',
    'has-aria-invalid:border-danger has-aria-invalid:ring-3 has-aria-invalid:ring-danger/20',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <div data-slot="input-otp-group" className={classes} {...props} />
}

export function InputOTPSlot({
  index,
  className,
  ...props
}: ComponentProps<'div'> & { index: number }) {
  const { slots } = useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = slots[index] ?? {}

  const classes = [
    'relative flex h-12 flex-1 items-center justify-center border-y border-r border-line text-xl transition-all outline-none',
    'first:rounded-l-lg first:border-l last:rounded-r-lg',
    'bg-surface',
    'aria-invalid:border-danger',
    'data-[active=true]:z-10 data-[active=true]:border-brand data-[active=true]:ring-3 data-[active=true]:ring-brand/50',
    'data-[active=true]:aria-invalid:border-danger data-[active=true]:aria-invalid:ring-danger/20',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div data-slot="input-otp-slot" data-active={isActive} className={classes} {...props}>
      {char}
      {hasFakeCaret ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-px animate-caret-blink bg-ink" />
        </div>
      ) : null}
    </div>
  )
}

export function InputOTPSeparator({ ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-otp-separator"
      role="separator"
      className="flex h-12 flex-none items-center px-1 text-ink-muted"
      {...props}
    >
      <span aria-hidden="true">–</span>
    </div>
  )
}