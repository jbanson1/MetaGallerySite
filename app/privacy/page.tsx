import Link from 'next/link'
import styles from './privacy.module.css'

export const metadata = {
  title: 'Privacy Policy — The Confidential Gallery',
  description: 'Learn how The Confidential Gallery collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
  return (
    <>
      {/* Page Header */}
      <header className={styles.pageHeader}>
        <div className={styles.pageTag}>
          <span>Legal</span>
        </div>
        <h1>Privacy <em className={styles.serifItalic}>Policy</em></h1>
        <p>Last updated: March 2026</p>
      </header>

      {/* Content */}
      <section className={styles.contentSection}>
        <div className={styles.contentContainer}>
          
          <div className={styles.tableOfContents}>
            <h3>Contents</h3>
            <ul>
              <li><a href="#introduction">Introduction</a></li>
              <li><a href="#information-we-collect">Information We Collect</a></li>
              <li><a href="#how-we-use">How We Use Your Information</a></li>
              <li><a href="#sharing">Information Sharing</a></li>
              <li><a href="#cookies">Cookies & Tracking</a></li>
              <li><a href="#data-security">Data Security</a></li>
              <li><a href="#your-rights">Your Rights</a></li>
              <li><a href="#retention">Data Retention</a></li>
              <li><a href="#children">Children's Privacy</a></li>
              <li><a href="#changes">Changes to This Policy</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>

          <div className={styles.contentBody}>
            
            <article id="introduction" className={styles.section}>
              <h2>Introduction</h2>
              <p>
                The Confidential Gallery ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile application, and AR services (collectively, the "Platform").
              </p>
              <p>
                By using The Confidential Gallery, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our Platform.
              </p>
            </article>

            <article id="information-we-collect" className={styles.section}>
              <h2>Information We Collect</h2>
              
              <h3>Information You Provide</h3>
              <p>We collect information you voluntarily provide when using our Platform:</p>
              <ul>
                <li><strong>Account Information:</strong> Name, email address, password, and profile details when you create an account.</li>
                <li><strong>Gallery/Artist Information:</strong> Business name, location, artwork details, descriptions, and media uploads.</li>
                <li><strong>Payment Information:</strong> Billing address and payment method details (processed securely through our payment providers).</li>
                <li><strong>Communications:</strong> Messages, feedback, and support requests you send to us.</li>
                <li><strong>Waitlist Information:</strong> Name, email, and user type when joining our waitlist.</li>
              </ul>

              <h3>Information Collected Automatically</h3>
              <p>When you access our Platform, we automatically collect:</p>
              <ul>
                <li><strong>Device Information:</strong> Device type, operating system, browser type, and unique device identifiers.</li>
                <li><strong>Usage Data:</strong> Pages visited, features used, time spent, and interaction patterns.</li>
                <li><strong>Location Data:</strong> Approximate location based on IP address (precise location only with your consent for AR features).</li>
                <li><strong>Scan Analytics:</strong> Which artworks are scanned, frequency, and engagement metrics (anonymised for analytics).</li>
              </ul>
            </article>

            <article id="how-we-use" className={styles.section}>
              <h2>How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide, maintain, and improve our Platform and services</li>
                <li>Process transactions and send related information</li>
                <li>Create and manage your account</li>
                <li>Deliver AR experiences and artwork information to visitors</li>
                <li>Provide analytics and insights to galleries and artists</li>
                <li>Send promotional communications (with your consent)</li>
                <li>Respond to your comments, questions, and support requests</li>
                <li>Monitor and analyse trends, usage, and activities</li>
                <li>Detect, prevent, and address technical issues and fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </article>

            <article id="sharing" className={styles.section}>
              <h2>Information Sharing</h2>
              <p>We do not sell your personal information. We may share your information in the following circumstances:</p>
              <ul>
                <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf (hosting, payment processing, analytics).</li>
                <li><strong>Galleries & Artists:</strong> Anonymised visitor analytics are shared with gallery owners and artists to help them understand engagement.</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights, privacy, safety, or property.</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.</li>
                <li><strong>With Your Consent:</strong> When you have given us explicit permission to share your information.</li>
              </ul>
            </article>

            <article id="cookies" className={styles.section}>
              <h2>Cookies & Tracking Technologies</h2>
              <p>We use cookies and similar tracking technologies to collect and track information about your activity on our Platform. These include:</p>
              <ul>
                <li><strong>Essential Cookies:</strong> Required for the Platform to function properly (authentication, security).</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our Platform.</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences (e.g., theme choice).</li>
              </ul>
              <p>
                You can control cookies through your browser settings. However, disabling certain cookies may limit your ability to use some features of our Platform.
              </p>
            </article>

            <article id="data-security" className={styles.section}>
              <h2>Data Security</h2>
              <p>
                We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul>
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and audits</li>
                <li>Access controls and authentication requirements</li>
                <li>Employee training on data protection</li>
              </ul>
              <p>
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.
              </p>
            </article>

            <article id="your-rights" className={styles.section}>
              <h2>Your Rights</h2>
              <p>Depending on your location, you may have the following rights regarding your personal information:</p>
              <ul>
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you.</li>
                <li><strong>Rectification:</strong> Request correction of inaccurate or incomplete information.</li>
                <li><strong>Erasure:</strong> Request deletion of your personal information (subject to legal obligations).</li>
                <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances.</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service provider.</li>
                <li><strong>Objection:</strong> Object to processing based on legitimate interests or for direct marketing.</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent at any time where processing is based on consent.</li>
              </ul>
              <p>
                To exercise any of these rights, please contact us at <a href="mailto:hello@theconfidential.gallery">hello@theconfidential.gallery</a>. We will respond to your request within 30 days.
              </p>
            </article>

            <article id="retention" className={styles.section}>
              <h2>Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to fulfil the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>
              <p>
                When you delete your account, we will delete or anonymise your personal information within 90 days, except where we need to retain certain information for legal, accounting, or security purposes.
              </p>
            </article>

            <article id="children" className={styles.section}>
              <h2>Children's Privacy</h2>
              <p>
                Our Platform is not intended for children under the age of 16. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
              </p>
            </article>

            <article id="changes" className={styles.section}>
              <h2>Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
              <p>
                We encourage you to review this Privacy Policy periodically for any changes. Your continued use of the Platform after any modifications indicates your acceptance of the updated policy.
              </p>
            </article>

            <article id="contact" className={styles.section}>
              <h2>Contact Us</h2>
              <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
              <div className={styles.contactCard}>
                <p><strong>The Confidential Gallery Ltd</strong></p>
                <p>123 Art Street</p>
                <p>London, EC1A 1BB</p>
                <p>United Kingdom</p>
                <p>Email: <a href="mailto:hello@theconfidential.gallery">hello@theconfidential.gallery</a></p>
              </div>
            </article>

          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className={styles.relatedSection}>
        <div className={styles.relatedContainer}>
          <h3>Related Documents</h3>
          <div className={styles.relatedLinks}>
            <Link href="/terms" className={styles.relatedLink}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              <div>
                <span className={styles.relatedTitle}>Terms of Service</span>
                <span className={styles.relatedDesc}>Rules and guidelines for using The Confidential Gallery</span>
              </div>
            </Link>
            <Link href="/cookies" className={styles.relatedLink}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="8" cy="9" r="1" fill="currentColor"/>
                <circle cx="15" cy="8" r="1" fill="currentColor"/>
                <circle cx="10" cy="14" r="1" fill="currentColor"/>
                <circle cx="15" cy="14" r="1" fill="currentColor"/>
              </svg>
              <div>
                <span className={styles.relatedTitle}>Cookie Policy</span>
                <span className={styles.relatedDesc}>How we use cookies and tracking technologies</span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}