package com.charles_silva.routing_solver_service;

import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SolverController {

	@PostMapping("/solve")
	public List<Integer> solve(@RequestBody long[][] distanceMatrix) {
		return Solver.solve(distanceMatrix);
	}
}