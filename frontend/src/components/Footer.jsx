import styles from './Footer.module.css';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <p>© TAW-Projekt Michał Lata, Albert Gala {year}</p>
    </footer>
  );
};

export default Footer;
