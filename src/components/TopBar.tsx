import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronRight } from '../icons'

export default function TopBar() {
  const navigate = useNavigate()
  return (
    <div className="topbar">
      <button className="back-btn" aria-label="Go back" onClick={() => navigate(-1)}>
        <ArrowLeft />
      </button>

      <div className="topbar__right">
        <button className="earn-badge">Earn US$115</button>
        <button className="profile" aria-label="Account">
          <span className="profile__avatar">
            CL
            <span className="profile__badge">!</span>
          </span>
          <span className="profile__name" aria-hidden />
          <ChevronRight className="profile__chev" width={18} height={18} />
        </button>
      </div>
    </div>
  )
}
