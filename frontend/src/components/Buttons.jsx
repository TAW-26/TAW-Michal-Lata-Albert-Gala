import styles from './Buttons.module.css';

const Button = ({ children, variant = 'primary', ...props }) => {
  const variantClass = styles[variant] || styles.primary;

  return (
    <button className={`${styles.baseButton} ${variantClass}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
