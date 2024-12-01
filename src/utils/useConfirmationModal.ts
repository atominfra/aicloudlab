import { useState } from 'react';

export interface ModalOptions {
  message: string;
  onConfirm: () => Promise<void>;
}

const useConfirmationModal = () => {
  const [modalOptions, setModalOptions] = useState<ModalOptions | null>(null);

  const openModal = (message: string, onConfirm: () => Promise<void>) => {
    setModalOptions({ message, onConfirm });
  };

  const closeModal = () => {
    setModalOptions(null);
  };

  return { modalOptions, openModal, closeModal };
};

export default useConfirmationModal;
