import { useState, useEffect } from 'react';

export const useToggleSelect = (controlId) => {
  const [isOpen, setIsOpen] = useState(false);

  // Función para alternar el estado de apertura del select
  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  // Función para cerrar el select cuando se hace clic fuera del mismo
  useEffect(() => {
    const select = document.getElementById(controlId);

    const handleClickOutside = (event) => {
      if (select && !select.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [controlId]);

  return { isOpen, handleToggle };
};