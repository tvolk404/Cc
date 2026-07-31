import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { AppState, Contractor, Property, Task, UnitType, Unit } from '../types'
import { seed, uid } from './data'

const KEY = 'turnkey.state.v1'

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as AppState
  } catch { /* ignore */ }
  return seed()
}

interface StoreCtx {
  state: AppState
  // properties
  addProperty: (p: Omit<Property, 'id' | 'createdAt'>) => Property
  updateProperty: (id: string, patch: Partial<Property>) => void
  removeProperty: (id: string) => void
  addUnitType: (propId: string, ut: Omit<UnitType, 'id' | 'units'>) => void
  addUnit: (propId: string, utId: string, unit: Omit<Unit, 'id'>) => void
  // contractors
  addContractor: (c: Omit<Contractor, 'id'>) => Contractor
  updateContractor: (id: string, patch: Partial<Contractor>) => void
  removeContractor: (id: string) => void
  // tasks
  addTask: (t: Omit<Task, 'id' | 'createdAt'>) => Task
  updateTask: (id: string, patch: Partial<Task>) => void
  removeTask: (id: string) => void
  resetDemo: () => void
}

const Ctx = createContext<StoreCtx | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(load)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state))
  }, [state])

  // cross-tab / cross-portal sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY && e.newValue) setState(JSON.parse(e.newValue))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const api = useMemo<StoreCtx>(() => ({
    state,
    addProperty: (p) => {
      const prop: Property = { ...p, id: uid('prop'), createdAt: Date.now() }
      setState((s) => ({ ...s, properties: [prop, ...s.properties] }))
      return prop
    },
    updateProperty: (id, patch) =>
      setState((s) => ({
        ...s,
        properties: s.properties.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      })),
    removeProperty: (id) =>
      setState((s) => ({
        ...s,
        properties: s.properties.filter((p) => p.id !== id),
        tasks: s.tasks.filter((t) => t.propertyId !== id),
      })),
    addUnitType: (propId, ut) =>
      setState((s) => ({
        ...s,
        properties: s.properties.map((p) =>
          p.id === propId
            ? { ...p, unitTypes: [...p.unitTypes, { ...ut, id: uid('ut'), units: [] }] }
            : p,
        ),
      })),
    addUnit: (propId, utId, unit) =>
      setState((s) => ({
        ...s,
        properties: s.properties.map((p) =>
          p.id === propId
            ? {
                ...p,
                unitTypes: p.unitTypes.map((ut) =>
                  ut.id === utId ? { ...ut, units: [...ut.units, { ...unit, id: uid('u') }] } : ut,
                ),
              }
            : p,
        ),
      })),
    addContractor: (c) => {
      const con: Contractor = { ...c, id: uid('c') }
      setState((s) => ({ ...s, contractors: [con, ...s.contractors] }))
      return con
    },
    updateContractor: (id, patch) =>
      setState((s) => ({
        ...s,
        contractors: s.contractors.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      })),
    removeContractor: (id) =>
      setState((s) => ({
        ...s,
        contractors: s.contractors.filter((c) => c.id !== id),
        tasks: s.tasks.map((t) => (t.contractorId === id ? { ...t, contractorId: undefined } : t)),
      })),
    addTask: (t) => {
      const task: Task = { ...t, id: uid('task'), createdAt: Date.now() }
      setState((s) => ({ ...s, tasks: [task, ...s.tasks] }))
      return task
    },
    updateTask: (id, patch) =>
      setState((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
    removeTask: (id) => setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) })),
    resetDemo: () => setState(seed()),
  }), [state])

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
