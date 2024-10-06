import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import CustomPagination from './customPagination/CustomPagination';
import ActionButtons from './actionButtons/ActionButtons';
import SearchInput from './searchInput/SearchInput';

const CustomTable = ({ data, headData, itemData, extraData, fixedFields, handleConsult, handleEdit, handleToggleStatus, totalItems, pageSize, setPageSize }) => {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState(null);

  // Filtrado y ordenación de datos
  const sortedData = React.useMemo(() => {
    let sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (sortConfig.key === 'price') {
          aValue = parseFloat(aValue.replace(/[^\d.-]/g, ''));
          bValue = parseFloat(bValue.replace(/[^\d.-]/g, ''));
        }
        if (sortConfig.key === 'discount') { 
          aValue = parseFloat(aValue);
          bValue = parseFloat(bValue);
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  const requestSort = key => {
    if (key === 'images' || key === 'image') {
      return;
    }

    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = sortedData.filter(item => {
    return itemData.some(key =>
      (key !== 'images' && key !== 'image') && item[key] && item[key].toString().toLowerCase().includes(search.toLowerCase())
    );
  });

  // Función para obtener la URL de la imagen
  const getImageSrc = (item) => {
    if (item.images && item.images.length > 0) {
      return item.images[0];
    } else if (item.image) {
      return item.image;
    }
    return null;
  };

  // Función para obtener extraData configurado para un campo específico
  const getExtraData = (field) => {
    return extraData?.find(extra => extra.item === field) || {};
  };

  // Función para renderizar el valor de un campo con extraData
  const renderFieldWithExtraData = (field, value) => {
    const extra = getExtraData(field);
    if (!extra.value) return value;

    return extra.position === 'start'
      ? `${extra.value} ${value}`
      : `${value} ${extra.value}`;
  };

  return (
    <div>
      <div className="d-flex justify-content-end">
        <SearchInput 
          search={search} 
          setSearch={setSearch} 
        />
      </div>
      <Table striped bordered hover variant="dark" className='m-0 custom-border' responsive>
        <thead>
          <tr>
            {headData.map((item, index) => (
              <th key={index} className="text-center text-nowrap" onClick={() => requestSort(itemData[index])}>
                {item} {sortConfig && sortConfig.key === itemData[index] && (
                  <i className={`fas fa-arrow-${sortConfig.direction === 'ascending' ? 'up' : 'down'}`}></i>
                )}
              </th>
            ))}
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredData?.map((item, index) => (
            <tr key={index}>
              {itemData.map((field, fieldIndex) => {
                const imageSrc = getImageSrc(item);

                return (
                  <td className="text-center" key={fieldIndex}>
                    {(field === 'images' || field === 'image') && (imageSrc) ? (
                      <img
                        src={imageSrc}
                        alt={`Imagen de ${item.name}`}         
                        style={{
                          width: '50px',
                          height: '50px',
                          objectFit: 'fill',
                        }}
                      />
                    ) : (
                      <span className={fixedFields?.includes(field) && 'text-nowrap'}>
                        {renderFieldWithExtraData(field, item[field])}
                      </span>
                    )}
                  </td>
                )
              })}
              <td className="col-2 text-center">
                <ActionButtons 
                  handleConsult={handleConsult} 
                  handleEdit={handleEdit} 
                  handleToggleStatus={handleToggleStatus} 
                  item={item} 
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <CustomPagination 
        totalItems={totalItems}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />
    </div>
  )
};

export default CustomTable;
