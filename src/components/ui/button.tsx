
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 overflow-hidden transform hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0",
  {
    variants: {
      variant: {
        default: "bg-neural-gradient text-primary-foreground shadow-neural hover:shadow-glow",
        destructive: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-neural hover:shadow-glow",
        outline: "border-2 border-primary/20 bg-background/50 backdrop-blur-sm shadow-glass hover:shadow-glow hover:bg-primary/5 hover:border-primary/40",
        secondary: "bg-secondary/80 backdrop-blur-sm text-secondary-foreground shadow-glass hover:shadow-neural hover:bg-secondary",
        ghost: "hover:bg-primary/10 hover:text-primary transition-all duration-300",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-glow",
        neural: "bg-neural-gradient text-white shadow-neural hover:shadow-glow animate-neural-pulse",
        cyber: "bg-transparent border-2 border-neural-primary text-neural-primary hover:bg-neural-primary hover:text-background shadow-cyber",
        neon: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-neon hover:shadow-glow animate-glow-pulse",
        hologram: "bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 backdrop-blur-md border border-white/20 text-foreground hover:from-primary/30 hover:via-secondary/30 hover:to-accent/30 shadow-hologram",
      },
      size: {
        default: "h-11 px-6 py-2 rounded-xl",
        sm: "h-9 px-4 text-sm rounded-lg",
        lg: "h-12 px-8 text-base rounded-xl",
        icon: "h-11 w-11 rounded-xl",
        xl: "h-14 px-10 text-lg rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
