import styles from './FormField.module.css';

/**
 * Reusable form field with label + input + error display.
 *
 * Supports two modes:
 *  1. react-hook-form integration via `register` prop
 *  2. Controlled mode via `value`/`onChange` props
 *
 * @param {string} label - Display label text
 * @param {string} id - HTML id for the input (also used as htmlFor)
 * @param {string} [type='text'] - Input type
 * @param {string} [error] - Error message to display below input
 * @param {object} [register] - Spread from react-hook-form's register()
 * @param {string} [placeholder] - Input placeholder
 * @param {string} [className] - Additional class for the wrapper
 */
const FormField = ({
  label,
  id,
  type = 'text',
  error,
  register,
  className,
  ...inputProps
}) => {
  return (
    <div className={`${styles.inputGroup} ${className || ''}`}>
      <label htmlFor={id}>{label}</label>
      <input type={type} id={id} {...register} {...inputProps} />
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default FormField;
