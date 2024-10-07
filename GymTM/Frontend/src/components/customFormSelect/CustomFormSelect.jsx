import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import './CustomFormSelect.css';
import { useToggleSelect } from '../../hooks/useToggleSelect';

const CustomFormSelect = ({
  label,
  controlId,
  register,
  options,
  errors,
  option,
  required = true,
  disabled
}) => {
  const { isOpen, handleToggle } = useToggleSelect(controlId);

  const isRequired = required && (option === 'A' || option === 'M');
  const isMarkable = !disabled && (option === 'A' || option === 'M');

  return (
    <Row className={`${!isRequired && 'mb-2'}`}>
      <Col md={{ span: 2, offset: 2 }} className="d-flex align-items-center">
        <Form.Label htmlFor={controlId} onClick={handleToggle} className={`${isMarkable && 'pointer'}`}>{label} &nbsp;</Form.Label>
        {!(option === 'C') && <span className="text-danger fs-2">*</span>}
      </Col>
      <Col md={6}>
        <Form.Select
          id={controlId}
          onClick={handleToggle}
          {...register(controlId, {
            ...(isRequired && { required: "Dato requerido." }),
            setValueAs: value => {
              // Si el valor es una cadena que representa un número, conviértelo a un número
              if (!isNaN(value)) {
                return parseInt(value);
              }
              return value;
            }
          })}
          isInvalid={errors?.type === 'required'}
          disabled={disabled || option === 'C'}
          className={`bg-obscure text-white custom-border custom-select ${isOpen && 'open'}`}
        >
          {options.map((opt) => (
            <option key={opt.id} value={opt.name || opt.nombre}>
              {opt.name || opt.nombre}
            </option>
          ))}
        </Form.Select>
        {errors?.message && (
          <div className="invalid-feedback d-block">
            {errors?.message || "Dato requerido."}
          </div>
        )}
      </Col>
    </Row>
  );
};

export default CustomFormSelect;