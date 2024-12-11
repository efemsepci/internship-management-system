package com.efemsepci.ims_backend.controller;

import com.efemsepci.ims_backend.entity.Documents;
import com.efemsepci.ims_backend.service.DocumentsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/documents")
public class DocumentsController {

    @Autowired
    private DocumentsService documentsService;

    @GetMapping
    public ResponseEntity<List<Documents>> getAllDocuments() {
        return ResponseEntity.ok(documentsService.getAllDocuments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getDocumentById(@PathVariable Long id) {
        return documentsService.getDocumentById(id)
                .map(document -> ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=" + document.getFileName())
                        .body(document.getPdfFile()))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Documents> uploadDocument(
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        Documents document = new Documents();
        document.setFileName(file.getOriginalFilename());
        document.setPdfFile(file.getBytes());
        document.setUpdateDate(LocalDateTime.now());

        Documents savedDocument = documentsService.saveDocument(document);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate");
        headers.add(HttpHeaders.PRAGMA, "no-cache");
        headers.add(HttpHeaders.EXPIRES, "0");

        return ResponseEntity.status(HttpStatus.CREATED)
                .headers(headers)
                .body(savedDocument);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        if (documentsService.getDocumentById(id).isPresent()) {
            documentsService.deleteDocument(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable Long id) throws UnsupportedEncodingException {
        Documents document = documentsService.getDocumentById(id).orElse(null);

        if (document == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        String sanitizedFileName = document.getFileName().replace(" ", "_");

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename*=UTF-8''" + URLEncoder.encode(sanitizedFileName, "UTF-8"));
        headers.add(HttpHeaders.CONTENT_TYPE, "application/pdf");
        headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
        headers.add("Pragma", "no-cache");
        headers.add("Expires", "0");

        return ResponseEntity.ok()
                .headers(headers)
                .body(document.getPdfFile());
    }

}
