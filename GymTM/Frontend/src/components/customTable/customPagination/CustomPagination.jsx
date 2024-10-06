import React from 'react';
import { Pagination, Col, Row, Form } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import './CustomPagination.css';
import { useToggleSelect } from '../../../hooks/useToggleSelect';

const CustomPagination = ({ totalItems, pageSize, setPageSize }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const totalPages = Math.ceil(totalItems / pageSize);
  const { isOpen, handleToggle } = useToggleSelect('pageSizeSelect');

  // El paginador utiliza el index el cual va de 0, 1, 2, etc. Y yo quiero que el paginador empiece en 1, 2, 3, etc. Por eso le sumo 1 al index
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(location.search);
    params.set('page', newPage);
    navigate(`?${params.toString()}`, { replace: true }); // Actualiza la URL con el nuevo número de página
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    const params = new URLSearchParams(location.search);
    params.set('page', 1); // Reinicia la página a 1
    navigate(`?${params.toString()}`, { replace: true }); // Actualiza la URL
  };

  const pageNumber = (Number(new URLSearchParams(location.search).get('page')) || 1); // Obtiene el número de página de la URL

  return (
    <Row className="bg-dark m-0 align-items-center">
      <Col xs={4} md={3}>
        <span className="divPaginadorRegistros">Registros: {totalItems}</span>
      </Col>
      <Col xs={4} md={6} className="d-flex justify-content-center mt-3">
        <Pagination className="d-flex justify-content-center custom-pagination">
          <Pagination.Prev
            onClick={() => handlePageChange(pageNumber - 1)}
            disabled={pageNumber === 1}
          />
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index}
              active={index + 1 === pageNumber}
              onClick={() => handlePageChange(index + 1)}
              disabled={index + 1 === pageNumber}
              className={index + 1 === pageNumber ? 'active-disabled' : ''}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(pageNumber + 1)}
            disabled={pageNumber === totalPages}
          />
        </Pagination>
      </Col>
      <Col xs={4} md={3}>
        <div className="d-flex justify-content-end">
          <Form.Control
            as="select"
            id="pageSizeSelect"
            value={pageSize}
            onChange={handlePageSizeChange}
            onClick={handleToggle}
            className={`bg-obscure text-white custom-border custom-select pageSizeSelect ${isOpen && 'open'}`}
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Form.Control>
        </div>
      </Col>
    </Row>
  );
};

export default CustomPagination;