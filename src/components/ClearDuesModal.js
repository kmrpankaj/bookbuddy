import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const ClearDuesModal = ({ bookingId, show, handleClose, handleClearDues, amountDue, udf2Value, cashOld, onlineOld }) => {
    const [paymentType, setPaymentType] = useState('cash');
    //   const [udf2Value, setUdf2Value] = useState(0); // You'll need to pass this value from your parent component
    const [cashValue, setCashValue] = useState(0);
    const [onlineValue, setOnlineValue] = useState(0);

    useEffect(() => {
        // Reset values when the modal opens
        if (show) {
            setCashValue(udf2Value);
            setOnlineValue(0);
            setPaymentType('cash');
        }
    }, [show, udf2Value]);

    const handlePaymentTypeChange = (type) => {
        setPaymentType(type);
        if (type === 'cash') {
            setCashValue(udf2Value);
            setOnlineValue(0);
        } else if (type === 'online') {
            setCashValue(0);
            setOnlineValue(udf2Value);
        } else if (type === 'mixed') {
            setCashValue(0);
            setOnlineValue(udf2Value);
        }
    };

    const handleCashChange = (e) => {
        const cashAmount = parseFloat(e.target.value) || 0;
        setCashValue(cashAmount);
        setOnlineValue(udf2Value - cashAmount);
    };

    const handleOnlineChange = (e) => {
        const onlineAmount = parseFloat(e.target.value) || 0;
        setOnlineValue(onlineAmount);
        setCashValue(udf2Value - onlineAmount);
    };

    const handleSubmit = () => {
        if (paymentType === 'cash') {
            handleClearDues(bookingId, cashValue, 0);
        } else if (paymentType === 'online') {
            handleClearDues(bookingId, 0, onlineValue);
        } else if (paymentType === 'mixed') {
            handleClearDues(bookingId, cashValue, onlineValue);
        }
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Clear Dues of ₹{amountDue}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Check
                        type="radio"
                        label="Cash"
                        name="paymentType"
                        value="cash"
                        checked={paymentType === 'cash'}
                        onChange={() => handlePaymentTypeChange('cash')}
                    />
                    <Form.Check
                        type="radio"
                        label="Online"
                        name="paymentType"
                        value="online"
                        checked={paymentType === 'online'}
                        onChange={() => handlePaymentTypeChange('online')}
                    />
                    <Form.Check
                        type="radio"
                        label="Mixed"
                        name="paymentType"
                        value="mixed"
                        checked={paymentType === 'mixed'}
                        onChange={() => handlePaymentTypeChange('mixed')}
                    />

                    {paymentType === 'mixed' && (
                        <>
                            <Row>
                                <Col>
                                    <Form.Group controlId="formCashAmount">
                                        <Form.Label>Cash Amount</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={cashValue}
                                            onChange={handleCashChange}
                                            min="0"
                                            max={udf2Value}
                                        />
                                    </Form.Group>
                                </Col><Col>
                                    <Form.Group controlId="formOnlineAmount">
                                        <Form.Label>Online Amount</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={onlineValue}
                                            onChange={handleOnlineChange}
                                            min="0"
                                            max={udf2Value}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Submit
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ClearDuesModal;
