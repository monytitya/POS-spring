package com.example.MSspringIntellij.model;

import jakarta.persistence.*;

@Entity
@Table(name = "about_us")
public class AboutUs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "about_id")
    private Integer aboutId;

    @Lob
    @Column(name = "about_heading")
    private String aboutHeading;

    @Lob
    @Column(name = "about_short_desc")
    private String aboutShortDesc;

    @Lob
    @Column(name = "about_desc")
    private String aboutDesc;

    // --- Getters ---

    public Integer getAboutId() {
        return aboutId;
    }

    public String getAboutHeading() {
        return aboutHeading;
    }

    public String getAboutShortDesc() {
        return aboutShortDesc;
    }

    public String getAboutDesc() {
        return aboutDesc;
    }

    // --- Setters ---

    public void setAboutId(Integer aboutId) {
        this.aboutId = aboutId;
    }

    public void setAboutHeading(String aboutHeading) {
        this.aboutHeading = aboutHeading;
    }

    public void setAboutShortDesc(String aboutShortDesc) {
        this.aboutShortDesc = aboutShortDesc;
    }

    public void setAboutDesc(String aboutDesc) {
        this.aboutDesc = aboutDesc;
    }
}