package com.hexaware.hotbyte.service;

import com.hexaware.hotbyte.entity.Payment;
import java.util.List;
import com.hexaware.hotbyte.exception.*;

public interface PaymentService {
    Payment createPayment(Payment payment) throws DuplicateResourceException, InvalidInputException;
    Payment updatePayment(Payment payment) throws PaymentNotFoundException, InvalidInputException;
    void deletePayment(Integer id) throws PaymentNotFoundException;
    Payment getPaymentById(Integer id) throws PaymentNotFoundException;
    List<Payment> getAllPayments();
}

