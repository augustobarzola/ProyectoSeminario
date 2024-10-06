import React, { useEffect } from 'react';
import { Row, Col, ListGroup, Dropdown } from 'react-bootstrap';
import CustomSpinner from '../customSpinner/CustomSpinner';

const CustomListGroup = ({ data, headData, itemData, handleConsult, handleEdit, handleToggleStatus, pagination }) => {
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.scrollHeight - 2 && pagination.hasMore && !pagination.isLoading) {
        pagination.page = pagination.page - 1
        pagination.getData({ page: pagination.page });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pagination]);

  return (
    <ListGroup variant="flush">
      {data?.map((item, index) => (
        <ListGroup.Item key={index} className="bg-dark text-white border-0 rounded mb-3">
          <Row className="d-flex align-items-top">
            <Col xs={2} sm={1} className="d-flex justify-content-end">
              <Dropdown>
                <Dropdown.Toggle variant="secondary" id={`dropdown-basic-${index}`}>
                  <i className="fas fa-ellipsis-v"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu className="bg-obscure">
                  <Dropdown.Item onClick={() => handleConsult(item.id)} className="text-gray">
                    <i className="fas fa-search"></i> Consultar
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleEdit(item.id)} className="text-gray">
                    <i className="fas fa-edit"></i> Editar
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleToggleStatus(item.id)} className="text-gray">
                    <i className={`fas ${item.deactivationDate ? 'fa-check' : 'fa-ban'}`}></i> {item.deactivationDate ? 'Activar' : 'Desactivar'}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        </ListGroup.Item>
      ))}
      {pagination.isLoading && <CustomSpinner />}
    </ListGroup>
  );
};

export default CustomListGroup;
