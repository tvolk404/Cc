// ---------- Domain model ----------

export type PropertyKind = 'single' | 'multi'

export interface Unit {
  id: string
  label: string // e.g. "Apt 101"
  floor?: string
  status: 'ready' | 'occupied' | 'cleaning' | 'maintenance'
}

export interface UnitType {
  id: string
  name: string // e.g. "Studio", "1-Bedroom Deluxe"
  beds: number
  baths: number
  units: Unit[]
}

export interface Property {
  id: string
  name: string
  kind: PropertyKind
  address: string
  city: string
  photo: string // gradient key
  // single-unit props
  beds?: number
  baths?: number
  singleStatus?: Unit['status']
  // multi-unit props
  unitTypes: UnitType[]
  createdAt: number
}

export type ServiceCategory = 'cleaning' | 'maintenance' | 'linen' | 'inspection' | 'custom'

export interface Contractor {
  id: string
  name: string // company or person
  contactName: string
  email: string
  phone: string
  categories: ServiceCategory[]
  color: string
  rating: number
  // If a contractor has "signed in" to the provider portal we track it here
  active: boolean
}

export type TaskStatus = 'scheduled' | 'accepted' | 'in_progress' | 'completed' | 'declined'

export interface Task {
  id: string
  title: string
  category: ServiceCategory
  propertyId: string
  unitId?: string // specific unit for multi-unit
  unitTypeId?: string
  contractorId?: string
  date: string // ISO date yyyy-mm-dd
  time: string // HH:mm
  durationMin: number
  status: TaskStatus
  priority: 'low' | 'normal' | 'high'
  notes?: string
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly'
  createdAt: number
}

export interface AppState {
  properties: Property[]
  contractors: Contractor[]
  tasks: Task[]
}
