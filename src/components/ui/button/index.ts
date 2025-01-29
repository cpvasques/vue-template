import { cva, type VariantProps } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-base font-medium ring-offset-background transition-colors focus-visible:outline-none  disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-blue-700 text-white hover:bg-blue-700/90',
        destructive: 'bg-red-700 text-destructive-foreground hover:bg-red-700/90',
        outline: 'border border-input bg-white hover:bg-gray-400 text-black',
        secondary: 'bg-green-700 text-white border border-green-700 hover:bg-green-700/10',
        disabled: '!cursor-not-allowed bg-gray-500 text-white',
      },
      size: {
        default: 'h-10 px-4 py-2',
        xs: 'h-7 rounded px-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
