package com.example.MSspringIntellij.model;

import jakarta.persistence.*;

@Entity
@Table(name = "coupons")
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "coupon_id")
    private Integer couponId;

    @Column(name = "product_id")
    private Integer productId;

    @Column(name = "coupon_title")
    private String couponTitle;

    @Column(name = "coupon_price")
    private String couponPrice;

    @Column(name = "coupon_code")
    private String couponCode;

    @Column(name = "coupon_limit")
    private Integer couponLimit;

    @Column(name = "coupon_used")
    private Integer couponUsed;

    // --- Getters ---

    public Integer getCouponId() {
        return couponId;
    }

    public Integer getProductId() {
        return productId;
    }

    public String getCouponTitle() {
        return couponTitle;
    }

    public String getCouponPrice() {
        return couponPrice;
    }

    public String getCouponCode() {
        return couponCode;
    }

    public Integer getCouponLimit() {
        return couponLimit;
    }

    public Integer getCouponUsed() {
        return couponUsed;
    }

    // --- Setters ---

    public void setCouponId(Integer couponId) {
        this.couponId = couponId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public void setCouponTitle(String couponTitle) {
        this.couponTitle = couponTitle;
    }

    public void setCouponPrice(String couponPrice) {
        this.couponPrice = couponPrice;
    }

    public void setCouponCode(String couponCode) {
        this.couponCode = couponCode;
    }

    public void setCouponLimit(Integer couponLimit) {
        this.couponLimit = couponLimit;
    }

    public void setCouponUsed(Integer couponUsed) {
        this.couponUsed = couponUsed;
    }
}