import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Row, Col, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

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
  const [manualInput, setManualInput] = useState('');

  const formatDate = (date) => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const isValidDate = (day, month, year) => {
    const parsedDate = new Date(`${year}-${month}-${day}`);
    return !isNaN(parsedDate.getTime()) && parsedDate.getDate() === parseInt(day);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const formattedDate = date ? formatDate(date) : '';
    setManualInput(formattedDate);
    onChange({ target: { name: controlId, value: formattedDate } });
  };

  const handleManualDateChange = (e) => {
    const value = e.target.value;
    setManualInput(value);

    const [day, month, year] = value.split('/');
    if (isValidDate(day, month, year)) {
      const parsedDate = new Date(`${year}-${month}-${day}`);
      setSelectedDate(parsedDate);
      onChange({ target: { name: controlId, value } });
    } else {
      setSelectedDate(null); // Fecha inválida
    }
  };

  return (
    <Row className="mb-3">
      <Col md={{ span: 2, offset: 2 }} className="d-flex align-items-center">
        <Form.Label htmlFor={controlId}>{label} &nbsp;</Form.Label>
        {required && (option === 'A' || option === 'M') && <span className="text-danger fs-2">*</span>}
      </Col>
      <Col md={6}>
        <InputGroup>
          {/* Input de texto manual */}
          <Form.Control
            type="text"
            id={controlId}
            value={manualInput}
            {...register(controlId, {
              ...(required && { required: "Dato requerido." }),
              pattern: {
                value: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
                message: "El formato debe ser dd/mm/yyyy",
              }
            })}
            onChange={handleManualDateChange}
            isInvalid={errors?.type === 'required'}
            disabled={disabled || option === 'C'}
            className="bg-obscure text-white custom-border"
          />

          {/* Ícono de calendario */}
          <InputGroup.Text className="bg-obscure p-2 d-flex justify-content-center custom-border text-white">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              customInput={<FontAwesomeIcon icon={faCalendarAlt} style={{ cursor: 'pointer' }} />}
              wrapperClassName="d-inline"
              popperPlacement="bottom-end"
             />
          </InputGroup.Text>
        </InputGroup>

        {/* Mensaje de error */}
        {errors?.message && (
          <div className="invalid-feedback d-block">
            {errors.message || "Dato requerido."}
          </div>
        )}
      </Col>
    </Row>
  );
};

export default CustomDateTimePicker;
