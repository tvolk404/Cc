import { useMemo, useState } from 'react'
import { transactionGroups } from '../data'
import TransactionRow from '../components/TransactionRow'
import { SearchIcon, FiltersIcon, DownloadIcon } from '../icons'

export default function Transactions() {
  const [query, setQuery] = useState('')

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return transactionGroups
    return transactionGroups
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.subtitle?.toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.items.length > 0)
  }, [query])

  return (
    <div>
      <div className="page-head">
        <h1 className="page-title">Transactions</h1>

        <div className="page-actions">
          <div className="search">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button className="pill-btn">
            <FiltersIcon />
            Filters (1)
          </button>
          <button className="pill-btn">
            <DownloadIcon />
            Download
          </button>
        </div>
      </div>

      <div className="txn-groups">
        {groups.map((group) => (
          <section className="txn-group" key={group.date}>
            <div className="txn-group__date">{group.date}</div>
            {group.items.map((txn) => (
              <TransactionRow key={txn.id} txn={txn} />
            ))}
          </section>
        ))}

        {groups.length === 0 && (
          <p style={{ padding: '40px 4px', color: 'var(--text-muted)' }}>
            No transactions found for “{query}”.
          </p>
        )}
      </div>
    </div>
  )
}
