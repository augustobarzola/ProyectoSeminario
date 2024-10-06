import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

const CustomTooltip = ({ children, tooltipText, placement="auto" }) => {
  // Función para renderizar el Tooltip
  const renderTooltip = (props) => (
    <Tooltip id="custom-tooltip" {...props}>
      {tooltipText}
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement={placement}
      overlay={renderTooltip}
    >
      {children}
    </OverlayTrigger>
  );
};

export default CustomTooltip;