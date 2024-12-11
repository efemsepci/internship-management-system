package com.efemsepci.ims_backend.service;

import com.efemsepci.ims_backend.entity.Documents;
import com.efemsepci.ims_backend.repository.DocumentsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DocumentsService {

    @Autowired
    private DocumentsRepository documentsRepository;

    public List<Documents> getAllDocuments() {
        return documentsRepository.findAll();
    }

    public Optional<Documents> getDocumentById(Long id) {
        return documentsRepository.findById(id);
    }

    public Documents saveDocument(Documents document) {
        return documentsRepository.save(document);
    }

    public void deleteDocument(Long id) {
        documentsRepository.deleteById(id);
    }
}
