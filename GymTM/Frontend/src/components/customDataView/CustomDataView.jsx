import React from 'react';
import { Row, Col} from 'react-bootstrap';
import CustomTable from '../customTable/CustomTable';
import CustomListGroup from '../customListGroup/CustomListGroup';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../hooks/useIsMobile';

const CustomDataView = ({ data, headData, itemData, extraData, fixedFields, handleToggleStatus, totalItems, pagination, pageSize, setPageSize }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleEdit = (id) => {
    navigate(`?mode=M&id=${id}`, { replace: true });
  };

  const handleConsult = (id) => {
    navigate(`?mode=C&id=${id}`, { replace: true });
  };
  
  return (
      <Row>
        <Col xs={12}>
          {isMobile ? (
            /* Lista visible solo en pantallas chicas */
            <CustomListGroup 
              data={data} 
              headData={headData} 
              itemData={itemData} 
              handleConsult={handleConsult} 
              handleEdit={handleEdit} 
              handleToggleStatus={handleToggleStatus} 
              pagination={pagination} 
            />
          ) : (
            /* Tabla visible solo en pantallas grandes */
            <CustomTable 
              data={data} 
              headData={headData} 
              itemData={itemData} 
              extraData={extraData}
              fixedFields={fixedFields}
              handleConsult={handleConsult} 
              handleEdit={handleEdit} 
              handleToggleStatus={handleToggleStatus} 
              totalItems={totalItems} 
              pageSize={pageSize}
              setPageSize={setPageSize}
            />
          )}
        </Col>
      </Row>
  );
};

export default CustomDataView;
