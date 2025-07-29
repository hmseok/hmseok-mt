package com.example.carrepair.service;

import com.example.carrepair.domain.Car;
import com.example.carrepair.domain.Customer;
import com.example.carrepair.repository.CarRepository;
import com.example.carrepair.repository.CustomerRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class ExcelService {
    
    @Autowired
    private CarRepository carRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    public List<Car> processCarExcel(MultipartFile file) throws IOException {
        List<Car> cars = new ArrayList<>();
        
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            
            // 첫 번째 행은 헤더로 건너뛰기
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;
                
                Car car = new Car();
                
                // 고객명으로 고객 찾기 또는 생성
                String customerName = getCellValue(row.getCell(0));
                Customer customer = findOrCreateCustomer(customerName);
                car.setCustomer(customer);
                
                // 차량 정보 설정
                car.setNumber(getCellValue(row.getCell(1))); // 차량번호
                car.setModel(getCellValue(row.getCell(2)));   // 차량모델
                
                // 연도 처리
                String yearStr = getCellValue(row.getCell(3));
                if (yearStr != null && !yearStr.trim().isEmpty()) {
                    try {
                        car.setYear(Integer.parseInt(yearStr.trim()));
                    } catch (NumberFormatException e) {
                        car.setYear(2020); // 기본값
                    }
                } else {
                    car.setYear(2020); // 기본값
                }
                
                cars.add(car);
            }
        }
        
        return cars;
    }
    
    private String getCellValue(Cell cell) {
        if (cell == null) return null;
        
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                } else {
                    return String.valueOf((int) cell.getNumericCellValue());
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return null;
        }
    }
    
    private Customer findOrCreateCustomer(String customerName) {
        if (customerName == null || customerName.trim().isEmpty()) {
            customerName = "미지정고객";
        }
        
        // 기존 고객 찾기
        List<Customer> existingCustomers = customerRepository.findByName(customerName);
        if (!existingCustomers.isEmpty()) {
            return existingCustomers.get(0);
        }
        
        // 새 고객 생성
        Customer newCustomer = new Customer();
        newCustomer.setName(customerName);
        newCustomer.setPhone("010-0000-0000");
        newCustomer.setInsurance("미지정");
        
        return customerRepository.save(newCustomer);
    }
} 