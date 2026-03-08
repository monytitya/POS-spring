package com.example.MSspringIntellij.model;

import jakarta.persistence.*;

@Entity
@Table(name = "customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Integer customerId;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "customer_email")
    private String customerEmail;

    @Column(name = "customer_pass")
    private String customerPass;

    @Lob
    @Column(name = "customer_country")
    private String customerCountry;

    @Lob
    @Column(name = "customer_city")
    private String customerCity;

    @Column(name = "customer_contact")
    private String customerContact;

    @Lob
    @Column(name = "customer_address")
    private String customerAddress;

    @Lob
    @Column(name = "customer_image")
    private String customerImage;

    @Column(name = "customer_ip")
    private String customerIp;

    @Lob
    @Column(name = "customer_confirm_code")
    private String customerConfirmCode;

    // --- Getters ---

    public Integer getCustomerId() {
        return customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public String getCustomerPass() {
        return customerPass;
    }

    public String getCustomerCountry() {
        return customerCountry;
    }

    public String getCustomerCity() {
        return customerCity;
    }

    public String getCustomerContact() {
        return customerContact;
    }

    public String getCustomerAddress() {
        return customerAddress;
    }

    public String getCustomerImage() {
        return customerImage;
    }

    public String getCustomerIp() {
        return customerIp;
    }

    public String getCustomerConfirmCode() {
        return customerConfirmCode;
    }

    // --- Setters ---

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public void setCustomerPass(String customerPass) {
        this.customerPass = customerPass;
    }

    public void setCustomerCountry(String customerCountry) {
        this.customerCountry = customerCountry;
    }

    public void setCustomerCity(String customerCity) {
        this.customerCity = customerCity;
    }

    public void setCustomerContact(String customerContact) {
        this.customerContact = customerContact;
    }

    public void setCustomerAddress(String customerAddress) {
        this.customerAddress = customerAddress;
    }

    public void setCustomerImage(String customerImage) {
        this.customerImage = customerImage;
    }

    public void setCustomerIp(String customerIp) {
        this.customerIp = customerIp;
    }

    public void setCustomerConfirmCode(String customerConfirmCode) {
        this.customerConfirmCode = customerConfirmCode;
    }
}