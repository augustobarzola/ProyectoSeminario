import React, { useState } from 'react';
import { Form, InputGroup, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const CustomFormInputPassword = ({
  label,
  controlId,
  register,
  errors,
  placeholder = 'Ingrese la contraseña',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Row>
     <Col md={{ span: 2, offset: 2 }} className="d-flex align-items-center">
        <Form.Label htmlFor={controlId} className="pointer">{label} &nbsp;</Form.Label>
        <span className="text-danger fs-2">*</span>
      </Col>
      <Col md={6}>
        <InputGroup>
          <Form.Control
            type={showPassword ? 'text' : 'password'}
            placeholder={placeholder}
            {...register(controlId, {
              required: 'La contraseña es obligatoria.',
              minLength: {
                value: 6,
                message: 'La contraseña debe tener al menos 6 caracteres.'
              }
            })}
            isInvalid={errors}
            className="bg-obscure text-white custom-border-right"
          />
          <InputGroup.Text onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }} className="bg-obscure text-white custom-border rounded-end">
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </InputGroup.Text>
          <Form.Control.Feedback type="invalid">
            {errors?.message}
          </Form.Control.Feedback>
        </InputGroup>
      </Col>
    </Row>
  );
};

export default CustomFormInputPassword;