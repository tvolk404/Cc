export type Transaction = {
  id: string
  title: string
  subtitle?: string
  amount: string
  secondary?: string
  muted?: boolean
  positive?: boolean
  logo: {
    kind: 'text' | 'color'
    label: string
    bg: string
    color?: string
    img?: string
  }
}

export type TransactionGroup = {
  date: string
  items: Transaction[]
}

export const transactionGroups: TransactionGroup[] = [
  {
    date: '12 February',
    items: [
      {
        id: 't1',
        title: 'Taobao',
        amount: '71.95 SGD',
        logo: { kind: 'text', label: '淘', bg: '#ff5000', color: '#fff' },
      },
    ],
  },
  {
    date: '21 January',
    items: [
      {
        id: 't2',
        title: 'Kraken Exchange',
        amount: '10 USD',
        logo: { kind: 'text', label: 'K', bg: '#5741d9', color: '#fff' },
      },
      {
        id: 't3',
        title: 'Card Verification',
        subtitle: 'Card checked',
        amount: '0 USD',
        muted: true,
        logo: { kind: 'color', label: '', bg: '#e7e8e5' },
      },
      {
        id: 't4',
        title: 'Grab',
        amount: '1,400,000 IDR',
        secondary: '106.39 SGD',
        logo: { kind: 'text', label: 'Grab', bg: '#00b14f', color: '#fff' },
      },
    ],
  },
  {
    date: '11 December 2025',
    items: [
      {
        id: 't5',
        title: 'Joe & The Juice',
        amount: '74 AED',
        secondary: '26.15 SGD',
        logo: { kind: 'text', label: 'J', bg: '#f5b8c8', color: '#111' },
      },
    ],
  },
  {
    date: '10 December 2025',
    items: [
      {
        id: 't6',
        title: 'Lavoya',
        amount: '112 AED',
        secondary: '39.59 SGD',
        logo: { kind: 'text', label: 'L', bg: '#1f2937', color: '#fff' },
      },
      {
        id: 't7',
        title: 'Added money via debit card',
        amount: '+ 500 SGD',
        positive: true,
        logo: { kind: 'text', label: '+', bg: '#e9f0e4', color: '#163300' },
      },
    ],
  },
  {
    date: '8 December 2025',
    items: [
      {
        id: 't8',
        title: 'Amazon',
        amount: '58.20 USD',
        secondary: '78.44 SGD',
        logo: { kind: 'text', label: 'a', bg: '#232f3e', color: '#ff9900' },
      },
      {
        id: 't9',
        title: 'To Emma Larsson',
        subtitle: 'Sent',
        amount: '200 EUR',
        secondary: '292.10 SGD',
        logo: { kind: 'text', label: 'EL', bg: '#c7d2fe', color: '#1e3a8a' },
      },
      {
        id: 't10',
        title: 'Spotify',
        subtitle: 'Subscription',
        amount: '10.90 SGD',
        logo: { kind: 'text', label: '♪', bg: '#1db954', color: '#fff' },
      },
    ],
  },
]
