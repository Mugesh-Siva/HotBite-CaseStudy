package com.hexaware.hotbyte;

import com.hexaware.hotbyte.util.HibernateUtil;
import org.hibernate.SessionFactory;

public class Main {

    public static void main(String[] args) {

        try {
            SessionFactory sessionFactory = HibernateUtil.getSessionFactory();
        } catch (Exception e) {
            e.printStackTrace();

        } finally {
            HibernateUtil.shutdown();
        }
    }
}