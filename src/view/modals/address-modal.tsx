import React, { useState } from 'react';

interface AddressModalProps {
    initialAddress: string;
    updateAddress: (newAddress: string) => void;
    closeModal: () => void; // Function to close modal without saving
}

const AddressModal: React.FC<AddressModalProps> = ({ initialAddress, updateAddress, closeModal }) => {
    const [newAddress, setNewAddress] = useState(initialAddress);

    const handleUpdateAddress = () => {
        updateAddress(newAddress);
    };

    return (
        <div className="modal is-active">
            <div className="modal-background" onClick={closeModal}></div> {/* Close modal when clicking on background */}
            <div className="modal-content">
                <div className="box">
                    <h1 className="title is-4">Change Address</h1>
                    <input
                        className="input"
                        type="text"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                    />
                    <button
                        className="button is-primary mt-2"
                        onClick={handleUpdateAddress}
                    >
                        Update Address
                    </button>
                </div>
            </div>
            <button
                className="modal-close is-large"
                aria-label="close"
                onClick={closeModal} // Close modal when clicking on close button
            ></button>
        </div>
    );
};

export default AddressModal;
