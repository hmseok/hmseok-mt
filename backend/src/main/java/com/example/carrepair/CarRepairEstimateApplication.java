package com.example.carrepair;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.carrepair.domain.*;
import com.example.carrepair.repository.*;
import java.sql.Date;
import java.time.LocalDateTime;
import com.example.carrepair.repository.ScheduleRepository;
import com.example.carrepair.repository.TodoRepository;
import com.example.carrepair.domain.Schedule;
import com.example.carrepair.domain.Todo;
import java.time.LocalDate;

@SpringBootApplication
public class CarRepairEstimateApplication {

	public static void main(String[] args) {
		SpringApplication.run(CarRepairEstimateApplication.class, args);
	}

	@Bean
	public CommandLineRunner dataLoader(CustomerRepository customerRepository,
										  CarRepository carRepository,
										  AccidentRepository accidentRepository,
										  EstimateRepository estimateRepository,
										  RepairRepository repairRepository,
										  AccountingRepository accountingRepository,
										  ScheduleRepository scheduleRepository,
										  TodoRepository todoRepository) {
		return args -> {
			// 고객 생성
			Customer customer = new Customer();
			customer.setName("홍길동");
			customer.setPhone("010-1234-5678");
			customer.setInsurance("삼성화재");
			customerRepository.save(customer);

			// 차량 생성
			Car car = new Car();
			car.setCustomer(customer);
			car.setNumber("12가 3456");
			car.setModel("그랜저");
			car.setCarYear(2020);
			carRepository.save(car);

			// 사고 생성
			Accident accident = new Accident();
			accident.setCar(car);
			accident.setDate(Date.valueOf("2024-07-25"));
			accident.setLocation("서울 강남구");
			accident.setDescription("후방 추돌");
			accident.setStatus("처리중");
			accidentRepository.save(accident);

			// 견적 생성
			Estimate estimate = new Estimate();
			estimate.setAccident(accident);
			estimate.setTotalCost(1500000);
			estimate.setCreatedAt(LocalDateTime.now());
			estimateRepository.save(estimate);

			// 정비 생성
			Repair repair = new Repair();
			repair.setAccident(accident);
			repair.setItem("범퍼 교체");
			repair.setCost(1200000);
			repair.setDescription("후방 범퍼 전체 교체");
			repairRepository.save(repair);

			// 회계 생성
			Accounting accounting = new Accounting();
			accounting.setDate(Date.valueOf("2024-07-26"));
			accounting.setType("수입");
			accounting.setAmount(1500000);
			accounting.setDescription("보험금 입금");
			accounting.setAccident(accident);
			accountingRepository.save(accounting);

			// 스케줄 샘플 데이터
			Schedule schedule1 = new Schedule();
			schedule1.setTitle("홍길동 사고 견적");
			schedule1.setType("견적");
			schedule1.setRelatedId(1L);
			schedule1.setRelatedPath("/estimates");
			schedule1.setStartDate(LocalDate.of(2024, 7, 29));
			schedule1.setEndDate(LocalDate.of(2024, 7, 30));
			schedule1.setStatus("진행중");
			schedule1.setAssignedTo("김철수");
			schedule1.setPriority("높음");
			scheduleRepository.save(schedule1);

			Schedule schedule2 = new Schedule();
			schedule2.setTitle("김철수 차량 정비");
			schedule2.setType("정비");
			schedule2.setRelatedId(2L);
			schedule2.setRelatedPath("/repairs");
			schedule2.setStartDate(LocalDate.of(2024, 7, 30));
			schedule2.setEndDate(LocalDate.of(2024, 7, 31));
			schedule2.setStatus("예정");
			schedule2.setAssignedTo("이영희");
			schedule2.setPriority("보통");
			scheduleRepository.save(schedule2);

			// 투두 샘플 데이터
			Todo todo1 = new Todo();
			todo1.setTitle("홍길동 차량 정비 완료");
			todo1.setDescription("후방 범퍼 교체 작업 완료 확인");
			todo1.setAssignedTo("김철수");
			todo1.setDueDate(LocalDate.of(2024, 7, 30));
			todo1.setPriority("높음");
			todo1.setStatus("진행중");
			todoRepository.save(todo1);

			Todo todo2 = new Todo();
			todo2.setTitle("부품 재고 확인");
			todo2.setDescription("엔진오일 재고량 점검");
			todo2.setAssignedTo("이영희");
			todo2.setDueDate(LocalDate.of(2024, 7, 28));
			todo2.setPriority("보통");
			todo2.setStatus("완료");
			todoRepository.save(todo2);
		};
	}
}
