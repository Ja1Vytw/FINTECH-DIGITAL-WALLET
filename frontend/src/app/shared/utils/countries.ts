export interface CountryConfig {
  code: string
  name: string
  postalCodeLabel: string
  documentLabel: string
  stateLabel?: string
  hasStates: boolean
}

export const COUNTRIES: CountryConfig[] = [
  {
    code: 'BR',
    name: 'Brasil',
    postalCodeLabel: 'CEP',
    documentLabel: 'CPF',
    stateLabel: 'Estado',
    hasStates: true,
  },
  {
    code: 'US',
    name: 'United States',
    postalCodeLabel: 'ZIP Code',
    documentLabel: 'SSN',
    stateLabel: 'State',
    hasStates: true,
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    postalCodeLabel: 'Postcode',
    documentLabel: 'National Insurance Number',
    hasStates: false,
  },
  {
    code: 'IE',
    name: 'Ireland',
    postalCodeLabel: 'Eircode',
    documentLabel: 'PPS Number',
    hasStates: false,
  },
  {
    code: 'PT',
    name: 'Portugal',
    postalCodeLabel: 'Código Postal',
    documentLabel: 'NIF',
    hasStates: false,
  },
  {
    code: 'ES',
    name: 'España',
    postalCodeLabel: 'Código Postal',
    documentLabel: 'DNI',
    hasStates: false,
  },
  {
    code: 'FR',
    name: 'France',
    postalCodeLabel: 'Code Postal',
    documentLabel: 'Numéro de Sécurité Sociale',
    hasStates: false,
  },
  {
    code: 'DE',
    name: 'Deutschland',
    postalCodeLabel: 'Postleitzahl',
    documentLabel: 'Steuer-ID',
    hasStates: false,
  },
  {
    code: 'IT',
    name: 'Italia',
    postalCodeLabel: 'Codice Postale',
    documentLabel: 'Codice Fiscale',
    hasStates: false,
  },
  {
    code: 'CA',
    name: 'Canada',
    postalCodeLabel: 'Postal Code',
    documentLabel: 'SIN',
    stateLabel: 'Province',
    hasStates: true,
  },
  {
    code: 'AU',
    name: 'Australia',
    postalCodeLabel: 'Postcode',
    documentLabel: 'TFN',
    stateLabel: 'State',
    hasStates: true,
  },
  {
    code: 'MX',
    name: 'México',
    postalCodeLabel: 'Código Postal',
    documentLabel: 'RFC',
    stateLabel: 'Estado',
    hasStates: true,
  },
  {
    code: 'AR',
    name: 'Argentina',
    postalCodeLabel: 'Código Postal',
    documentLabel: 'DNI',
    stateLabel: 'Provincia',
    hasStates: true,
  },
  {
    code: 'CL',
    name: 'Chile',
    postalCodeLabel: 'Código Postal',
    documentLabel: 'RUT',
    hasStates: false,
  },
]

export function getCountryConfig(code: string): CountryConfig | undefined {
  return COUNTRIES.find((c) => c.code === code)
}

