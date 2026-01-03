export function formatCurrency(value: number, locale = 'pt-BR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: locale === 'pt-BR' ? 'BRL' : locale === 'en' ? 'USD' : 'EUR',
  }).format(value)
}

export function formatDate(date: string | Date, locale = 'pt-BR'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj)
}

export function formatDocument(value: string, country: string): string {
  const numbers = value.replace(/\D/g, '')

  if (country === 'BR') {
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    }
  }

  return numbers
}

export function formatPhone(value: string, country: string): string {
  const numbers = value.replace(/\D/g, '')

  if (country === 'BR') {
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1')
  }

  return numbers
}

export function formatPostalCode(value: string, country: string): string {
  const numbers = value.replace(/\D/g, '')

  if (country === 'BR') {
    return numbers.replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{3})\d+?$/, '$1')
  }

  return numbers
}

