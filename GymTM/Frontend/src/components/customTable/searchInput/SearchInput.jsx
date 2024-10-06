import React from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import CustomTooltip from '../../customTooltip/CustomTooltip';

const SearchInput = ({ search, setSearch }) => {
  const handleClear = () => {
    setSearch('');
  }

  return (
    <InputGroup className='w-25'>
      <Form.Control
        type="text"
        placeholder="Buscar..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="bg-obscure text-white custom-border-right"
      />
      <InputGroup.Text className="bg-obscure w-5 p-0 d-flex justify-content-center custom-border-left text-white">
        <CustomTooltip tooltipText="Borrar texto">
          <Button className="bg-obscure border-0" onClick={handleClear}>
            <i className="fas fa-times"></i>
          </Button>
        </CustomTooltip>
      </InputGroup.Text>
    </InputGroup>
  );
};

export default SearchInput;