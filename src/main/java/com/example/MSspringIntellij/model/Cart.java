package com.example.MSspringIntellij.model;

import jakarta.persistence.*;

@Entity
@Table(name = "cart")
public class Cart {

    @Id
    @Column(name = "p_id")
    private Integer pId;

    @Column(name = "ip_add")
    private String ipAdd;

    private Integer qty;

    @Column(name = "p_price")
    private String pPrice;

    @Lob
    private String size;

    // --- Getters ---

    public Integer getPId() {
        return pId;
    }

    public String getIpAdd() {
        return ipAdd;
    }

    public Integer getQty() {
        return qty;
    }

    public String getPPrice() {
        return pPrice;
    }

    public String getSize() {
        return size;
    }

    // --- Setters ---

    public void setPId(Integer pId) {
        this.pId = pId;
    }

    public void setIpAdd(String ipAdd) {
        this.ipAdd = ipAdd;
    }

    public void setQty(Integer qty) {
        this.qty = qty;
    }

    public void setPPrice(String pPrice) {
        this.pPrice = pPrice;
    }

    public void setSize(String size) {
        this.size = size;
    }
}