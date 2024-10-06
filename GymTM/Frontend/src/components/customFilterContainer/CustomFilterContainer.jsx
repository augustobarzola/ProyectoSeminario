import React from 'react';
import { Form, Button } from 'react-bootstrap';
import CustomFormInput from '../customFormInput/CustomFormInput';
import CustomTooltip from '../customTooltip/CustomTooltip';

const CustomFilterContainer = ({
  title,
  option,
  handleAddItem,
  registerFilter,
  errorsFilter,
  handleSubmitFilter,
  handleFilterConsult,
  handleResetFilter
}) => {
  return (
    <>
      {/* Tabla visible solo en pantallas no móviles */}
      <div className="d-none d-md-block">
        <h2 className="text-center">{title}</h2>
        <hr />
        {option === 'L' && (
          <Form className="bg-dark rounded p-3" onSubmit={handleSubmitFilter(handleFilterConsult)}>
            <CustomFormInput
              label="Nombre"
              controlId="name"
              register={registerFilter}
              errors={errorsFilter.name}
              option={option}
              extra={
                <CustomTooltip tooltipText="Borrar texto">
                  <Button className="bg-obscure border-0" onClick={handleResetFilter}>
                    <i className="fas fa-times"></i>
                  </Button>
                </CustomTooltip>
              }
            />

            <div className="d-flex justify-content-center gap-3 mt-3">
              <Button variant="primary" size="lg" type="submit">
                <i className="fas fa-search"></i> Consultar
              </Button>
              <Button variant="success" size="lg" onClick={handleAddItem}>
                <i className="fas fa-plus"></i> Agregar
              </Button>
            </div>
          </Form>
        )}
      </div>

      {/* Lista visible solo en móviles */}
      <div className="d-md-none">
        <div className="d-flex align-items-center justify-content-center">
          {option === 'L' ? (
            <>
              <Button variant="primary" onClick={handleFilterConsult} title="Consultar">
                <i className="fas fa-search"></i>
              </Button>
              <h2 className="flex-grow-1 text-center">{title}</h2>
              <Button variant="success" onClick={handleAddItem} title="Agregar">
                <i className="fas fa-plus"></i>
              </Button>
            </>
          ) : (
            <h2>{title}</h2>
          )}
        </div>
        <hr />
      </div>
    </>
  );
}

export default CustomFilterContainer;