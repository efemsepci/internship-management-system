package com.efemsepci.ims_backend.controller;

import com.efemsepci.ims_backend.entity.Documents;
import com.efemsepci.ims_backend.entity.Evaluation;
import com.efemsepci.ims_backend.entity.Submission;
import com.efemsepci.ims_backend.service.DocumentsService;

import com.efemsepci.ims_backend.service.EvaluationService;
import com.efemsepci.ims_backend.service.SubmissionService;
import org.apache.pdfbox.cos.COSName;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDResources;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.apache.pdfbox.pdmodel.interactive.form.PDAcroForm;
import org.apache.pdfbox.pdmodel.interactive.form.PDComboBox;
import org.apache.pdfbox.pdmodel.interactive.form.PDField;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.print.Doc;
import java.io.*;
import java.net.URLEncoder;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/documents")
public class  DocumentsController {

    @Autowired
    private DocumentsService documentsService;

    @Autowired
    private SubmissionService submissionService;

    @Autowired
    private EvaluationService evaluationService;

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

    @GetMapping("/generate/{id}")
    public ResponseEntity<byte[]> generatePdf(@PathVariable Long id) throws IOException {
        Documents basvuruFormu = documentsService.getDocumentByName("basvuruformu.pdf");
        Documents kabulFormu = documentsService.getDocumentByName("kabulformu.pdf");
        Documents firmadanTalepForm = documentsService.getDocumentByName("firmadan-talep-edilecek-form.pdf");
        Documents stajBasvuruForm = documentsService.getDocumentByName("staj-basvuru-formu.pdf");

        Submission submission = submissionService.getSubmissionById(id).orElse(null);

        byte[] basvuruFormuPDF = basvuruFormu.getPdfFile();
        byte[] kabulFormuPDF = kabulFormu.getPdfFile();
        byte[] firmadanTalepFormPDF = firmadanTalepForm.getPdfFile();
        byte[] stajBasvuruFormPDF = stajBasvuruForm.getPdfFile();
        PDDocument documentBasvuruFormu = PDDocument.load(basvuruFormuPDF);
        PDDocument documentKabulFormu = PDDocument.load(kabulFormuPDF);
        PDDocument documentFirma = PDDocument.load(firmadanTalepFormPDF);
        PDDocument documentStajBasvuru = PDDocument.load(stajBasvuruFormPDF);

        // başvuru formu
        PDAcroForm acroFormBasvuru = documentBasvuruFormu.getDocumentCatalog().getAcroForm();
        if (acroFormBasvuru != null) {
            PDField nameField = acroFormBasvuru.getField("name-surname");
            if (nameField != null) {
                nameField.setValue(replaceTurkishCharacters(submission.getStdName() + " " + submission.getStdSurname()));
            }
            PDField stdIdField = acroFormBasvuru.getField("studentId");
            if (stdIdField != null) {
                stdIdField.setValue(replaceTurkishCharacters(submission.getStdId()));
            }
            PDField creditField = acroFormBasvuru.getField("credit");
            if (creditField != null) {
                creditField.setValue(replaceTurkishCharacters(submission.getCompletedCredit()));
            }
            PDField gpaField = acroFormBasvuru.getField("gpa");
            if (gpaField != null) {
                gpaField.setValue(replaceTurkishCharacters(submission.getGpa()));
            }
            PDField mandatoryField = acroFormBasvuru.getField("mandatory-internship");
            PDField volunteerField = acroFormBasvuru.getField("volunteer-internship");
            if (mandatoryField != null && volunteerField != null) {
                if (submission.getVoluntaryOrMandatory().equals("voluntary")) {
                    volunteerField.setValue("X");
                } else if (submission.getVoluntaryOrMandatory().equals("mandatory")) {
                    mandatoryField.setValue("X");
                }
            }
            PDField onsiteField = acroFormBasvuru.getField("onsite");
            PDField remoteField = acroFormBasvuru.getField("remote");
            if (onsiteField != null && remoteField != null) {
                if (submission.getInternshipType().equals("onsite")) {
                    onsiteField.setValue("X");
                } else if (submission.getInternshipType().equals("remote")) {
                    remoteField.setValue("X");
                }
            }
            PDField graduationStatus1 = acroFormBasvuru.getField("graduation-status1");
            PDField graduationStatus2 = acroFormBasvuru.getField("graduation-status2");
            PDField graduationStatus3 = acroFormBasvuru.getField("graduation-status3");
            PDField graduationStatus4 = acroFormBasvuru.getField("graduation-status4");
            PDField graduationStatus5 = acroFormBasvuru.getField("graduation-status5");
            PDField graduationStatus6 = acroFormBasvuru.getField("graduation-status6");
            if (graduationStatus1 != null && graduationStatus2 != null && graduationStatus3 != null && graduationStatus4 != null && graduationStatus5 != null && graduationStatus6 != null) {
                if (submission.getGraduationStatus().equals("1")) {
                    graduationStatus1.setValue("X");
                } else if (submission.getGraduationStatus().equals("2")) {
                    graduationStatus2.setValue("X");
                } else if (submission.getGraduationStatus().equals("3")) {
                    graduationStatus3.setValue("X");
                } else if (submission.getGraduationStatus().equals("4")) {
                    graduationStatus4.setValue("X");
                } else if (submission.getGraduationStatus().equals("5")) {
                    graduationStatus5.setValue("X");
                } else if (submission.getGraduationStatus().equals("6")) {
                    graduationStatus6.setValue("X");
                }
            }
            PDField summerSchoolYes = acroFormBasvuru.getField("summer-school-yes");
            PDField summerSchoolNo = acroFormBasvuru.getField("summer-school-no");
            if (summerSchoolYes != null && summerSchoolNo != null) {
                if (submission.getSummerSchool().equals("Yes")) {
                    summerSchoolYes.setValue("X");
                } else if (submission.getSummerSchool().equals("No")) {
                    summerSchoolNo.setValue("X");
                }
            }
            PDField explanationField = acroFormBasvuru.getField("explanation");
            if (explanationField != null) {
                explanationField.setValue(replaceTurkishCharacters(submission.getDescription()));
            }
            PDField companyNameField = acroFormBasvuru.getField("company-name");
            if (companyNameField != null) {
                companyNameField.setValue(replaceTurkishCharacters(submission.getCompanyName()));
            }
            PDField companyDepartmentField = acroFormBasvuru.getField("company-department");
            if (companyDepartmentField != null) {
                companyDepartmentField.setValue(replaceTurkishCharacters(submission.getInternDepartment()));
            }
            PDField startDateField = acroFormBasvuru.getField("start-date");
            if (startDateField != null) {
                String[] dateParts = submission.getStartDate().split("-");
                String startDate = dateParts[2] + "." + dateParts[1] + "." + dateParts[0];
                startDateField.setValue(startDate);
            }
            PDField endDateField = acroFormBasvuru.getField("end-date");
            if (endDateField != null) {
                String[] dateParts = submission.getEndDate().split("-");
                String endDate = dateParts[2] + "." + dateParts[1] + "." + dateParts[0];
                endDateField.setValue(endDate);
            }
            PDField workDayField = acroFormBasvuru.getField("work-day");
            if (workDayField != null) {
                workDayField.setValue(replaceTurkishCharacters(submission.getInternshipDays()));
            }
            acroFormBasvuru.flatten();

        }

        //kabul formu
        PDAcroForm acroFormKabul = documentKabulFormu.getDocumentCatalog().getAcroForm();
        if (acroFormKabul != null) {
            PDField nameField = acroFormKabul.getField("name-surname");
            if (nameField != null) {
                nameField.setValue(replaceTurkishCharacters(submission.getStdName() + " " + submission.getStdSurname()));
            }
            PDField stdIdField = acroFormKabul.getField("student-id");
            if(stdIdField != null){
                stdIdField.setValue(replaceTurkishCharacters(submission.getStdId()));
            }
            PDField companyNameField = acroFormKabul.getField("company-name");
            if(companyNameField != null){
                companyNameField.setValue(replaceTurkishCharacters(submission.getCompanyName()));
            }
            PDField companyAdrPhoneField = acroFormKabul.getField("company-adr-phone");
            if(companyAdrPhoneField != null){
                companyAdrPhoneField.setValue(replaceTurkishCharacters(submission.getAddress()) + " " + replaceTurkishCharacters(submission.getCompanyPhoneNumber()));
            }
            PDField companySectorField = acroFormKabul.getField("company-sector");
            if(companySectorField != null){
                companySectorField.setValue(replaceTurkishCharacters(submission.getSector()));
            }
            PDField companyPersonnelNumberField = acroFormKabul.getField("company-personnel-number");
            if(companyPersonnelNumberField != null){
                companyPersonnelNumberField.setValue(replaceTurkishCharacters(submission.getPersonnelNumber()));
            }
            PDField companyDepartmenNumberField = acroFormKabul.getField("company-department-number");
            if(companyDepartmenNumberField != null){
                companyDepartmenNumberField.setValue(replaceTurkishCharacters(submission.getDepartmentPersonnelNumber()));
            }
            PDField companyCENGNumberField = acroFormKabul.getField("company-ceng-number");
            if(companyCENGNumberField != null){
                companyCENGNumberField.setValue(replaceTurkishCharacters(submission.getDepartmentCENGNumber()));
            }
            PDField companyDepartmentField = acroFormKabul.getField("company-department");
            if(companyDepartmentField != null){
                companyDepartmentField.setValue(replaceTurkishCharacters(submission.getInternDepartment()));
            }
            PDField startDateField = acroFormKabul.getField("start-date");
            if (startDateField != null) {
                String[] dateParts = submission.getStartDate().split("-");
                String startDate = dateParts[2] + "." + dateParts[1] + "." + dateParts[0];
                startDateField.setValue(startDate);
            }
            PDField endDateField = acroFormKabul.getField("end-date");
            if (endDateField != null) {
                String[] dateParts = submission.getEndDate().split("-");
                String endDate = dateParts[2] + "." + dateParts[1] + "." + dateParts[0];
                endDateField.setValue(endDate);
            }
            PDField workDayField = acroFormKabul.getField("work-day");
            if (workDayField != null) {
                workDayField.setValue(replaceTurkishCharacters(submission.getInternshipDays()));
            }
            PDField coordinatorInfoField = acroFormKabul.getField("coordinator-info");
            if(coordinatorInfoField != null){
                coordinatorInfoField.setValue(replaceTurkishCharacters(submission.getInternAdvisorFullName()) + ", " + replaceTurkishCharacters(submission.getInternAdvisorJob()) + "\n" + replaceTurkishCharacters(submission.getInternAdvisorPhone() + "\n" + replaceTurkishCharacters(submission.getInternAdvisorMail())));
            }
            PDField internshipContextField = acroFormKabul.getField("internship-context");
            if(internshipContextField != null){
                String text = replaceTurkishCharacters(submission.getInternshipTopic());
                String formattedText = text.replaceAll("(.{50})", "$1\n");
                internshipContextField.setValue(formattedText);
            }
            PDField remoteField = acroFormKabul.getField("type-remote");
            PDField onsiteField = acroFormKabul.getField("type-onsite");
            if(remoteField != null && onsiteField != null){
                if (submission.getInternshipType().equals("onsite")) {
                    onsiteField.setValue("X");
                } else if (submission.getInternshipType().equals("remote")) {
                    remoteField.setValue("X");
                }
            }
            acroFormKabul.flatten();
        }
        ByteArrayOutputStream basvuruFormuOutput = new ByteArrayOutputStream();
        documentBasvuruFormu.save(basvuruFormuOutput);
        documentBasvuruFormu.close();

        ByteArrayOutputStream kabulFormuOutput = new ByteArrayOutputStream();
        documentKabulFormu.save(kabulFormuOutput);
        documentKabulFormu.close();

        ByteArrayOutputStream firmaFormuOutput = new ByteArrayOutputStream();
        documentFirma.save(firmaFormuOutput);
        documentFirma.close();

        ByteArrayOutputStream stajBasvuruFormuOutput = new ByteArrayOutputStream();
        documentStajBasvuru.save(stajBasvuruFormuOutput);
        documentStajBasvuru.close();

        ByteArrayOutputStream zipOutputStream = new ByteArrayOutputStream();
        try (ZipOutputStream zipOut = new ZipOutputStream(zipOutputStream)) {
            addPdfToZip(zipOut, "basvuru_formu.pdf", basvuruFormuOutput.toByteArray());
            addPdfToZip(zipOut, "kabul_formu.pdf", kabulFormuOutput.toByteArray());
            addPdfToZip(zipOut, "firmadan_talep_edilecek.pdf", firmaFormuOutput.toByteArray());
            addPdfToZip(zipOut, "staj_basvuru_formu.pdf", stajBasvuruFormuOutput.toByteArray());
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=forms.zip")
                .header(HttpHeaders.CONTENT_TYPE, "application/zip")
                .body(zipOutputStream.toByteArray());

    }


    @GetMapping("/generate-evaluation/{evaluationId}")
    public ResponseEntity<byte[]> generateEvaluationForm(@PathVariable Long evaluationId) throws IOException {
        Documents evaluationForm = documentsService.getDocumentByName("stajyerdegerlendirmeformu.pdf");

        Evaluation evaluation = evaluationService.getEvaluationById(evaluationId).orElse(null);

        byte[] evaluationFormPDF = evaluationForm.getPdfFile();
        PDDocument documentEvaluation = PDDocument.load(evaluationFormPDF);
        PDAcroForm acroFormEvaluation = documentEvaluation.getDocumentCatalog().getAcroForm();
            if (acroFormEvaluation != null) {
                PDField companyNameField = acroFormEvaluation.getField("company-name");
                if (companyNameField != null) {
                    companyNameField.setValue(replaceTurkishCharacters(evaluation.getCompanyName()));
                }
                PDField companySectorField = acroFormEvaluation.getField("company-sector");
                if (companySectorField != null) {
                    companySectorField.setValue(replaceTurkishCharacters(evaluation.getSector()));
                }
                PDField companyAdrField = acroFormEvaluation.getField("company-adr");
                if (companyAdrField != null) {
                    companyAdrField.setValue(replaceTurkishCharacters(evaluation.getAddress()));
                }
                PDField nameField = acroFormEvaluation.getField("name-surname");
                if (nameField != null) {
                    nameField.setValue(replaceTurkishCharacters(evaluation.getInternAdvisorFullName()));
                }
                PDField coordinatorJobField = acroFormEvaluation.getField("coordinator-job");
                if (coordinatorJobField != null) {
                    coordinatorJobField.setValue(replaceTurkishCharacters(evaluation.getInternAdvisorJob()));
                }
                PDField coordinatorPhoneField = acroFormEvaluation.getField("coordinator-phone");
                if (coordinatorPhoneField != null) {
                    coordinatorPhoneField.setValue(replaceTurkishCharacters(evaluation.getInternAdvisorPhone()));
                }
                PDField coordinatorEmailField = acroFormEvaluation.getField("coordinator-email");
                if (coordinatorEmailField != null) {
                    coordinatorEmailField.setValue(replaceTurkishCharacters(evaluation.getInternAdvisorMail()));
                }
                PDField CENGNumberField = acroFormEvaluation.getField("yeditepe-ceng");
                if (CENGNumberField != null) {
                    CENGNumberField.setValue(replaceTurkishCharacters(evaluation.getDepartmentCENGNumber()));
                }
                PDField stdNameField = acroFormEvaluation.getField("std-fullname");
                if (stdNameField != null) {
                    stdNameField.setValue(replaceTurkishCharacters(evaluation.getStdName() + " " + evaluation.getStdSurname()));
                }
                PDField internDepartmentField = acroFormEvaluation.getField("std-department");
                if (internDepartmentField != null) {
                    internDepartmentField.setValue(replaceTurkishCharacters(evaluation.getInternDepartment()));
                }
                PDField workDoneField = acroFormEvaluation.getField("work-done");
                if (workDoneField != null) {
                    workDoneField.setValue(replaceTurkishCharacters(evaluation.getWorkDone()));
                }
                PDField internshipPlaceField = acroFormEvaluation.getField("internship-place");
                if (internshipPlaceField != null) {
                    internshipPlaceField.setValue(replaceTurkishCharacters(evaluation.getInternshipPlace()));
                }
                PDComboBox companySizeField = (PDComboBox) acroFormEvaluation.getField("company-size");
                if (companySizeField != null) {
                    companySizeField.setValue(evaluation.getCompanySize());
                }
                List<String> evaluations = evaluation.getEvaluations();
                for (int i = 0; i < 20; i++) {
                    PDComboBox evaluationField = (PDComboBox) acroFormEvaluation.getField("evaluation" + (i + 1));
                    if (evaluationField != null) {
                        evaluationField.setValue(evaluations.get(i));
                    } else {
                        System.out.println("Field not found: evaluation" + (i + 1));
                    }
                }

                List<String> questions = evaluation.getQuestions();
                for (int i = 0; i < 3; i++) {
                    PDComboBox questionField = (PDComboBox) acroFormEvaluation.getField("questions" + (i + 1));
                    if (questionField != null) {
                        questionField.setValue(replaceTurkishCharacters(questions.get(i)));
                    } else {
                        System.out.println("Field not found: questions" + (i + 1));
                    }
                }

                PDField opinionField = acroFormEvaluation.getField("opinion");
                if (opinionField != null) {
                    opinionField.setValue(replaceTurkishCharacters(evaluation.getOpinion()));
                }
                PDField historyField = acroFormEvaluation.getField("history");
                if (historyField != null) {
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
                    String formattedDate = evaluation.getHistory().format(formatter);
                    historyField.setValue(formattedDate);
                }
                acroFormEvaluation.flatten();
            }

            ByteArrayOutputStream evaluationFormOutput = new ByteArrayOutputStream();
            documentEvaluation.save(evaluationFormOutput);
            documentEvaluation.close();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=evaluation_form.pdf")
                    .header(HttpHeaders.CONTENT_TYPE, "application/pdf")
                    .body(evaluationFormOutput.toByteArray());

        }
        public static String replaceTurkishCharacters (String input){
            if (input == null) {
                return null;
            }
            return input
                    .replace("ç", "c")
                    .replace("ğ", "g")
                    .replace("ü", "u")
                    .replace("ş", "s")
                    .replace("ö", "o")
                    .replace("ı", "i")
                    .replace("İ", "I")
                    .replace("ç", "c")
                    .replace("Ç", "C")
                    .replace("Ğ", "G")
                    .replace("Ü", "U")
                    .replace("Ş", "S")
                    .replace("Ö", "O");
        }
        private void addPdfToZip (ZipOutputStream zipOut, String fileName,byte[] fileData) throws IOException {
            ZipEntry entry = new ZipEntry(fileName);
            zipOut.putNextEntry(entry);
            zipOut.write(fileData);
            zipOut.closeEntry();
        }

}
