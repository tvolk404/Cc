import type { AppState, ServiceCategory } from '../types'

export const uid = (p = 'id') =>
  p + '_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3)

export type CategoryIconKey = 'Broom' | 'Wrench' | 'Bed' | 'Search' | 'Sparkle'

export const CATEGORY_META: Record<
  ServiceCategory,
  { label: string; color: string; bg: string; icon: CategoryIconKey }
> = {
  cleaning: { label: 'Cleaning', color: 'var(--c-clean)', bg: 'var(--c-clean-bg)', icon: 'Broom' },
  maintenance: { label: 'Maintenance', color: 'var(--c-maint)', bg: 'var(--c-maint-bg)', icon: 'Wrench' },
  linen: { label: 'Linen', color: 'var(--c-linen)', bg: 'var(--c-linen-bg)', icon: 'Bed' },
  inspection: { label: 'Inspection', color: 'var(--c-inspect)', bg: 'var(--c-inspect-bg)', icon: 'Search' },
  custom: { label: 'Custom', color: 'var(--c-custom)', bg: 'var(--c-custom-bg)', icon: 'Sparkle' },
}

/* Muted duotone covers — restrained, editorial (no rainbow gradients). */
export const GRADIENTS: Record<string, string> = {
  g1: 'linear-gradient(160deg,#1f2029,#33343f)',
  g2: 'linear-gradient(160deg,#12433a,#0f9c84)',
  g3: 'linear-gradient(160deg,#3a3550,#5563cf)',
  g4: 'linear-gradient(160deg,#4a3a24,#b9781f)',
  g5: 'linear-gradient(160deg,#402d4d,#8a4fc4)',
  g6: 'linear-gradient(160deg,#233b46,#3f7d8f)',
}
export const GRADIENT_KEYS = Object.keys(GRADIENTS)

// Relative dates so the demo always looks "live"
const today = new Date()
const iso = (offsetDays: number) => {
  const d = new Date(today)
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().slice(0, 10)
}

export function seed(): AppState {
  return {
    properties: [
      {
        id: 'prop_riverside',
        name: 'Riverside Lofts',
        kind: 'multi',
        address: '14 Canal Street',
        city: 'Amsterdam',
        photo: 'g2',
        createdAt: Date.now() - 8e8,
        unitTypes: [
          {
            id: 'ut_studio',
            name: 'Canal Studio',
            beds: 1,
            baths: 1,
            units: [
              { id: 'u_101', label: 'Apt 101', floor: '1', status: 'ready' },
              { id: 'u_102', label: 'Apt 102', floor: '1', status: 'occupied' },
              { id: 'u_201', label: 'Apt 201', floor: '2', status: 'cleaning' },
            ],
          },
          {
            id: 'ut_loft',
            name: 'Two-Bed Loft',
            beds: 2,
            baths: 2,
            units: [
              { id: 'u_301', label: 'Apt 301', floor: '3', status: 'maintenance' },
              { id: 'u_302', label: 'Apt 302', floor: '3', status: 'ready' },
            ],
          },
        ],
      },
      {
        id: 'prop_garden',
        name: 'Garden House',
        kind: 'single',
        address: '9 Vondel Avenue',
        city: 'Amsterdam',
        photo: 'g1',
        beds: 3,
        baths: 2,
        singleStatus: 'ready',
        createdAt: Date.now() - 5e8,
        unitTypes: [],
      },
      {
        id: 'prop_harbor',
        name: 'Harbor View Suites',
        kind: 'multi',
        address: '2 Dockyard Road',
        city: 'Rotterdam',
        photo: 'g4',
        createdAt: Date.now() - 2e8,
        unitTypes: [
          {
            id: 'ut_suite',
            name: 'Harbor Suite',
            beds: 1,
            baths: 1,
            units: [
              { id: 'u_h1', label: 'Suite A', floor: '4', status: 'ready' },
              { id: 'u_h2', label: 'Suite B', floor: '4', status: 'occupied' },
            ],
          },
        ],
      },
    ],
    contractors: [
      {
        id: 'c_sparkle',
        name: 'Sparkle Cleaning Co.',
        contactName: 'Marta Novak',
        email: 'hello@sparkleco.nl',
        phone: '+31 6 1234 5678',
        categories: ['cleaning', 'linen'],
        color: 'var(--sky)',
        rating: 4.9,
        active: true,
      },
      {
        id: 'c_fixit',
        name: 'FixIt Maintenance',
        contactName: 'Daan Visser',
        email: 'team@fixit.nl',
        phone: '+31 6 8765 4321',
        categories: ['maintenance', 'inspection'],
        color: 'var(--amber)',
        rating: 4.6,
        active: true,
      },
      {
        id: 'c_fresh',
        name: 'FreshLinen Supply',
        contactName: 'Sara de Wit',
        email: 'orders@freshlinen.nl',
        phone: '+31 6 2233 4455',
        categories: ['linen'],
        color: 'var(--violet)',
        rating: 4.8,
        active: false,
      },
    ],
    tasks: [
      {
        id: 'task_1', title: 'Turnover clean — checkout', category: 'cleaning',
        propertyId: 'prop_riverside', unitId: 'u_201', unitTypeId: 'ut_studio',
        contractorId: 'c_sparkle', date: iso(0), time: '11:00', durationMin: 90,
        status: 'in_progress', priority: 'high', recurrence: 'none',
        notes: 'Guest checks out 10am, new guest arrives 3pm.', createdAt: Date.now() - 1e7,
      },
      {
        id: 'task_2', title: 'Fix leaking tap', category: 'maintenance',
        propertyId: 'prop_riverside', unitId: 'u_301', unitTypeId: 'ut_loft',
        contractorId: 'c_fixit', date: iso(0), time: '14:30', durationMin: 60,
        status: 'accepted', priority: 'normal', recurrence: 'none', createdAt: Date.now() - 2e7,
      },
      {
        id: 'task_3', title: 'Weekly linen change', category: 'linen',
        propertyId: 'prop_garden', contractorId: 'c_sparkle', date: iso(1), time: '09:00',
        durationMin: 45, status: 'scheduled', priority: 'normal', recurrence: 'weekly',
        createdAt: Date.now() - 3e7,
      },
      {
        id: 'task_4', title: 'Quarterly safety inspection', category: 'inspection',
        propertyId: 'prop_harbor', unitId: 'u_h1', unitTypeId: 'ut_suite',
        contractorId: 'c_fixit', date: iso(2), time: '10:00', durationMin: 120,
        status: 'scheduled', priority: 'high', recurrence: 'none', createdAt: Date.now() - 4e7,
      },
      {
        id: 'task_5', title: 'Deep clean before season', category: 'cleaning',
        propertyId: 'prop_garden', contractorId: 'c_sparkle', date: iso(3), time: '13:00',
        durationMin: 180, status: 'scheduled', priority: 'normal', recurrence: 'none',
        createdAt: Date.now() - 5e7,
      },
      {
        id: 'task_6', title: 'Restock welcome linens', category: 'linen',
        propertyId: 'prop_harbor', unitId: 'u_h2', unitTypeId: 'ut_suite',
        date: iso(-1), time: '16:00', durationMin: 30, status: 'completed',
        priority: 'low', recurrence: 'none', createdAt: Date.now() - 9e7,
      },
    ],
  }
}
