package com.hexaware.hotbyte.service.impl;

import com.hexaware.hotbyte.entity.Payment;
import com.hexaware.hotbyte.service.PaymentService;
import java.util.List;
import com.hexaware.hotbyte.exception.*;

public class PaymentServiceImpl implements PaymentService {

    @Override
    public Payment createPayment(Payment payment) throws DuplicateResourceException, InvalidInputException {
        return null;
    }

    @Override
    public Payment updatePayment(Payment payment) throws PaymentNotFoundException, InvalidInputException {
        return null;
    }

    @Override
    public void deletePayment(Integer id) throws PaymentNotFoundException {
    }

    @Override
    public Payment getPaymentById(Integer id) throws PaymentNotFoundException {
        return null;
    }

    @Override
    public List<Payment> getAllPayments() {
        return null;
    }
}

