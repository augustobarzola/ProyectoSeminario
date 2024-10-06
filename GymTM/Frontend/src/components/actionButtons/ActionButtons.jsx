import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import CustomTooltip from '../customTooltip/CustomTooltip';

const ActionButtons = ({ handleConsult, handleEdit, handleToggleStatus, item }) => {
  return (
    <ButtonGroup>
      <CustomTooltip tooltipText="Consultar">
        <Button variant="primary" onClick={() => handleConsult(item.id)} className="me-2">
          <i className="fas fa-search"></i>
        </Button>
      </CustomTooltip>
      <CustomTooltip tooltipText="Editar">
        <Button variant="warning" onClick={() => handleEdit(item.id)} className="me-2">
          <i className="fas fa-edit"></i>
        </Button>
      </CustomTooltip>
      <CustomTooltip tooltipText={item.fecha_baja ? 'Activar' : 'Desactivar'}>
        <Button variant={item.fecha_baja ? 'success' : 'danger'} onClick={() => handleToggleStatus(item.id)}>
          <i className={`fas ${item.fecha_baja ? 'fa-check' : 'fa-ban'}`}></i>
        </Button>
      </CustomTooltip>
    </ButtonGroup>
  );
};

export default ActionButtons;