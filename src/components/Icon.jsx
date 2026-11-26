export default function Icon({ children, className = '' }) {
  return (
    <span aria-hidden="true" className={`icon ${className}`}>
      {children}
    </span>
  )
}
