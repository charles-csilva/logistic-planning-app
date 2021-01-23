package com.charles_silva.routing_solver_service;

import java.util.ArrayList;
import java.util.List;

import com.google.ortools.Loader;
import com.google.ortools.constraintsolver.Assignment;
import com.google.ortools.constraintsolver.FirstSolutionStrategy;
import com.google.ortools.constraintsolver.RoutingIndexManager;
import com.google.ortools.constraintsolver.RoutingModel;
import com.google.ortools.constraintsolver.RoutingSearchParameters;
import com.google.ortools.constraintsolver.main;

public class Solver {

    static class DataModel {
        public final int vehicleNumber = 1;
        public final int depot = 0;
    }

    private static List<Integer> getSolution(RoutingModel routing, RoutingIndexManager manager, Assignment solution) {
        List<Integer> route = new ArrayList<Integer>();
        long index = routing.start(0);
        while (!routing.isEnd(index)) {
            route.add(manager.indexToNode(index));
            index = solution.value(routing.nextVar(index));
        }
        route.add(manager.indexToNode(routing.end(0)));
        return route;
    }

    public static List<Integer> solve(long[][] distanceMatrix) {
        System.out.println("Starting solver...");
        Loader.loadNativeLibraries();
        // Instantiate the data problem.
        final DataModel data = new DataModel();

        // Create Routing Index Manager
        RoutingIndexManager manager = new RoutingIndexManager(distanceMatrix.length, data.vehicleNumber,
                data.depot);

        // Create Routing Model.
        RoutingModel routing = new RoutingModel(manager);

        // Create and register a transit callback.
        final int transitCallbackIndex = routing.registerTransitCallback((long fromIndex, long toIndex) -> {
            // Convert from routing variable Index to user NodeIndex.
            int fromNode = manager.indexToNode(fromIndex);
            int toNode = manager.indexToNode(toIndex);
            return distanceMatrix[fromNode][toNode];
        });

        // Define cost of each arc.
        routing.setArcCostEvaluatorOfAllVehicles(transitCallbackIndex);

        // Setting first solution heuristic.
        RoutingSearchParameters searchParameters = main.defaultRoutingSearchParameters().toBuilder()
                .setFirstSolutionStrategy(FirstSolutionStrategy.Value.PATH_CHEAPEST_ARC).build();

        // Solve the problem.
        Assignment solution = routing.solveWithParameters(searchParameters);
        System.out.println("Solution found");
        return getSolution(routing, manager, solution);
    }
}