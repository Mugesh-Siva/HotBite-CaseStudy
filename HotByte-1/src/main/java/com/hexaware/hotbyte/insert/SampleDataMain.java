package com.hexaware.hotbyte.insert;

import com.hexaware.hotbyte.entity.*;
import com.hexaware.hotbyte.util.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.math.BigDecimal;
import java.util.ArrayList;

public class SampleDataMain {
    public static void main(String[] args) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction transaction = null;

        try {
            transaction = session.beginTransaction();

            // 1. Roles (Root Entities)
            Role customerRole = new Role();
            customerRole.setRoleName("Customer");
            customerRole.setDescription("Normal food ordering customer");
            customerRole.setUsers(new ArrayList<>());

            Role ownerRole = new Role();
            ownerRole.setRoleName("Restaurant Owner");
            ownerRole.setDescription("Restaurant owner role");
            ownerRole.setUsers(new ArrayList<>());

            // 2. Users (Child of Role)
            User customer = new User();
            customer.setRole(customerRole);
            customer.setFullName("Rahul Kumar");
            customer.setEmail("rahul@example.com");
            customer.setPasswordHash("test123");
            customer.setContactNumber("9876543210");
            customer.setGender("Male");
            customer.setIsActive(true);
            customer.setRestaurants(new ArrayList<>());
            customer.setOrders(new ArrayList<>());
            customer.setUserAddresses(new ArrayList<>());
            
            customerRole.getUsers().add(customer); // Link to parent

            User owner = new User();
            owner.setRole(ownerRole);
            owner.setFullName("Amit Singh");
            owner.setEmail("amit@example.com");
            owner.setPasswordHash("test1234");
            owner.setContactNumber("8765432109");
            owner.setGender("Male");
            owner.setIsActive(true);
            owner.setRestaurants(new ArrayList<>());
            owner.setOrders(new ArrayList<>());

            ownerRole.getUsers().add(owner); // Link to parent

            // 3. UserAddress (Child of User)
            UserAddress address = new UserAddress();
            address.setUser(customer);
            address.setAddressLine1("123 Main Street");
            address.setCity("Mumbai");
            address.setState("Maharashtra");
            address.setZipCode("400001");
            address.setIsDefault(true);
            address.setOrders(new ArrayList<>());
            
            customer.getUserAddresses().add(address); // Link to parent

            // 4. Restaurant (Child of User)
            Restaurant restaurant = new Restaurant();
            restaurant.setOwnerUser(owner);
            restaurant.setRestaurantName("Spicy Delight");
            restaurant.setContactNumber("9988776655");
            restaurant.setIsActive(true);
            restaurant.setMenuItems(new ArrayList<>());
            restaurant.setOrders(new ArrayList<>());
            
            owner.getRestaurants().add(restaurant); // Link to parent

            // 5. RestaurantAddress (Child of Restaurant)
            RestaurantAddress restAddress = new RestaurantAddress();
            restAddress.setRestaurant(restaurant);
            restAddress.setAddressLine1("456 Food Street");
            restAddress.setCity("Mumbai");
            restAddress.setState("Maharashtra");
            restAddress.setZipCode("400002");
            restAddress.setLatitude(19.0760);
            restAddress.setLongitude(72.8777);
            
            restaurant.setRestaurantAddress(restAddress); // Link to parent

            // 6. Categories (Root Entities)
            Category cat1 = new Category();
            cat1.setCategoryName("Starters");
            cat1.setDescription("Appetizers to start your meal");
            cat1.setMenuItems(new ArrayList<>());

            Category cat2 = new Category();
            cat2.setCategoryName("Main Course");
            cat2.setDescription("Hearty main dishes");
            cat2.setMenuItems(new ArrayList<>());

            // 7. MenuItems (Child of Restaurant and Category)
            MenuItem item1 = new MenuItem();
            item1.setRestaurant(restaurant);
            item1.setCategory(cat1);
            item1.setItemName("Paneer Tikka");
            item1.setPrice(new BigDecimal("199.00"));
            item1.setIsOutOfStock(false);
            item1.setCartItems(new ArrayList<>());
            item1.setOrderItems(new ArrayList<>());
            
            restaurant.getMenuItems().add(item1);
            cat1.getMenuItems().add(item1);

            MenuItem item2 = new MenuItem();
            item2.setRestaurant(restaurant);
            item2.setCategory(cat2);
            item2.setItemName("Butter Chicken");
            item2.setPrice(new BigDecimal("299.00"));
            item2.setIsOutOfStock(false);
            item2.setCartItems(new ArrayList<>());
            item2.setOrderItems(new ArrayList<>());
            
            restaurant.getMenuItems().add(item2);
            cat2.getMenuItems().add(item2);

            MenuItem item3 = new MenuItem();
            item3.setRestaurant(restaurant);
            item3.setCategory(cat2);
            item3.setItemName("Dal Makhani");
            item3.setPrice(new BigDecimal("149.00"));
            item3.setIsOutOfStock(false);
            item3.setCartItems(new ArrayList<>());
            item3.setOrderItems(new ArrayList<>());
            
            restaurant.getMenuItems().add(item3);
            cat2.getMenuItems().add(item3);

            // 8. Cart (Child of User)
            Cart cart = new Cart();
            cart.setUser(customer);
            cart.setTotalCost(new BigDecimal("348.00"));
            cart.setCartItems(new ArrayList<>());
            
            customer.setCart(cart); // Link to parent

            // 9. CartItems (Child of Cart and MenuItem)
            CartItem cartItem1 = new CartItem();
            cartItem1.setCart(cart);
            cartItem1.setMenuItem(item1);
            cartItem1.setQuantity(1);
            cartItem1.setUnitPrice(new BigDecimal("199.00"));
            
            cart.getCartItems().add(cartItem1);
            item1.getCartItems().add(cartItem1);

            CartItem cartItem2 = new CartItem();
            cartItem2.setCart(cart);
            cartItem2.setMenuItem(item3);
            cartItem2.setQuantity(1);
            cartItem2.setUnitPrice(new BigDecimal("149.00"));
            
            cart.getCartItems().add(cartItem2);
            item3.getCartItems().add(cartItem2);

            // 10. Order (Child of User, Restaurant, UserAddress)
            Order order = new Order();
            order.setUser(customer);
            order.setRestaurant(restaurant);
            order.setShippingAddress(address);
            order.setTotalAmount(new BigDecimal("348.00"));
            order.setOrderStatus("Pending");
            order.setPaymentMethod("Credit Card");
            order.setOrderItems(new ArrayList<>());
            order.setOrderTrackingList(new ArrayList<>());
            
            customer.getOrders().add(order);
            restaurant.getOrders().add(order);
            address.getOrders().add(order);

            // 11. OrderItems (Child of Order and MenuItem)
            OrderItem orderItem1 = new OrderItem();
            orderItem1.setOrder(order);
            orderItem1.setMenuItem(item1);
            orderItem1.setQuantity(1);
            orderItem1.setPurchasedPrice(new BigDecimal("199.00"));
            
            order.getOrderItems().add(orderItem1);
            item1.getOrderItems().add(orderItem1);

            OrderItem orderItem2 = new OrderItem();
            orderItem2.setOrder(order);
            orderItem2.setMenuItem(item3);
            orderItem2.setQuantity(1);
            orderItem2.setPurchasedPrice(new BigDecimal("149.00"));
            
            order.getOrderItems().add(orderItem2);
            item3.getOrderItems().add(orderItem2);

            // 12. Payment (Child of Order)
            Payment payment = new Payment();
            payment.setOrder(order);
            payment.setTransactionId("TXN123456");
            payment.setPaymentStatus("Success");
            payment.setAmount(new BigDecimal("348.00"));
            
            order.setPayments(new ArrayList<>());
            order.getPayments().add(payment);

            // 13. OrderTracking (Child of Order)
            OrderTracking tracking1 = new OrderTracking();
            tracking1.setOrder(order);
            tracking1.setStatusUpdate("Order Placed");
            tracking1.setDescription("Your order has been placed successfully.");
            
            order.getOrderTrackingList().add(tracking1);

            OrderTracking tracking2 = new OrderTracking();
            tracking2.setOrder(order);
            tracking2.setStatusUpdate("Preparing");
            tracking2.setDescription("Restaurant has started preparing your order.");
            
            order.getOrderTrackingList().add(tracking2);

            // 1. Persist Categories first (independent roots, MenuItems rely on them)
            session.persist(cat1);
            session.persist(cat2);
            
            // 2. Persist Roles 
            session.persist(customerRole);
            session.persist(ownerRole);

            transaction.commit();
            System.out.println("Sample records inserted successfully using CascadeType.ALL!");

        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
        } finally {
            session.close();
        }
    }
}
