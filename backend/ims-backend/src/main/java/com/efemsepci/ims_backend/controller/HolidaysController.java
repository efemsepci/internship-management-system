package com.efemsepci.ims_backend.controller;

import com.efemsepci.ims_backend.entity.Holidays;
import com.efemsepci.ims_backend.service.HolidaysService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/holidays")
public class HolidaysController {
    @Autowired
    HolidaysService holidaysService;

    @GetMapping
    public ResponseEntity<List<Holidays>> getAllHolidays() {
        List<Holidays> holidays = holidaysService.getHolidays();
        return ResponseEntity.ok(holidays);
    }

    @PostMapping
    public ResponseEntity<Holidays> createHoliday(@RequestBody Holidays holiday) {
        Holidays savedHoliday = holidaysService.saveHolidays(holiday);
        return new ResponseEntity<>(savedHoliday, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteHoliday(@PathVariable Long id) {
        try {
            holidaysService.deleteHolidayById(id);
            return ResponseEntity.ok("Holiday deleted.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
