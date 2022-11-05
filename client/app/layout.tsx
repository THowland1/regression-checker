import '../styles/reset.scss'
import '../styles/globals.scss'
import styles from './Layout.module.scss'


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <head></head>
      <body className={styles.body}>{children}</body>
    </html>
  )
}
