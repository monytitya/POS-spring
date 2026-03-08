package com.example.MSspringIntellij.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Integer productId;

    @Column(name = "p_cat_id")
    private Integer pCatId;

    @Column(name = "cat_id")
    private Integer catId;

    @Column(name = "manufacturer_id")
    private Integer manufacturerId;

    private LocalDateTime date;

    @Column(name = "product_title")
    private String productTitle;

    @Column(name = "product_url")
    private String productUrl;

    @Column(name = "product_img1")
    private String productImg1;

    @Column(name = "product_img2")
    private String productImg2;

    @Column(name = "product_img3")
    private String productImg3;

    @Column(name = "product_price")
    private Integer productPrice;

    @Column(name = "product_psp_price")
    private Integer productPspPrice;

    @Lob
    @Column(name = "product_desc")
    private String productDesc;

    @Lob
    @Column(name = "product_features")
    private String productFeatures;

    @Lob
    @Column(name = "product_video")
    private String productVideo;

    @Column(name = "product_keywords")
    private String productKeywords;

    @Column(name = "product_label")
    private String productLabel;

    private String status;

    // បន្ថែមក្នុង Class Product របស់អ្នក
    public Product() {
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public Integer getpCatId() {
        return pCatId;
    }

    public void setpCatId(Integer pCatId) {
        this.pCatId = pCatId;
    }

    public Integer getCatId() {
        return catId;
    }

    public void setCatId(Integer catId) {
        this.catId = catId;
    }

    public Integer getManufacturerId() {
        return manufacturerId;
    }

    public void setManufacturerId(Integer manufacturerId) {
        this.manufacturerId = manufacturerId;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getProductTitle() {
        return productTitle;
    }

    public void setProductTitle(String productTitle) {
        this.productTitle = productTitle;
    }

    public String getProductUrl() {
        return productUrl;
    }

    public void setProductUrl(String productUrl) {
        this.productUrl = productUrl;
    }

    public String getProductImg1() {
        return productImg1;
    }

    public void setProductImg1(String productImg1) {
        this.productImg1 = productImg1;
    }

    public String getProductImg2() {
        return productImg2;
    }

    public void setProductImg2(String productImg2) {
        this.productImg2 = productImg2;
    }

    public String getProductImg3() {
        return productImg3;
    }

    public void setProductImg3(String productImg3) {
        this.productImg3 = productImg3;
    }

    public Integer getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(Integer productPrice) {
        this.productPrice = productPrice;
    }

    public Integer getProductPspPrice() {
        return productPspPrice;
    }

    public void setProductPspPrice(Integer productPspPrice) {
        this.productPspPrice = productPspPrice;
    }

    public String getProductDesc() {
        return productDesc;
    }

    public void setProductDesc(String productDesc) {
        this.productDesc = productDesc;
    }

    public String getProductFeatures() {
        return productFeatures;
    }

    public void setProductFeatures(String productFeatures) {
        this.productFeatures = productFeatures;
    }

    public String getProductVideo() {
        return productVideo;
    }

    public void setProductVideo(String productVideo) {
        this.productVideo = productVideo;
    }

    public String getProductKeywords() {
        return productKeywords;
    }

    public void setProductKeywords(String productKeywords) {
        this.productKeywords = productKeywords;
    }

    public String getProductLabel() {
        return productLabel;
    }

    public void setProductLabel(String productLabel) {
        this.productLabel = productLabel;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
