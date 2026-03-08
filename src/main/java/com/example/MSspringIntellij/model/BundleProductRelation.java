package com.example.MSspringIntellij.model;

import jakarta.persistence.*;

@Entity
@Table(name = "bundle_product_relation")
public class BundleProductRelation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rel_id")
    private Integer relId;

    @Column(name = "rel_title")
    private String relTitle;

    @Column(name = "product_id")
    private Integer productId;

    @Column(name = "bundle_id")
    private Integer bundleId;

    // --- Getters ---

    public Integer getRelId() {
        return relId;
    }

    public String getRelTitle() {
        return relTitle;
    }

    public Integer getProductId() {
        return productId;
    }

    public Integer getBundleId() {
        return bundleId;
    }

    // --- Setters ---

    public void setRelId(Integer relId) {
        this.relId = relId;
    }

    public void setRelTitle(String relTitle) {
        this.relTitle = relTitle;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public void setBundleId(Integer bundleId) {
        this.bundleId = bundleId;
    }
}