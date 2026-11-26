export default function EditorialPhoto({ alt, className = '', src }) {
  return (
    <figure className={`editorial-image ${className}`}>
      <img alt={alt} decoding="async" loading="lazy" src={src} />
    </figure>
  )
}
