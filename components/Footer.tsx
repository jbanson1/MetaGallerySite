import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-logo">Meta Gallery</div>
        <ul className="footer-links">
          <li>
            <Link href="/#features">Features</Link>
          </li>
          <li>
            <Link href="/marketplace">Marketplace</Link>
          </li>
          <li>
            <Link href="/events">Events</Link>
          </li>
          <li>
            <Link href="#">Contact</Link>
          </li>
          <li>
            <Link href="#">Privacy</Link>
          </li>
        </ul>
        <p className="footer-copy">© 2025 Meta Gallery. All rights reserved.</p>
      </div>
    </footer>
  )
}
