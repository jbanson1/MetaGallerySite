import Link from 'next/link'
import styles from '../privacy/privacy.module.css'

export const metadata = {
  title: 'Cookie Policy — The Confidential Gallery',
  description: 'How The Confidential Gallery uses cookies and how to manage your preferences.',
}

export default function CookiePolicyPage() {
  return (
    <>
      <header className={styles.pageHeader}>
        <div className={styles.pageTag}><span>Legal</span></div>
        <h1>Cookie <em className={styles.serifItalic}>Policy</em></h1>
        <p>Last updated: April 2026</p>
      </header>

      <section className={styles.contentSection}>
        <div className={styles.contentContainer}>
          <div className={styles.contentBody}>

            <article className={styles.section}>
              <h2>What are cookies?</h2>
              <p>Cookies are small text files stored on your device when you visit a website. They help the site remember information about your visit, making your next visit easier and the site more useful to you.</p>
            </article>

            <article className={styles.section}>
              <h2>How we use cookies</h2>
              <p>The Confidential Gallery uses three categories of cookies:</p>

              <h3>1. Strictly necessary</h3>
              <p>These cookies are essential for you to use the platform. They include:</p>
              <ul>
                <li><strong>Authentication session</strong> — keeps you signed in as you browse</li>
                <li><strong>CSRF protection</strong> — prevents cross-site request forgery attacks</li>
                <li><strong>Cookie consent preference</strong> — remembers the choice you made on this banner</li>
              </ul>
              <p>These cannot be turned off.</p>

              <h3>2. Functional</h3>
              <p>These cookies remember your preferences and settings:</p>
              <ul>
                <li><strong>Favourites</strong> — artworks you&apos;ve hearted (stored in localStorage)</li>
                <li><strong>Scan history</strong> — recent AR wall previews (stored in localStorage)</li>
                <li><strong>AR preferences</strong> — frame style, artwork size settings</li>
              </ul>
              <p>These are only active if you accept functional cookies.</p>

              <h3>3. Analytics</h3>
              <p>We may use anonymous analytics cookies in the future to understand how visitors use the platform. We will always ask for your consent before setting any analytics cookies. At present, no third-party analytics tools are active.</p>
            </article>

            <article className={styles.section}>
              <h2>Third-party cookies</h2>
              <p>We use Supabase to manage authentication and data. Supabase may set cookies for session management. For details, see the <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Supabase Privacy Policy</a>.</p>
              <p>We do not currently use advertising, social media, or tracking cookies from third parties.</p>
            </article>

            <article className={styles.section}>
              <h2>Managing your preferences</h2>
              <p>You can change your cookie preferences at any time by clicking the <strong>&quot;Cookie Settings&quot;</strong> link in the footer. You can also clear cookies through your browser settings.</p>
              <p>Note that blocking strictly necessary cookies will prevent you from signing in to the platform.</p>
            </article>

            <article className={styles.section}>
              <h2>Your rights under UK GDPR</h2>
              <p>Under the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018, you have the right to:</p>
              <ul>
                <li>Know what cookies we set and why</li>
                <li>Withdraw consent at any time</li>
                <li>Request deletion of data associated with your account</li>
              </ul>
              <p>See our <Link href="/privacy">Privacy Policy</Link> for full details of your rights and how to exercise them.</p>
            </article>

            <article className={styles.section}>
              <h2>Contact</h2>
              <p>For questions about cookies or data privacy, email us at <strong>privacy@theconfidential.gallery</strong>.</p>
            </article>

          </div>
        </div>
      </section>
    </>
  )
}
