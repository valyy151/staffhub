import { cva, VariantProps } from "class-variance-authority"
import React, { forwardRef, HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

interface HeadingProps
  extends HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {}

const headingVariants = cva("font-bold leading-tight tracking-tight", {
  variants: {
    size: {
      default: "text-3xl md:text-4xl",
      sm: "text-lg md:text-3xl",
      xs: "text-lg md:text-2xl",
      xxs: "text-base md:text-lg",
      lg: "text-4xl md:text-5xl",
    },
  },
  defaultVariants: { size: "default" },
})

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, size, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        {...props}
        className={cn(headingVariants({ size, className }))}
      >
        {children}
      </p>
    )
  },
)

Heading.displayName = "Heading"

export default Heading
