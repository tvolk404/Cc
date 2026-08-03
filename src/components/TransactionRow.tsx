import type { Transaction } from '../data'

export default function TransactionRow({ txn }: { txn: Transaction }) {
  const { logo } = txn
  return (
    <button className={'txn-row' + (txn.muted ? ' txn-row--muted' : '')}>
      <span
        className="txn-row__logo"
        style={{ background: logo.bg, color: logo.color }}
      >
        {logo.img ? <img src={logo.img} alt="" /> : logo.label}
      </span>

      <span className="txn-row__body">
        <span className="txn-row__title">{txn.title}</span>
        {txn.subtitle && <span className="txn-row__sub">{txn.subtitle}</span>}
      </span>

      <span className="txn-row__amounts">
        <span
          className={
            'txn-row__amount' +
            (txn.amount.startsWith('0 ') ? ' txn-row__amount--zero' : '') +
            (txn.positive ? ' txn-row__amount--positive' : '')
          }
        >
          {txn.amount}
        </span>
        {txn.secondary && (
          <span className="txn-row__secondary">{txn.secondary}</span>
        )}
      </span>
    </button>
  )
}
