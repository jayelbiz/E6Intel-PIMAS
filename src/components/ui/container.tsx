interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`max-w-full lg:max-w-7xl mx-auto px-3 ${className}`}>
      {children}
    </div>
  )
}