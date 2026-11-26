export const WHATSAPP_NUMBER = '393793603321'
export const WHATSAPP_DISPLAY_NUMBER = '+39 379 360 3321'

export function getWhatsAppHref(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export const GENERAL_WHATSAPP_MESSAGE =
  'Ciao Teresa, vorrei parlare del mio progetto di design e sviluppo digitale.'
