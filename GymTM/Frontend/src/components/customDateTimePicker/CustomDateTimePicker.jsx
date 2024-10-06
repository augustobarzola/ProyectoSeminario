import React, { useState } from 'react';
import { Row, Col, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './CustomDateTimePicker.css'; // Opcional, para estilos personalizados

const CustomDateTimePicker = ({
  label,
  controlId,
  register,
  errors,
  option,
  disabled,
  required = true,
  onChange = () => {},
}) => {
  const [selectedDate, setSelectedDate] = useState(null);

  // Formatea la fecha en dd/MM/yyyy
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Llamamos a la función onChange para actualizar el valor en el form
    const formattedDate = date ? formatDate(date) : '';
    onChange({ target: { name: controlId, value: formattedDate } });
  };

  const handleManualDateChange = (e) => {
    const dateValue = e.target.value;
    // Intentamos parsear la fecha introducida manualmente
    const [day, month, year] = dateValue.split('/');
    const parsedDate = new Date(`${year}-${month}-${day}`);
    
    if (!isNaN(parsedDate.getTime())) {
      setSelectedDate(parsedDate);
      onChange(e);
    } else {
      setSelectedDate(null); // Fecha inválida, no se puede parsear
    }
  };

  const isRequired = required && (option === 'A' || option === 'M');
  const isMarkable = !disabled && (option === 'A' || option === 'M');

  return (
    <Row className="mb-3">
      <Col md={{ span: 2, offset: 2 }} className="d-flex align-items-center">
        <Form.Label htmlFor={controlId} className={`${isMarkable && 'pointer'}`}>{label} &nbsp;</Form.Label>
        {isRequired && <span className="text-danger fs-2">*</span>}
      </Col>
      <Col md={6}>
        <InputGroup>
          {/* Input de texto manual */}
          <Form.Control
            type="text"
            id={controlId}
            value={selectedDate ? formatDate(selectedDate) : ''}
            {...register(controlId, {
              ...(isRequired && { required: "Dato requerido." }),
            })}
            onChange={handleManualDateChange}
            isInvalid={errors?.type === 'required'}
            disabled={disabled || option === 'C'}
            className="bg-obscure text-white custom-border"
          />

          {/* Ícono de calendario */}
          <InputGroup.Text 
            className={`bg-obscure p-2 d-flex justify-content-center ${!errors ? 'custom-border-left text-white' : 'border border-danger text-danger'}`}
          >
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              customInput={<FontAwesomeIcon icon={faCalendarAlt} style={{ cursor: 'pointer' }} />}
              dateFormat="dd/MM/yyyy"
              wrapperClassName="d-inline"
              popperPlacement="bottom-end"
            />
          </InputGroup.Text>
        </InputGroup>

        {/* Mensaje de error */}
        {errors?.message && (
          <div className="invalid-feedback d-block">
            {errors?.message || "Dato requerido."}
          </div>
        )}
      </Col>
    </Row>
  );
};

export default CustomDateTimePicker;