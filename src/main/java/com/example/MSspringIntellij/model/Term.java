package com.example.MSspringIntellij.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "terms")
public class Term {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "term_id")
    private Integer termId;

    @Column(name = "term_title")
    private String termTitle;

    @Column(name = "term_link")
    private String termLink;

    @Lob
    @Column(name = "term_desc")
    private String termDesc;

    // Getter and Setter for termId
    public Integer getTermId() {
        return termId;
    }

    public void setTermId(Integer termId) {
        this.termId = termId;
    }

    // Getter and Setter for termTitle
    public String getTermTitle() {
        return termTitle;
    }

    public void setTermTitle(String termTitle) {
        this.termTitle = termTitle;
    }

    // Getter and Setter for termLink
    public String getTermLink() {
        return termLink;
    }

    public void setTermLink(String termLink) {
        this.termLink = termLink;
    }

    // Getter and Setter for termDesc
    public String getTermDesc() {
        return termDesc;
    }

    public void setTermDesc(String termDesc) {
        this.termDesc = termDesc;
    }
}