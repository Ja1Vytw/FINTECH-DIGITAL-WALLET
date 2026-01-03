import { FiUser, FiMail, FiLock, FiMapPin, FiPhone, FiFileText, FiCalendar, FiGlobe } from 'react-icons/fi'

interface IconProps {
  name: 'user' | 'mail' | 'lock' | 'mapPin' | 'phone' | 'fileText' | 'calendar' | 'globe'
  className?: string
}

const iconMap = {
  user: FiUser,
  mail: FiMail,
  lock: FiLock,
  mapPin: FiMapPin,
  phone: FiPhone,
  fileText: FiFileText,
  calendar: FiCalendar,
  globe: FiGlobe,
}

export function Icon({ name, className }: IconProps) {
  const IconComponent = iconMap[name]
  return <IconComponent className={className} />
}

