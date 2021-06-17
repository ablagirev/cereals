// import clsx from 'clsx';
import { useField } from "formik";
import React from "react";

// import {ErrorMessage} from './ErrorMessage';

/**
 * Модель свойтсв компонента.
 *
 * @prop {string} name Имя (путь) поля в модели.
 * @prop {JSX.Element} children Оборачиваемый компонент.
 */
interface IProps {
  name: string;
  children: JSX.Element;
}

/**
 * Компонент-обёртка для подключения других компонентов к Formik.
 */
export const FormikField: React.FC<IProps> = (props: IProps) => {
  const [field, meta, helpers] = useField(props);
  const { children } = props;
  // const className = clsx(children.props?.className, meta.touched && meta.error ? 'is-invalid' : null);

  /**
   * Обработчик изменения значения.
   *
   * @param {string} value Новое значение.
   */
  const handleChange = (value: string): void => {
    helpers.setValue(value);
  };

  /**
   * Обработчик потери фокуса.
   */
  const handleBlur = (): void => {
    helpers.setTouched(true);
  };

  /**
   * Обработчик сброса значения.
   */
  const handleReset = () => {
    helpers.setValue(null);
  };

  return (
    <>
      {React.cloneElement(children, {
        ...field,
        onChange: children.props?.onChange
          ? children.props.onChange
          : handleChange,
        onBlur: children.props?.onBlur ? children.props.onBlur : handleBlur,
        // className,
        onReset: handleReset,
      })}

      {meta.touched && meta.error ? "Ошибка" : null}
    </>
  );
};
