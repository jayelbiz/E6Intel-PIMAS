interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`surface-card p-4 border-round shadow-1 ${className}`}>
      {children}
    </div>
  )
}

Card.Header = function CardHeader({ 
  children,
  className = ''
}: CardProps) {
  return (
    <div className={`flex align-items-center justify-content-between mb-3 ${className}`}>
      {children}
    </div>
  )
}

Card.Title = function CardTitle({
  children,
  className = ''
}: CardProps) {
  return (
    <h3 className={`text-lg font-medium m-0 ${className}`}>
      {children}
    </h3>
  )
}

Card.Description = function CardDescription({
  children,
  className = ''
}: CardProps) {
  return (
    <p className={`text-sm text-color-secondary m-0 ${className}`}>
      {children}
    </p>
  )
}

Card.Content = function CardContent({
  children,
  className = ''
}: CardProps) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

Card.Footer = function CardFooter({
  children,
  className = ''
}: CardProps) {
  return (
    <div className={`flex align-items-center mt-4 pt-4 border-top-1 surface-border ${className}`}>
      {children}
    </div>
  )
}