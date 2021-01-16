package com.charles_silva.routing_solver_service;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SolverController {

	@GetMapping("/solve")
	public String greeting() {
		return Solver.solve();
	}
}