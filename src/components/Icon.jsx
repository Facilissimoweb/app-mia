const fallbackGlyphs = {
  account_tree: '⑂',
  add: '+',
  architecture: '⌖',
  arrow_forward: '→',
  arrow_outward: '↗',
  auto_awesome: '✦',
  center_focus_strong: '⊙',
  chat: '◉',
  check: '✓',
  check_circle: '✓',
  chevron_right: '›',
  cloud_done: '☁',
  code: '</>',
  close: '×',
  devices: '▣',
  draw: '✎',
  edit_note: '✎',
  expand_more: '⌄',
  flag: '⚑',
  format_list_numbered: '≡',
  grid_view: '▦',
  groups: '●',
  home: '⌂',
  info: 'i',
  local_fire_department: '♨',
  north_east: '↗',
  palette: '◉',
  payments: '€',
  published_with_changes: '↻',
  receipt_long: '▤',
  remove: '−',
  schedule: '◷',
  smartphone: '▯',
  south: '↓',
  speed: '◴',
  task_alt: '✓',
  trending_up: '↗',
  verified_user: '✓',
  web: '▤',
  widgets: '▦',
}

export default function Icon({ children, className = '' }) {
  return (
    <span aria-hidden="true" className={`icon ${className}`}>
      <span className="icon-fallback">{fallbackGlyphs[children] || '•'}</span>
      <span className="icon-material">{children}</span>
    </span>
  )
}
