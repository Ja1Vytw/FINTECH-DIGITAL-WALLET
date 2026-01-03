import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Button } from '@/app/shared/components/Button'
import { Input } from '@/app/shared/components/Input'
import { Card } from '@/app/shared/components/Card'
import { authService } from '@/app/core/services/authService'
import { Mail, Lock, AlertCircle } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setError(null)
    setLoading(true)

    try {
      await authService.login(data)
      navigate('/home')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-dark to-primary-light p-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-lg" />
          </div>
          <h1 className="text-3xl font-bold text-[#1f2937] dark:text-[#f9fafb]">{t('auth.login')}</h1>
          <p className="text-[#6b7280] dark:text-[#9ca3af] mt-2">{t('auth.signInDescription')}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3" role="alert" aria-live="polite">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate aria-label="Formulário de login">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#1f2937] dark:text-[#f9fafb] mb-2">
              {t('auth.email')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280] dark:text-[#9ca3af]" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                error={errors.email?.message}
                {...register('email')}
                className="pl-10 h-12"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
            </div>
            {errors.email && (
              <span id="email-error" className="text-sm text-danger mt-1 block" role="alert">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#1f2937] dark:text-[#f9fafb] mb-2">
              {t('auth.password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280] dark:text-[#9ca3af]" />
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                error={errors.password?.message}
                {...register('password')}
                className="pl-10 h-12"
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
            </div>
            {errors.password && (
              <span id="password-error" className="text-sm text-danger mt-1 block" role="alert">
                {errors.password.message}
              </span>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 gradient-primary text-white font-semibold shadow-button hover:shadow-button-hover transition-all"
            aria-label={t('auth.login')}
          >
            {loading ? 'Signing in...' : t('auth.login')}
          </Button>
        </form>

        <p className="text-center text-sm text-[#6b7280] dark:text-[#9ca3af] mt-6">
          {t('auth.dontHaveAccount')}{' '}
          <Link to="/register" className="text-primary font-semibold hover:text-primary-dark transition-colors" aria-label={t('auth.createAccount')}>
            {t('auth.createAccount')}
          </Link>
        </p>
      </Card>
    </div>
  )
}
