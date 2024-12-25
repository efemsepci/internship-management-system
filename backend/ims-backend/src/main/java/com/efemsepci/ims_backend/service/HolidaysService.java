package com.efemsepci.ims_backend.service;

import com.efemsepci.ims_backend.entity.Holidays;
import com.efemsepci.ims_backend.repository.HolidaysRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HolidaysService {
    @Autowired
    private HolidaysRepository holidaysRepository;

    public List<Holidays> getHolidays(){
        return holidaysRepository.findAll();
    }
    public Holidays saveHolidays(Holidays holiday){ return holidaysRepository.save(holiday); }
    public void deleteHolidayById(Long id){
        if(!holidaysRepository.existsById(id)){
            throw new IllegalArgumentException("Holiday not found id:" + id);
        }
        holidaysRepository.deleteById(id);
    }
}
