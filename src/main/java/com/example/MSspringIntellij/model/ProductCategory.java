package com.example.MSspringIntellij.model;

import jakarta.persistence.*;

@Entity
@Table(name = "p_cat")
public class ProductCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "p_cat_id")
    private Integer pCatId;

    @Column(name = "p_cat_image")
    private String pCatImage;

    @Column(name = "p_cat_title")
    private String pCatTitle;

    @Column(name = "p_cat_top")
    private String pCatTop;

    // Getter and Setter for pCatId
    public Integer getPCatId() {
        return pCatId;
    }

    public void setPCatId(Integer pCatId) {
        this.pCatId = pCatId;
    }

    // Getter and Setter for pCatImage
    public String getPCatImage() {
        return pCatImage;
    }

    public void setPCatImage(String pCatImage) {
        this.pCatImage = pCatImage;
    }

    // Getter and Setter for pCatTitle
    public String getPCatTitle() {
        return pCatTitle;
    }

    public void setPCatTitle(String pCatTitle) {
        this.pCatTitle = pCatTitle;
    }

    // Getter and Setter for pCatTop
    public String getPCatTop() {
        return pCatTop;
    }

    public void setPCatTop(String pCatTop) {
        this.pCatTop = pCatTop;
    }
}