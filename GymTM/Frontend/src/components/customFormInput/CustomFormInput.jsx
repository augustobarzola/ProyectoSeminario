import React from 'react';
import { Row, Col, Form, InputGroup } from 'react-bootstrap';
import './CustomFormInput.css';

const CustomFormInput = ({
  label,
  controlId,
  register,
  maxLength,
  rows,
  errors,
  option,
  disabled,
  extra,
  type = "text",
  as,
  required = true,
  onChange = () => {}
}) => {
  const isRequired = required && (option === 'A' || option === 'M');
  const isMarkable = !disabled && (option === 'A' || option === 'M');
  
  return (
    <Row className={`${!isRequired && 'mb-2'}`}>
      <Col md={{ span: 2, offset: 2 }} className="d-flex align-items-center">
        <Form.Label htmlFor={controlId} className={`${isMarkable && 'pointer'}`}>{label} &nbsp;</Form.Label>
        {isRequired && <span className="text-danger fs-2">*</span>}
      </Col>
      <Col md={6}>
        <InputGroup>
          <Form.Control
            type={type}
            as={as}
            id={controlId}
            maxLength={maxLength}
            rows={rows}
            {...register(controlId, {
              ...(isRequired && { required: "Dato requerido." }),
              maxLength: maxLength || 60
            })}
            onChange={(event) => onChange(event)}
            isInvalid={errors?.type === 'required' || errors?.type === 'maxLength'}
            disabled={disabled || option === 'C'}
            className={`bg-obscure text-white ${!errors && (extra ? 'custom-border-right' : 'custom-border')}`}
          />
          {extra && 
            <InputGroup.Text className={`bg-obscure w-5 p-0 d-flex justify-content-center ${!errors ? 'custom-border-left text-white' : 'border border-danger text-danger'}`}>
              {extra}
            </InputGroup.Text>
          }
        </InputGroup>
        {errors?.message && (
          <div className="invalid-feedback d-block">
            {errors?.message || "Dato requerido."}
          </div>
        )}
      </Col>
    </Row>
  );
};

export default CustomFormInput;