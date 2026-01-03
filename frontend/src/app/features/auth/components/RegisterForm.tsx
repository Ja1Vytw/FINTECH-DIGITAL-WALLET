import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/app/shared/components/Button'
import { Input } from '@/app/shared/components/Input'
import { Card } from '@/app/shared/components/Card'
import { Icon } from '@/app/shared/components/Icon'
import { authService } from '@/app/core/services/authService'
import { addressService } from '../services/addressService'
import './RegisterForm.css'

const countries = [
  { value: 'BR', label: 'Brasil' },
  { value: 'US', label: 'Estados Unidos' },
  { value: 'GB', label: 'Reino Unido' },
  { value: 'IE', label: 'Irlanda' },
  { value: 'PT', label: 'Portugal' },
  { value: 'ES', label: 'Espanha' },
  { value: 'FR', label: 'França' },
  { value: 'DE', label: 'Alemanha' },
  { value: 'IT', label: 'Itália' },
  { value: 'CA', label: 'Canadá' },
  { value: 'AU', label: 'Austrália' },
  { value: 'MX', label: 'México' },
  { value: 'AR', label: 'Argentina' },
  { value: 'CL', label: 'Chile' },
]

const createRegisterSchema = (country: string) => z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
  country: z.string().min(1, 'País é obrigatório'),
  postalCode: z.string().min(1, 'CEP/Código Postal é obrigatório'),
  street: z.string().min(1, 'Rua é obrigatória'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().optional(),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  document: z.string().min(1, 'Documento é obrigatório'),
  birthDate: z.string().min(1, 'Data de nascimento é obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
}).refine((data) => addressService.validatePostalCode(data.postalCode, data.country), {
  message: 'CEP/Código Postal inválido',
  path: ['postalCode'],
}).refine((data) => addressService.validateDocument(data.document, data.country), {
  message: 'Documento inválido',
  path: ['document'],
})

type RegisterFormData = z.infer<ReturnType<typeof createRegisterSchema>>

type Section = 'personal' | 'address' | 'security'

export function RegisterForm() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState('BR')
  const [loadingCep, setLoadingCep] = useState(false)
  const [currentSection, setCurrentSection] = useState<Section>('personal')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(createRegisterSchema(selectedCountry)),
    defaultValues: {
      country: 'BR',
    },
    mode: 'onChange',
  })

  const country = watch('country')
  const postalCode = watch('postalCode')
  const name = watch('name')
  const email = watch('email')
  const birthDate = watch('birthDate')
  const document = watch('document')
  const phone = watch('phone')
  const street = watch('street')
  const city = watch('city')
  const state = watch('state')
  const password = watch('password')
  const confirmPassword = watch('confirmPassword')

  useEffect(() => {
    if (country) {
      setSelectedCountry(country)
    }
  }, [country])

  const previousCepRef = useRef<string>('')
  const cepSearchedRef = useRef<boolean>(false)
  
  useEffect(() => {
    const cleanCep = postalCode?.replace(/\D/g, '') || ''
    const currentStreet = watch('street')
    
    if (cleanCep.length === 8 && 
        country === 'BR' && 
        cleanCep !== previousCepRef.current && 
        !currentStreet &&
        !cepSearchedRef.current) {
      previousCepRef.current = cleanCep
      cepSearchedRef.current = true
      handleCepSearch()
    }
    
    if (cleanCep.length < 8) {
      cepSearchedRef.current = false
    }
  }, [postalCode, country])

  const handleCepSearch = async () => {
    if (!postalCode || country !== 'BR') return
    
    const cleanCep = postalCode.replace(/\D/g, '')
    if (cleanCep.length !== 8) return

    const currentStreet = watch('street')
    if (currentStreet && currentStreet.trim() !== '') return

    setLoadingCep(true)
    try {
      const address = await addressService.searchCep(postalCode)
      if (address) {
        setValue('street', address.street, { 
          shouldValidate: true, 
          shouldDirty: true,
          shouldTouch: true 
        })
        setValue('city', address.city, { 
          shouldValidate: true, 
          shouldDirty: true,
          shouldTouch: true 
        })
        setValue('state', address.state, { 
          shouldValidate: true, 
          shouldDirty: true,
          shouldTouch: true 
        })
        const formattedCep = address.postalCode
        if (formattedCep !== postalCode) {
          setValue('postalCode', formattedCep, { 
            shouldValidate: true, 
            shouldDirty: true,
            shouldTouch: true 
          })
        }
      }
    } catch (err) {
    } finally {
      setLoadingCep(false)
    }
  }

  const formatField = (value: string, field: 'postalCode' | 'document' | 'phone') => {
    if (!value || !country) return value

    switch (field) {
      case 'postalCode':
        return addressService.formatPostalCode(value, country)
      case 'document':
        return addressService.formatDocument(value, country)
      case 'phone':
        return addressService.formatPhone(value, country)
      default:
        return value
    }
  }

  const isPersonalDataComplete = () => {
    return !!(name &&
      name.length >= 2 &&
      email &&
      email.includes('@') &&
      birthDate &&
      document &&
      phone &&
      !errors.name &&
      !errors.email &&
      !errors.birthDate &&
      !errors.document &&
      !errors.phone)
  }

  const isAddressComplete = () => {
    return !!(country &&
      postalCode &&
      street &&
      city &&
      (country !== 'BR' || state) &&
      !errors.country &&
      !errors.postalCode &&
      !errors.street &&
      !errors.city &&
      !errors.state)
  }

  const handleNextSection = async () => {
    if (currentSection === 'personal') {
      const isValid = await trigger(['name', 'email', 'birthDate', 'document', 'phone'])
      if (isValid && isPersonalDataComplete()) {
        setCurrentSection('address')
      }
    } else if (currentSection === 'address') {
      const isValid = await trigger(['country', 'postalCode', 'street', 'city', 'state'])
      if (isValid && isAddressComplete()) {
        setCurrentSection('security')
      }
    }
  }

  const handlePreviousSection = () => {
    if (currentSection === 'address') {
      setCurrentSection('personal')
    } else if (currentSection === 'security') {
      setCurrentSection('address')
    }
  }

  const onSubmit = async (data: RegisterFormData) => {
    setError(null)
    setLoading(true)

    try {
      await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
        country: data.country,
        postalCode: data.postalCode.replace(/\D/g, ''),
        street: data.street,
        city: data.city,
        state: data.state || '',
        phone: data.phone.replace(/\D/g, ''),
        document: data.document.replace(/\D/g, ''),
        birthDate: data.birthDate,
      })
      navigate('/home')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-8 py-8 flex justify-center items-start">
      <Card className="w-full max-w-[1000px] mx-auto p-0 bg-transparent border-0 shadow-none">
        <form 
          onSubmit={handleSubmit(onSubmit)} 
          noValidate 
          aria-label="Formulário de registro"
          className="bg-white rounded-xl p-8 shadow-form w-full mx-auto"
        >
          <h1 className="text-4xl font-bold bg-primary-gradient bg-clip-text text-transparent mb-8 text-center tracking-tight">
            Criar Conta
          </h1>
          
          {error && (
            <div 
              className="bg-error-gradient text-danger py-4 px-6 rounded-lg mb-6 text-sm border border-red-200 shadow-error flex items-center gap-2" 
              role="alert" 
              aria-live="polite"
            >
              <span>⚠</span>
              {error}
            </div>
          )}

          {currentSection === 'personal' && (
            <div className="form-section w-full mb-8 p-8 pb-8 border-b-2 border-bg-secondary relative animate-fade-in">
              <h2 className="section-title text-2xl font-bold text-text mb-8 flex items-center gap-4 relative pl-6">
                Dados Pessoais
              </h2>
              
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div className="relative mb-8 col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nome Completo <span className="text-danger ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Icon name="user" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light w-5 h-5 z-10 pointer-events-none transition-colors duration-200" />
                    <input
                      type="text"
                      autoComplete="name"
                      required
                      {...register('name')}
                      className="w-full px-4 py-3 pl-12 rounded-lg border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                  </div>
                  {errors.name && (
                    <span className="text-sm text-danger mt-1 block">{errors.name.message}</span>
                  )}
                </div>

                <div className="relative mb-8 col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email <span className="text-danger ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Icon name="mail" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light w-5 h-5 z-10 pointer-events-none transition-colors duration-200" />
                    <input
                      type="email"
                      autoComplete="email"
                      required
                      {...register('email')}
                      className="w-full px-4 py-3 pl-12 rounded-lg border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                  </div>
                  {errors.email && (
                    <span className="text-sm text-danger mt-1 block">{errors.email.message}</span>
                  )}
                </div>

                <div className="relative mb-8">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Data de Nascimento <span className="text-danger ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Icon name="calendar" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light w-5 h-5 z-10 pointer-events-none transition-colors duration-200" />
                    <input
                      type="date"
                      required
                      {...register('birthDate')}
                      className="w-full px-4 py-3 pl-12 rounded-lg border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                  </div>
                  {errors.birthDate && (
                    <span className="text-sm text-danger mt-1 block">{errors.birthDate.message}</span>
                  )}
                </div>

                <div className="relative mb-8">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {addressService.getDocumentLabel(country)} <span className="text-danger ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Icon name="fileText" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light w-5 h-5 z-10 pointer-events-none transition-colors duration-200" />
                    <input
                      type="text"
                      required
                      {...register('document', {
                        onChange: (e) => {
                          const formatted = formatField(e.target.value, 'document')
                          setValue('document', formatted)
                        },
                      })}
                      placeholder={country === 'BR' ? '000.000.000-00' : country === 'PT' ? '000 000 000' : '0000000'}
                      className="w-full px-4 py-3 pl-12 rounded-lg border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                  </div>
                  {errors.document && (
                    <span className="text-sm text-danger mt-1 block">{errors.document.message}</span>
                  )}
                </div>

                <div className="relative mb-8 col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Telefone <span className="text-danger ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Icon name="phone" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light w-5 h-5 z-10 pointer-events-none transition-colors duration-200" />
                    <input
                      type="tel"
                      autoComplete="tel"
                      required
                      {...register('phone', {
                        onChange: (e) => {
                          const formatted = formatField(e.target.value, 'phone')
                          setValue('phone', formatted)
                        },
                      })}
                      placeholder={country === 'BR' ? '(00) 00000-0000' : '000 000 000'}
                      className="w-full px-4 py-3 pl-12 rounded-lg border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                  </div>
                  {errors.phone && (
                    <span className="text-sm text-danger mt-1 block">{errors.phone.message}</span>
                  )}
                </div>
              </div>

              <div className="flex gap-4 justify-end mt-8 pt-6 border-t border-border">
                <Button
                  type="button"
                  onClick={handleNextSection}
                  className="px-8 py-4 text-base font-bold bg-primary-gradient text-white border-0 rounded-xl cursor-pointer transition-all duration-200 shadow-button min-w-[150px] hover:-translate-y-0.5 hover:shadow-button-hover active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={!isPersonalDataComplete()}
                >
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {currentSection === 'address' && (
            <div className="form-section w-full mb-8 p-8 pb-8 border-b-2 border-bg-secondary relative animate-fade-in">
              <h2 className="section-title text-2xl font-bold text-text mb-8 flex items-center gap-4 relative pl-6">
                Endereço
              </h2>

              <div className="grid grid-cols-2 gap-8 mb-6">
                <div className="relative mb-8 col-span-2">
                  <label htmlFor="country" className="block text-sm font-medium text-foreground mb-2">
                    País <span className="text-danger ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Icon name="globe" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light w-5 h-5 z-10 pointer-events-none transition-colors duration-200" />
                    <select
                      id="country"
                      className="w-full py-3 pl-12 pr-[calc(1.5rem+1.5rem)] border-2 border-border rounded-lg text-base font-sans bg-bg text-text transition-all duration-200 cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'12\\' height=\\'12\\' viewBox=\\'0 0 12 12\\'%3E%3Cpath fill=\\'%236b7280\\' d=\\'M6 9L1 4h10z\\'/%3E%3C/svg%3E')] bg-no-repeat bg-[right_1.5rem_center] min-h-[48px] box-border focus:outline-none focus:border-primary focus:shadow-[0_0_0_4px_rgba(139,92,246,0.1)] focus:bg-white aria-[invalid=true]:border-danger"
                      {...register('country')}
                      aria-invalid={errors.country ? 'true' : 'false'}
                    >
                      {countries.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    {errors.country && (
                      <span className="text-sm text-danger block mt-1">{errors.country.message}</span>
                    )}
                  </div>
                </div>

                <div className="relative mb-8">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {addressService.getPostalCodeLabel(country)} <span className="text-danger ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Icon name="mapPin" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light w-5 h-5 z-10 pointer-events-none transition-colors duration-200" />
                    <input
                      type="text"
                      required
                      {...register('postalCode', {
                        onChange: (e) => {
                          const formatted = formatField(e.target.value, 'postalCode')
                          setValue('postalCode', formatted)
                        },
                      })}
                      placeholder={country === 'BR' ? '00000-000' : country === 'PT' ? '0000-000' : '000 0000'}
                      className="w-full px-4 py-3 pl-12 rounded-lg border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                    {loadingCep && country === 'BR' && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-primary font-medium pointer-events-none flex items-center gap-1">
                        <span className="cep-spinner"></span>
                        Buscando endereço...
                      </span>
                    )}
                  </div>
                  {errors.postalCode && (
                    <span className="text-sm text-danger mt-1 block">{errors.postalCode.message}</span>
                  )}
                </div>

                {(country === 'BR' || country === 'IE' || country === 'PT') && (
                  <div className="relative mb-8">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {addressService.getStateLabel(country)} {country === 'BR' && <span className="text-danger ml-1">*</span>}
                    </label>
                    <div className="relative">
                      <Icon name="mapPin" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light w-5 h-5 z-10 pointer-events-none transition-colors duration-200" />
                      <input
                        type="text"
                        required={country === 'BR'}
                        {...register('state')}
                        placeholder={country === 'BR' ? 'SP' : ''}
                        className="w-full px-4 py-3 pl-12 rounded-lg border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      />
                    </div>
                    {errors.state && (
                      <span className="text-sm text-danger mt-1 block">{errors.state.message}</span>
                    )}
                  </div>
                )}

                <div className="relative mb-8 col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Rua <span className="text-danger ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Icon name="mapPin" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light w-5 h-5 z-10 pointer-events-none transition-colors duration-200" />
                    <input
                      type="text"
                      autoComplete="street-address"
                      required
                      {...register('street')}
                      className="w-full px-4 py-3 pl-12 rounded-lg border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                  </div>
                  {errors.street && (
                    <span className="text-sm text-danger mt-1 block">{errors.street.message}</span>
                  )}
                </div>

                <div className="relative mb-8">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Cidade <span className="text-danger ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Icon name="mapPin" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light w-5 h-5 z-10 pointer-events-none transition-colors duration-200" />
                    <input
                      type="text"
                      autoComplete="address-level2"
                      required
                      {...register('city')}
                      className="w-full px-4 py-3 pl-12 rounded-lg border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                  </div>
                  {errors.city && (
                    <span className="text-sm text-danger mt-1 block">{errors.city.message}</span>
                  )}
                </div>
              </div>

              <div className="flex gap-4 justify-end mt-8 pt-6 border-t border-border">
                <Button
                  type="button"
                  onClick={handlePreviousSection}
                  variant="secondary"
                  className="px-8 py-4 text-base font-semibold bg-bg-secondary text-text border-2 border-border rounded-xl cursor-pointer transition-all duration-200 min-w-[150px] hover:bg-bg-tertiary hover:border-text-light"
                >
                  Voltar
                </Button>
                <Button
                  type="button"
                  onClick={handleNextSection}
                  className="px-8 py-4 text-base font-bold bg-primary-gradient text-white border-0 rounded-xl cursor-pointer transition-all duration-200 shadow-button min-w-[150px] hover:-translate-y-0.5 hover:shadow-button-hover active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={!isAddressComplete()}
                >
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {currentSection === 'security' && (
            <div className="form-section w-full mb-8 p-8 pb-0 border-b-0 relative animate-fade-in">
              <h2 className="section-title text-2xl font-bold text-text mb-8 flex items-center gap-4 relative pl-6">
                Segurança
              </h2>

              <div className="grid grid-cols-2 gap-8 mb-6">
                <div className="relative mb-8 col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Senha <span className="text-danger ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Icon name="lock" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light w-5 h-5 z-10 pointer-events-none transition-colors duration-200" />
                    <input
                      type="password"
                      autoComplete="new-password"
                      required
                      {...register('password')}
                      className="w-full px-4 py-3 pl-12 rounded-lg border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                  </div>
                  {errors.password && (
                    <span className="text-sm text-danger mt-1 block">{errors.password.message}</span>
                  )}
                </div>

                <div className="relative mb-8 col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Confirmar Senha <span className="text-danger ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Icon name="lock" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light w-5 h-5 z-10 pointer-events-none transition-colors duration-200" />
                    <input
                      type="password"
                      autoComplete="new-password"
                      required
                      {...register('confirmPassword')}
                      className="w-full px-4 py-3 pl-12 rounded-lg border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <span className="text-sm text-danger mt-1 block">{errors.confirmPassword.message}</span>
                  )}
                </div>
              </div>

              <div className="flex gap-4 justify-end mt-8 pt-6 border-t border-border">
                <Button
                  type="button"
                  onClick={handlePreviousSection}
                  variant="secondary"
                  className="px-8 py-4 text-base font-semibold bg-bg-secondary text-text border-2 border-border rounded-xl cursor-pointer transition-all duration-200 min-w-[150px] hover:bg-bg-tertiary hover:border-text-light"
                >
                  Voltar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 text-base font-bold bg-primary-gradient text-white border-0 rounded-xl cursor-pointer transition-all duration-200 shadow-button min-w-[150px] hover:-translate-y-0.5 hover:shadow-button-hover active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  aria-label="Criar conta"
                >
                  {loading ? 'Criando conta...' : 'Criar Conta'}
                </Button>
              </div>
            </div>
          )}

          <p className="text-center mt-6 text-text-light text-sm pt-6 border-t border-border">
            Já tem uma conta?{' '}
            <a 
              href="/login" 
              className="text-primary no-underline font-semibold transition-all duration-200 inline-block hover:text-primary-dark hover:translate-x-0.5"
              aria-label="Ir para página de login"
            >
              Faça login
            </a>
          </p>
        </form>
      </Card>
    </div>
  )
}
