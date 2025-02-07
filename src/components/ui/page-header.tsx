interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export function PageHeader({ 
  title,
  description,
  children,
  className = ''
}: PageHeaderProps) {
  return (
    <div className={`pb-4 ${className}`}>
      <div className="flex justify-content-between align-items-center">
        <div>
          <h1 className="text-3xl font-bold m-0">{title}</h1>
          {description && (
            <p className="mt-2 text-color-secondary m-0">
              {description}
            </p>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}