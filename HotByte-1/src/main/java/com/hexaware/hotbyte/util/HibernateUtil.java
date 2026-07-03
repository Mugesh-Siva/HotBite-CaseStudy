package com.hexaware.hotbyte.util;

import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

public class HibernateUtil {

    private static SessionFactory sessionFactory;

    static {
        try {
            sessionFactory = new Configuration()
                    .configure("hibernate.cfg.xml")
                    .buildSessionFactory();

            System.out.println("SessionFactory created successfully.");

        } catch (Exception e) {
            System.out.println("SessionFactory creation failed.");
            e.printStackTrace();
            throw new RuntimeException("Error while creating SessionFactory: " + e.getMessage());
        }
    }

    public static SessionFactory getSessionFactory() {
        return sessionFactory;
    }

    public static void shutdown() {
        if (sessionFactory != null) {
            sessionFactory.close();
            System.out.println("SessionFactory closed.");
        }
    }
}