export interface Address {
  street: string
  city: string
  state: string
  postalCode: string
}

export const addressService = {
  async searchCep(cep: string): Promise<Address | null> {
    const cleanCep = cep.replace(/\D/g, '')
    
    if (cleanCep.length !== 8) {
      return null
    }
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const mockAddresses: Record<string, Address> = {
      '01310100': {
        street: 'Avenida Paulista',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01310-100',
      },
      '20040020': {
        street: 'Praça Mauá',
        city: 'Rio de Janeiro',
        state: 'RJ',
        postalCode: '20040-020',
      },
      '30130100': {
        street: 'Avenida Afonso Pena',
        city: 'Belo Horizonte',
        state: 'MG',
        postalCode: '30130-100',
      },
    }
    
    const found = mockAddresses[cleanCep]
    if (found) {
      return found
    }
    
    return null
  },
  
  getPostalCodeLabel(country: string): string {
    switch (country) {
      case 'BR':
        return 'CEP'
      case 'US':
        return 'ZIP Code'
      case 'GB':
        return 'Postcode'
      case 'IE':
        return 'Eircode'
      case 'PT':
        return 'Código Postal'
      case 'ES':
        return 'Código Postal'
      case 'FR':
        return 'Code Postal'
      case 'DE':
        return 'Postleitzahl'
      case 'IT':
        return 'CAP'
      case 'CA':
        return 'Postal Code'
      case 'AU':
        return 'Postcode'
      case 'MX':
        return 'Código Postal'
      case 'AR':
        return 'Código Postal'
      case 'CL':
        return 'Código Postal'
      default:
        return 'CEP/Código Postal'
    }
  },
  
  getDocumentLabel(country: string): string {
    switch (country) {
      case 'BR':
        return 'CPF'
      case 'US':
        return 'SSN'
      case 'GB':
        return 'NINO'
      case 'IE':
        return 'PPS Number'
      case 'PT':
        return 'NIF'
      case 'ES':
        return 'NIF'
      case 'FR':
        return 'Numéro Fiscal'
      case 'DE':
        return 'Steuer-ID'
      case 'IT':
        return 'Codice Fiscale'
      case 'CA':
        return 'SIN'
      case 'AU':
        return 'TFN'
      case 'MX':
        return 'RFC'
      case 'AR':
        return 'CUIL'
      case 'CL':
        return 'RUT'
      default:
        return 'Documento'
    }
  },
  
  getStateLabel(country: string): string {
    switch (country) {
      case 'BR':
        return 'Estado'
      case 'US':
        return 'State'
      case 'GB':
        return 'County'
      case 'IE':
        return 'County'
      case 'PT':
        return 'Distrito'
      case 'ES':
        return 'Provincia'
      case 'FR':
        return 'Région'
      case 'DE':
        return 'Bundesland'
      case 'IT':
        return 'Regione'
      case 'CA':
        return 'Province'
      case 'AU':
        return 'State'
      case 'MX':
        return 'Estado'
      case 'AR':
        return 'Provincia'
      case 'CL':
        return 'Región'
      default:
        return 'Estado/Região'
    }
  },
  
  validatePostalCode(postalCode: string, country: string): boolean {
    const clean = postalCode.replace(/\D/g, '')
    
    switch (country) {
      case 'BR':
        return clean.length === 8
      case 'US':
        return clean.length === 5 || clean.length === 9
      case 'GB':
        return clean.length >= 5 && clean.length <= 7
      case 'IE':
        return clean.length === 7
      case 'PT':
        return clean.length === 7 || clean.length === 8
      case 'ES':
        return clean.length === 5
      case 'FR':
        return clean.length === 5
      case 'DE':
        return clean.length === 5
      case 'IT':
        return clean.length === 5
      case 'CA':
        return clean.length === 6
      case 'AU':
        return clean.length === 4
      case 'MX':
        return clean.length === 5
      case 'AR':
        return clean.length === 4 || clean.length === 8
      case 'CL':
        return clean.length === 7
      default:
        return clean.length >= 4
    }
  },
  
  validateDocument(document: string, country: string): boolean {
    const clean = document.replace(/\D/g, '')
    
    switch (country) {
      case 'BR':
        return clean.length === 11
      case 'US':
        return clean.length === 9
      case 'GB':
        return clean.length >= 8 && clean.length <= 9
      case 'IE':
        return clean.length >= 7
      case 'PT':
        return clean.length === 9
      case 'ES':
        return clean.length === 9
      case 'FR':
        return clean.length === 13
      case 'DE':
        return clean.length === 11
      case 'IT':
        return clean.length === 16
      case 'CA':
        return clean.length === 9
      case 'AU':
        return clean.length === 9
      case 'MX':
        return clean.length >= 10 && clean.length <= 13
      case 'AR':
        return clean.length === 11
      case 'CL':
        return clean.length === 9 || clean.length === 10
      default:
        return clean.length >= 5
    }
  },
  
  formatPostalCode(postalCode: string, country: string): string {
    const clean = postalCode.replace(/\D/g, '')
    
    switch (country) {
      case 'BR':
        return clean.replace(/(\d{5})(\d{3})/, '$1-$2')
      case 'US':
        return clean.length === 9 ? clean.replace(/(\d{5})(\d{4})/, '$1-$2') : clean
      case 'GB':
        return clean.replace(/(\d{2,3})(\d{3})/, '$1 $2')
      case 'IE':
        return clean.replace(/(\d{3})(\d{4})/, '$1 $2')
      case 'PT':
        return clean.replace(/(\d{4})(\d{3})/, '$1-$2')
      case 'ES':
      case 'FR':
      case 'DE':
      case 'IT':
        return clean
      case 'CA':
        return clean.replace(/(\d{3})(\d{3})/, '$1 $2')
      case 'AU':
        return clean
      case 'MX':
        return clean.replace(/(\d{5})/, '$1')
      case 'AR':
        return clean
      case 'CL':
        return clean.replace(/(\d{3})(\d{4})/, '$1.$2')
      default:
        return clean
    }
  },
  
  formatDocument(document: string, country: string): string {
    const clean = document.replace(/\D/g, '')
    
    switch (country) {
      case 'BR':
        return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
      case 'US':
        return clean.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3')
      case 'GB':
        return clean
      case 'IE':
        return clean
      case 'PT':
        return clean.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
      case 'ES':
        return clean.replace(/(\d{1})(\d{8})/, '$1.$2')
      case 'FR':
        return clean.replace(/(\d{1})(\d{2})(\d{2})(\d{2})(\d{3})(\d{3})/, '$1 $2 $3 $4 $5 $6')
      case 'DE':
        return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4')
      case 'IT':
        return clean.toUpperCase()
      case 'CA':
        return clean.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
      case 'AU':
        return clean.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
      case 'MX':
        return clean
      case 'AR':
        return clean.replace(/(\d{2})(\d{8})(\d{1})/, '$1-$2-$3')
      case 'CL':
        return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4')
      default:
        return clean
    }
  },
  
  formatPhone(phone: string, country: string): string {
    const clean = phone.replace(/\D/g, '')
    
    switch (country) {
      case 'BR':
        return clean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
      case 'US':
      case 'CA':
        return clean.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
      case 'GB':
        return clean.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')
      case 'IE':
        return clean.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')
      case 'PT':
        return clean.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
      case 'ES':
        return clean.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
      case 'FR':
        return clean.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')
      case 'DE':
        return clean.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')
      case 'IT':
        return clean.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')
      case 'AU':
        return clean.replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2 $3')
      case 'MX':
        return clean.replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2 $3')
      case 'AR':
        return clean.replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2 $3')
      case 'CL':
        return clean.replace(/(\d{1})(\d{4})(\d{4})/, '$1 $2 $3')
      default:
        return clean
    }
  },
}

