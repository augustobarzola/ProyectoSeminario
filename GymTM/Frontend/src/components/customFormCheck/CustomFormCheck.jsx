import React, { useState } from 'react';
import { Row, Col, Form, FormGroup } from 'react-bootstrap';

const CustomFormCheck = ({
  label,
  controlId,
  value,
  onChange,
  options,
  isInvalid,
  feedback,
  option,
}) => {
  const [selectedValues, setSelectedValues] = useState(value || []); // State to track selected checkboxes

  const handleChange = (e) => {
    const newValue = e.target.checked
      ? [...selectedValues, e.target.value] // Add to selected values
      : selectedValues.filter((v) => v !== e.target.value); // Remove from selected values
    setSelectedValues(newValue);
    onChange(newValue); // Emit change with updated selected values
  };

  return (
    <Row className={`${option === 'C' && 'mb-2'}`}>
      <Col md={{ span: 2, offset: 2 }} className="d-flex align-items-center">
        <Form.Label htmlFor={controlId} className="pointer">
          {label}  
        </Form.Label>
        {!(option === 'C') && <span className="text-danger fs-2">*</span>}
      </Col>
      <Col md={6}>
        <FormGroup>
          {options && options.length > 0 ? (
            options.map((opt) => (
              <Form.Check
                key={opt.id}
                type="checkbox"
                id={`${controlId}-${opt.id}`}
                label={opt.name}
                value={opt.name} // Use name as value for simplicity
                checked={selectedValues.includes(opt.name)} // Check based on selected values
                isInvalid={isInvalid}
                disabled={option === 'C'}
                onChange={handleChange}
                className="bg-obscure text-white custom-border"
              />
            ))
          ) : (
            <Form.Check
              disabled
              id={controlId}
              label={value}
              value={value}
              isInvalid={isInvalid}
            />
          )}
          <Form.Control.Feedback type="invalid">
            {feedback || "Dato requerido."}
          </Form.Control.Feedback>
        </FormGroup>
      </Col>
    </Row>
  );
};

export default CustomFormCheck;