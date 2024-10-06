import React from "react";
import { Button } from "react-bootstrap";
import { useIsMobile } from '../../hooks/useIsMobile';

const CustomButtonsGroup = ({ mode, isSubmitting, handleBack }) => {
  const isMobile = useIsMobile();

  return (
    <div className="d-flex justify-content-center gap-3 mt-3">
      {mode !== 'C' && (
        <Button variant="primary" className={!isMobile && 'btn-lg'} type="submit">
        {isSubmitting ? <>
            <i className="fa-solid fa-spinner"></i> Cargando
          </> : <>
            <i className="fas fa-save"></i> Guardar
          </>
        }
      </Button>
      )}
      <Button variant="warning" className={!isMobile && 'btn-lg'} onClick={handleBack}>
        <i className="fas fa-rotate-left"></i> Volver
      </Button>
    </div>
  );
};

export default CustomButtonsGroup;