import Link from 'next/link'
import styles from './terms.module.css'

export const metadata = {
  title: 'Terms of Service — Confidential Gallery',
  description: 'Terms and conditions for using Confidential Gallery platform and services.',
}

export default function TermsPage() {
  return (
    <>
      {/* Page Header */}
      <header className={styles.pageHeader}>
        <div className={styles.pageTag}>
          <span>Legal</span>
        </div>
        <h1>Terms of <em className={styles.serifItalic}>Service</em></h1>
        <p>Last updated: March 2026</p>
      </header>

      {/* Content */}
      <section className={styles.contentSection}>
        <div className={styles.contentContainer}>
          
          <div className={styles.tableOfContents}>
            <h3>Contents</h3>
            <ul>
              <li><a href="#acceptance">Acceptance of Terms</a></li>
              <li><a href="#eligibility">Eligibility</a></li>
              <li><a href="#accounts">Account Registration</a></li>
              <li><a href="#platform-use">Use of the Platform</a></li>
              <li><a href="#gallery-artist-terms">Gallery & Artist Terms</a></li>
              <li><a href="#visitor-terms">Visitor Terms</a></li>
              <li><a href="#marketplace">Marketplace Terms</a></li>
              <li><a href="#intellectual-property">Intellectual Property</a></li>
              <li><a href="#user-content">User Content</a></li>
              <li><a href="#prohibited-conduct">Prohibited Conduct</a></li>
              <li><a href="#payments">Payments & Fees</a></li>
              <li><a href="#termination">Termination</a></li>
              <li><a href="#disclaimers">Disclaimers</a></li>
              <li><a href="#limitation">Limitation of Liability</a></li>
              <li><a href="#indemnification">Indemnification</a></li>
              <li><a href="#disputes">Dispute Resolution</a></li>
              <li><a href="#changes">Changes to Terms</a></li>
              <li><a href="#contact">Contact Information</a></li>
            </ul>
          </div>

          <div className={styles.contentBody}>
            
            <article id="acceptance" className={styles.section}>
              <h2>1. Acceptance of Terms</h2>
              <p>
                Welcome to Confidential Gallery. These Terms of Service ("Terms") govern your access to and use of the Confidential Gallery website, mobile applications, AR services, and any related services (collectively, the "Platform") operated by Confidential Gallery Ltd ("we," "our," or "us").
              </p>
              <p>
                By accessing or using our Platform, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not access or use the Platform.
              </p>
              <p>
                We reserve the right to modify these Terms at any time. Your continued use of the Platform following any changes constitutes acceptance of those changes.
              </p>
            </article>

            <article id="eligibility" className={styles.section}>
              <h2>2. Eligibility</h2>
              <p>To use our Platform, you must:</p>
              <ul>
                <li>Be at least 16 years of age (or the age of majority in your jurisdiction)</li>
                <li>Have the legal capacity to enter into a binding agreement</li>
                <li>Not be prohibited from using the Platform under applicable laws</li>
                <li>Provide accurate and complete registration information</li>
              </ul>
              <p>
                If you are using the Platform on behalf of a business, organisation, or other entity, you represent that you have the authority to bind that entity to these Terms.
              </p>
            </article>

            <article id="accounts" className={styles.section}>
              <h2>3. Account Registration</h2>
              <p>
                To access certain features of the Platform, you must create an account. When creating an account, you agree to:
              </p>
              <ul>
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Keep your password secure and confidential</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorised access</li>
              </ul>
              <p>
                We reserve the right to suspend or terminate accounts that violate these Terms or for any other reason at our sole discretion.
              </p>
            </article>

            <article id="platform-use" className={styles.section}>
              <h2>4. Use of the Platform</h2>
              <p>
                Confidential Gallery provides an augmented reality platform that enables galleries, museums, and artists to enhance visitor experiences with digital overlays, audio guides, and interactive content.
              </p>
              <h3>Permitted Uses</h3>
              <p>You may use the Platform to:</p>
              <ul>
                <li>Create and manage gallery or artist profiles</li>
                <li>Upload artwork information, images, and audio content</li>
                <li>Generate and distribute QR codes for artworks</li>
                <li>Access AR experiences as a visitor</li>
                <li>Purchase or sell artworks through our Marketplace</li>
                <li>View analytics and engagement data for your content</li>
              </ul>
              <h3>Restrictions</h3>
              <p>You may not:</p>
              <ul>
                <li>Use the Platform for any illegal purpose</li>
                <li>Reverse engineer or attempt to extract source code</li>
                <li>Interfere with the Platform's security features</li>
                <li>Use automated systems to access the Platform without permission</li>
                <li>Impersonate others or misrepresent your affiliation</li>
              </ul>
            </article>

            <article id="gallery-artist-terms" className={styles.section}>
              <h2>5. Gallery & Artist Terms</h2>
              <p>
                If you register as a gallery owner, museum, or artist, the following additional terms apply:
              </p>
              <h3>Content Ownership</h3>
              <p>
                You retain ownership of all artwork images, descriptions, audio guides, and other content you upload to the Platform. By uploading content, you grant Confidential Gallery a non-exclusive, worldwide, royalty-free licence to display, distribute, and promote your content in connection with the Platform.
              </p>
              <h3>Accuracy of Information</h3>
              <p>
                You are responsible for ensuring all artwork information, pricing, and availability is accurate and up-to-date. Misleading or false information may result in account suspension.
              </p>
              <h3>Compliance</h3>
              <p>
                You agree to comply with all applicable laws regarding the display and sale of artworks, including export regulations, cultural property laws, and consumer protection requirements.
              </p>
            </article>

            <article id="visitor-terms" className={styles.section}>
              <h2>6. Visitor Terms</h2>
              <p>
                If you use the Platform as a gallery visitor to access AR experiences:
              </p>
              <ul>
                <li>You may scan QR codes and access AR content for personal, non-commercial use</li>
                <li>You may not record, redistribute, or commercially exploit AR content</li>
                <li>You acknowledge that AR experiences require a compatible device and internet connection</li>
                <li>You are responsible for your physical safety while using AR features</li>
                <li>Location data may be collected to provide location-based features (with your consent)</li>
              </ul>
            </article>

            <article id="marketplace" className={styles.section}>
              <h2>7. Marketplace Terms</h2>
              <p>
                The Confidential Gallery Marketplace allows artists and galleries to sell original works, prints, and merchandise.
              </p>
              <h3>For Sellers</h3>
              <ul>
                <li>You must accurately describe all items, including condition, dimensions, and materials</li>
                <li>You are responsible for packaging, shipping, and delivery</li>
                <li>You must honour all confirmed orders unless there are exceptional circumstances</li>
                <li>Confidential Gallery charges a 10% commission on completed sales</li>
                <li>Payouts are processed within 7 business days of delivery confirmation</li>
              </ul>
              <h3>For Buyers</h3>
              <ul>
                <li>All sales are between you and the seller; Confidential Gallery facilitates the transaction</li>
                <li>You agree to pay the listed price plus any applicable shipping and taxes</li>
                <li>Refunds and returns are subject to the seller's stated policy</li>
                <li>Disputes should first be raised with the seller before contacting Confidential Gallery</li>
              </ul>
              <h3>Buyer Protection</h3>
              <p>
                Confidential Gallery offers buyer protection for qualifying purchases. If an item is significantly not as described or fails to arrive, you may be eligible for a full refund. Claims must be filed within 14 days of expected delivery.
              </p>
            </article>

            <article id="intellectual-property" className={styles.section}>
              <h2>8. Intellectual Property</h2>
              <h3>Confidential Gallery IP</h3>
              <p>
                The Platform, including its design, features, code, and branding, is owned by Confidential Gallery Ltd and protected by intellectual property laws. You may not copy, modify, or create derivative works without our written permission.
              </p>
              <h3>Trademarks</h3>
              <p>
                "Confidential Gallery," our logo, and other marks are trademarks of Confidential Gallery Ltd. You may not use these marks without our prior written consent.
              </p>
              <h3>Feedback</h3>
              <p>
                Any feedback, suggestions, or ideas you provide about the Platform may be used by us without any obligation to you.
              </p>
            </article>

            <article id="user-content" className={styles.section}>
              <h2>9. User Content</h2>
              <p>
                You are solely responsible for all content you upload, post, or transmit through the Platform ("User Content").
              </p>
              <h3>Content Standards</h3>
              <p>User Content must not:</p>
              <ul>
                <li>Infringe any third party's intellectual property rights</li>
                <li>Contain false, misleading, or fraudulent information</li>
                <li>Be defamatory, obscene, or offensive</li>
                <li>Promote illegal activities or violence</li>
                <li>Contain viruses or malicious code</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
              <h3>Content Removal</h3>
              <p>
                We reserve the right to remove any User Content that violates these Terms or that we find objectionable, without prior notice.
              </p>
            </article>

            <article id="prohibited-conduct" className={styles.section}>
              <h2>10. Prohibited Conduct</h2>
              <p>You agree not to engage in any of the following:</p>
              <ul>
                <li>Violating any applicable laws or regulations</li>
                <li>Infringing the rights of others</li>
                <li>Harassing, threatening, or intimidating other users</li>
                <li>Posting spam, chain letters, or pyramid schemes</li>
                <li>Attempting to gain unauthorised access to accounts or systems</li>
                <li>Interfering with the proper functioning of the Platform</li>
                <li>Scraping or harvesting data from the Platform</li>
                <li>Selling counterfeit or stolen artworks</li>
                <li>Money laundering or fraudulent transactions</li>
                <li>Circumventing fees or commissions</li>
              </ul>
            </article>

            <article id="payments" className={styles.section}>
              <h2>11. Payments & Fees</h2>
              <h3>Subscription Fees</h3>
              <p>
                Gallery and artist accounts may be subject to subscription fees as outlined in our pricing plans. Fees are billed in advance on a monthly or annual basis and are non-refundable except as required by law.
              </p>
              <h3>Commission</h3>
              <p>
                Confidential Gallery charges a 10% commission on all Marketplace sales. This fee is deducted from the sale price before payout to the seller.
              </p>
              <h3>Payment Processing</h3>
              <p>
                Payments are processed by third-party payment providers. By making a payment, you agree to the payment provider's terms of service. We are not responsible for errors or issues caused by payment providers.
              </p>
              <h3>Taxes</h3>
              <p>
                You are responsible for paying all applicable taxes related to your use of the Platform and any transactions you conduct.
              </p>
            </article>

            <article id="termination" className={styles.section}>
              <h2>12. Termination</h2>
              <h3>By You</h3>
              <p>
                You may terminate your account at any time by contacting us or using the account deletion feature. Upon termination, your right to use the Platform ceases immediately.
              </p>
              <h3>By Us</h3>
              <p>
                We may suspend or terminate your account at any time, with or without cause, and with or without notice. Reasons for termination may include:
              </p>
              <ul>
                <li>Violation of these Terms</li>
                <li>Fraudulent or illegal activity</li>
                <li>Extended periods of inactivity</li>
                <li>Requests by law enforcement</li>
                <li>Discontinuation of the Platform</li>
              </ul>
              <h3>Effect of Termination</h3>
              <p>
                Upon termination, your licence to use the Platform ends. We may delete your account data, though some information may be retained as required by law or for legitimate business purposes.
              </p>
            </article>

            <article id="disclaimers" className={styles.section}>
              <h2>13. Disclaimers</h2>
              <p>
                THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p>We do not warrant that:</p>
              <ul>
                <li>The Platform will be uninterrupted or error-free</li>
                <li>Defects will be corrected</li>
                <li>The Platform is free of viruses or harmful components</li>
                <li>The results of using the Platform will meet your requirements</li>
              </ul>
              <p>
                We do not endorse, guarantee, or assume responsibility for any artwork, content, or transactions between users.
              </p>
            </article>

            <article id="limitation" className={styles.section}>
              <h2>14. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, META GALLERY AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul>
                <li>Loss of profits, revenue, or data</li>
                <li>Business interruption</li>
                <li>Loss of goodwill</li>
                <li>Any other intangible losses</li>
              </ul>
              <p>
                Our total liability for any claims arising from your use of the Platform shall not exceed the greater of (a) the amount you paid us in the 12 months preceding the claim, or (b) £100.
              </p>
            </article>

            <article id="indemnification" className={styles.section}>
              <h2>15. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless Confidential Gallery and its officers, directors, employees, agents, and affiliates from any claims, damages, losses, liabilities, costs, and expenses (including legal fees) arising from:
              </p>
              <ul>
                <li>Your use of the Platform</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Your User Content</li>
                <li>Any transactions you conduct through the Platform</li>
              </ul>
            </article>

            <article id="disputes" className={styles.section}>
              <h2>16. Dispute Resolution</h2>
              <h3>Governing Law</h3>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of England and Wales, without regard to conflict of law principles.
              </p>
              <h3>Informal Resolution</h3>
              <p>
                Before initiating any legal action, you agree to contact us and attempt to resolve any dispute informally. We will work in good faith to resolve the matter within 30 days.
              </p>
              <h3>Jurisdiction</h3>
              <p>
                Any disputes that cannot be resolved informally shall be subject to the exclusive jurisdiction of the courts of England and Wales.
              </p>
            </article>

            <article id="changes" className={styles.section}>
              <h2>17. Changes to Terms</h2>
              <p>
                We may revise these Terms from time to time. The most current version will always be posted on this page with the "Last updated" date.
              </p>
              <p>
                If we make material changes, we will notify you by email or through a notice on the Platform prior to the changes becoming effective. Your continued use of the Platform after the effective date constitutes acceptance of the revised Terms.
              </p>
            </article>

            <article id="contact" className={styles.section}>
              <h2>18. Contact Information</h2>
              <p>If you have any questions about these Terms, please contact us:</p>
              <div className={styles.contactCard}>
                <p><strong>Confidential Gallery Ltd</strong></p>
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
            <Link href="/privacy" className={styles.relatedLink}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <div>
                <span className={styles.relatedTitle}>Privacy Policy</span>
                <span className={styles.relatedDesc}>How we collect and protect your data</span>
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