import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--error-bg": "hsl(0, 72%, 51%)",
          "--error-text": "white",
          "--info-bg": "hsl(221, 91%, 60%)",
          "--info-text": "white",
          "--warning-bg": "hsl(32, 95%, 44%)",
          "--warning-text": "white",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
