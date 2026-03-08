package com.example.MSspringIntellij.model;

import jakarta.persistence.*;

@Entity
@Table(name = "contact_us")
public class ContactUs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "contact_id")
    private Integer contactId;

    @Column(name = "contact_email")
    private String contactEmail;

    @Lob
    @Column(name = "contact_heading")
    private String contactHeading;

    @Lob
    @Column(name = "contact_desc")
    private String contactDesc;

    // ===== GETTERS =====

    public Integer getContactId() {
        return contactId;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public String getContactHeading() {
        return contactHeading;
    }

    public String getContactDesc() {
        return contactDesc;
    }

    // ===== SETTERS =====

    public void setContactId(Integer contactId) {
        this.contactId = contactId;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public void setContactHeading(String contactHeading) {
        this.contactHeading = contactHeading;
    }

    public void setContactDesc(String contactDesc) {
        this.contactDesc = contactDesc;
    }
}