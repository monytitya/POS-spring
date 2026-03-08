package com.example.MSspringIntellij.model;

import jakarta.persistence.*;

@Entity
@Table(name = "manufacturers")
public class Manufacturer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "manufacturer_id")
    private Integer manufacturerId;

    @Column(name = "manufacturer_title")
    private String manufacturerTitle;

    @Column(name = "manufacturer_top")
    private String manufacturerTop;

    // We store the filename here, so no @Lob is needed
    @Column(name = "manufacturer_image")
    private String manufacturerImage;

    // --- CONSTRUCTORS ---

    // Default Constructor (Required by JPA)
    public Manufacturer() {
    }

    // All-Args Constructor
    public Manufacturer(Integer manufacturerId, String manufacturerTitle, String manufacturerTop,
            String manufacturerImage) {
        this.manufacturerId = manufacturerId;
        this.manufacturerTitle = manufacturerTitle;
        this.manufacturerTop = manufacturerTop;
        this.manufacturerImage = manufacturerImage;
    }

    // --- GETTERS ---

    public Integer getManufacturerId() {
        return manufacturerId;
    }

    public String getManufacturerTitle() {
        return manufacturerTitle;
    }

    public String getManufacturerTop() {
        return manufacturerTop;
    }

    public String getManufacturerImage() {
        return manufacturerImage;
    }

    // --- SETTERS ---

    public void setManufacturerId(Integer manufacturerId) {
        this.manufacturerId = manufacturerId;
    }

    public void setManufacturerTitle(String manufacturerTitle) {
        this.manufacturerTitle = manufacturerTitle;
    }

    public void setManufacturerTop(String manufacturerTop) {
        this.manufacturerTop = manufacturerTop;
    }

    public void setManufacturerImage(String manufacturerImage) {
        this.manufacturerImage = manufacturerImage;
    }

    // Optional: toString method for easier debugging in console
    @Override
    public String toString() {
        return "Manufacturer{" +
                "id=" + manufacturerId +
                ", title='" + manufacturerTitle + '\'' +
                ", top='" + manufacturerTop + '\'' +
                ", image='" + manufacturerImage + '\'' +
                '}';
    }
}