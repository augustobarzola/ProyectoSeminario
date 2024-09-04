import React, { createContext, useContext, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmationModalContext = createContext();

export const useConfirmationModal = () => useContext(ConfirmationModalContext);

export const ConfirmationModalProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});

  const openModal = (data) => {
    setModalData(data);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleConfirm = () => {
    modalData.onConfirm();
    setShowModal(false);
  };

  return (
    <ConfirmationModalContext.Provider value={openModal}>
      {children}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header className="bg-dark text-white custom-border">
          <Modal.Title>{modalData.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">{modalData.message}</Modal.Body>
        <Modal.Footer className="d-flex justify-content-center bg-dark custom-border">
          <Button variant="primary" onClick={handleConfirm}>
            <i className="fas fa-check"></i> Confirmar
          </Button>
          <Button variant="warning" onClick={handleClose}>
            <i className="fas fa-ban"></i> Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </ConfirmationModalContext.Provider>
  );
};