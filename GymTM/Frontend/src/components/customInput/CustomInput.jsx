import React from 'react';
import { Form } from 'react-bootstrap';

const CustomInput = ({ value, onChange, type = "text", placeholder }) => {
  return (
    <Form.Control
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="bg-obscure text-white custom-border w-25"
    />
  );
};

export default CustomInput;