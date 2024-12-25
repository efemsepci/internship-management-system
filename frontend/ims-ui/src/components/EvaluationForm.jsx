import React, { useState } from 'react';
import EvaluationService from '../services/EvaluationService';
import DocumentsService from '../services/DocumentsService';
import "../style/makeSubmission.css"

const EvaluationForm = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    sector: "",
    address: "",
    internAdvisorFullName: "",
    internAdvisorJob: "",
    internAdvisorPhone: "",
    internAdvisorMail: "",
    departmentCENGNumber: "",
    stdName: "",
    stdSurname: "",
    internDepartment: "",
    workDone: "",
    internshipPlace: "",
    companySize: "",
    evaluations: Array(20).fill(),
    questions: Array(3).fill(), 
    opinion: "",
  });

  const user = JSON.parse(sessionStorage.getItem("user"));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEvaluationChange = (index, value) => {
    const updatedEvaluations = [...formData.evaluations];
    updatedEvaluations[index] = value;
    setFormData({ ...formData, evaluations: updatedEvaluations });
  };

  const handleQuestionsChange = (index, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = value;
    setFormData({...formData, questions: updatedQuestions});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const evaluation = {
        userId : user.id,
        companyName: formData.companyName,
        sector: formData.sector,
        address: formData.address,
        internAdvisorFullName: formData.internAdvisorFullName,
        internAdvisorJob: formData.internAdvisorJob,
        internAdvisorPhone: formData.internAdvisorPhone,
        internAdvisorMail: formData.internAdvisorMail,
        departmentCENGNumber: formData.departmentCENGNumber,
        stdName: formData.stdName,
        stdSurname: formData.stdSurname,
        internDepartment: formData.internDepartment,
        workDone: formData.workDone,
        internshipPlace: formData.internshipPlace,
        companySize: formData.companySize,
        evaluations: formData.evaluations,
        questions: formData.questions, 
        opinion: formData.opinion,
    }
    try {
      await EvaluationService.createEvaluation(evaluation);
      alert("Evaluation submitted successfully!");
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      alert("There was an error submitting the evaluation.");
    }

    const evaluationToBeForm = await EvaluationService.getByUserId(user.id);
        console.log(evaluationToBeForm.data[0]);
        if (evaluationToBeForm && evaluationToBeForm.data.length > 0) {
            const evaluationId = evaluationToBeForm.data[0].id; 
     
            const response = await DocumentsService.generateEvaluationDocument(evaluationId);
            if (response && response.data) {
                const blob = new Blob([response.data], { type: "application/pdf" });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "evaluation_form.pdf"; 
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
    
                console.log("File downloaded successfully!");
            } else {
                console.error("Failed to generate documents or no data received.");
            }
        }
  };

  const evaluationCriteria = [
    "Matematik, fen ve mühendislik bilgilerini uygulama becerisi",
    "Deney tasarlama, yapma, sonuçlarını analiz etme ve yorumlama becerisi",
    "Tasarım yapma becerisi",
    "Disiplinlerarası takımlarda çalışabilme becerisi",
    "Mühendislik problemlerini saptama, tanımlama, ve çözme becerisi",
    "Mesleki ve etik sorumluluk bilinci",
    "Etkin iletişim kurma",
    "Mühendislik çözümlerinin, evrensel ve toplumsal boyutlarda etkilerini anlama",
    "Yaşam boyu öğrenebilme becerisi",
    "Çağın sorunları hakkında bilgi",
    "Modern araçları ve teknikleri kullanma becerisi",
    "Bilgisayar bilimleri kuramı hakkında bilgi",
    "Girişimci ruha sahip olma",
    "Özgüven sahibi olma",
    "Yazılı ve sözlü sunumda başarı",
    "Alanında rekabet edebilme",
    "Bağımsız araştırma ve geliştirme yapabilme",
    "Yaratıcı olma",
    "İşe devamlılığı",
    "Genel Değerlendirme",
  ];

  return (
    <div className="form-container">
      <h2 className="forms-title">Evaluation Form</h2>
      <div className="custom-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Şirket/Kurum Adı</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Şirketin/Kurumun Faaliyet Alanı</label>
            <input
              type="text"
              name="sector"
              value={formData.sector}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Şirket/Kurum Adresi</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Şirketin/Kurumun Büyüklüğü</label>
            <select
              name="companySize"
              value={formData.companySize}
              onChange={handleChange}
            >
              <option value="">Seçiniz</option>
              <option value="Büyük Ölçekli">Büyük Ölçekli</option>
              <option value="Orta Ölçekli">Orta Ölçekli</option>
              <option value="Küçük Ölçekli">Küçük Ölçekli</option>
            </select>
          </div>
          <div className="form-group">
            <label>Adınız Soyadınız</label>
            <input
              type="text"
              name="internAdvisorFullName"
              value={formData.internAdvisorFullName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Göreviniz</label>
            <input
              type="text"
              name="internAdvisorJob"
              value={formData.internAdvisorJob}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Telefon</label>
            <input
              type="text"
              name="internAdvisorPhone"
              value={formData.internAdvisorPhone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>E-posta</label>
            <input
              type="text"
              name="internAdvisorEmail"
              value={formData.internAdvisorMail}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Şirketinizde/Kurumunuzda çalışan Yeditepe Üniversitesi mezunu Bilgisayar Mühendisi Sayısı</label>
            <input
              type="text"
              name="departmentCENGNumber"
              value={formData.departmentCENGNumber}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Değerlendirilen Stajyerin Adı</label>
            <input
              type="text"
              name="stdName"
              value={formData.stdName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Değerlendirilen Stajyerin Soyadı</label>
            <input
              type="text"
              name="stdSurname"
              value={formData.stdSurname}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Çalıştığı Bölüm</label>
            <input
              type="text"
              name="internDepartment"
              value={formData.internDepartment}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Yapılan işin adı ve Niteliği</label>
            <input
              type="text"
              name="workDone"
              value={formData.workDone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Staj yerinin niteliği</label>
            <input
              type="text"
              name="internshipPlace"
              value={formData.internshipPlace}
              onChange={handleChange}
            />
          </div>

          {evaluationCriteria.map((criterion, index) => (
            <div className="form-group" key={index}>
              <label>{criterion}</label>
              <select
                name={`evaluation${index}`}
                value={formData.evaluations[index]}
                onChange={(e) =>
                  handleEvaluationChange(index, e.target.value)
                }
              >
                <option value="">Seçiniz</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="id">id</option>
              </select>
            </div>
          ))}

<div className='form-group'>
                <label>Genel değerlendirme olarak, Yeditepe Üniversitesi Bilgisayar Mühendisliği mezunlarını diğer üniversitelerin Bilgisayar Mühendisliği mezunlarıyla nasıl karşılaştırırsınız?</label>
                <select name = {`questions[${0}]`} value={formData.questions[0]}  onChange={(e) => handleQuestionsChange(0, e.target.value)}>
                    <option value="">Seçiniz</option>
                    <option value="Çok iyi">Çok iyi</option>
                    <option value="İyi">İyi</option>
                    <option value="Orta">Orta</option>
                    <option value="Zayıf">Zayıf</option>
                </select>
              </div>
              <div className='form-group'>
                <label>Bu stajyerin gelecekte işyerinizde çalışmasını ister miydiniz?</label>
                <select name = {`questions${1}`} value={formData.questions[1]}  onChange={(e) => handleQuestionsChange(1, e.target.value)}>
                    <option value="">Seçiniz</option>
                    <option value="Evet">Evet</option>
                    <option value="Hayır">Hayır</option>
                </select>
              </div>

              <div className='form-group'>
                <label>Gelecek yıl Yeditepe Üniversitesi Bilgisayar Mühendisliği Bölümü’nden
                başka stajyerler çalıştırmak ister misiniz?</label>
                <select name = {`questions${2}`} value={formData.questions[2]}  onChange={(e) => handleQuestionsChange(2, e.target.value)}>
                    <option value="">Seçiniz</option>
                    <option value="Evet">Evet</option>
                    <option value="Hayır">Hayır</option>
                </select>
              </div>

          <div className="form-group">
            <label>Görüşleriniz</label>
            <textarea
              name="opinion"
              value={formData.opinion}
              onChange={handleChange}
            />
          </div>

          <button className='submit-btn' type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default EvaluationForm;
