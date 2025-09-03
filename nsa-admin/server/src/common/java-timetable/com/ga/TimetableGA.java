package com.ga;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

/**
 * Don't be daunted by the number of classes in this chapter -- most of them are
 * just simple containers for information, and only have a handful of properties
 * with setters and getters.
 * 
 * The real stuff happens in the GeneticAlgorithm class and the Timetable class.
 * 
 * The Timetable class is what the genetic algorithm is expected to create a
 * valid version of -- meaning, after all is said and done, a chromosome is read
 * into a Timetable class, and the Timetable class creates a nicer, neater
 * representation of the chromosome by turning it into a proper list of Classes
 * with rooms and professors and whatnot.
 * 
 * The Timetable class also understands the problem's Hard Constraints (ie, a
 * professor can't be in two places simultaneously, or a room can't be used by
 * two classes simultaneously), and so is used by the GeneticAlgorithm's
 * calcFitness class as well.
 * 
 * Finally, we overload the Timetable class by entrusting it with the
 * "database information" generated here in initializeTimetable. Normally, that
 * information about what professors are employed and which classrooms the
 * university has would come from a database, but this isn't a book about
 * databases so we hardcode it.
 * 
 * @author bkanber
 *
 */
public class TimetableGA {

	static long start = System.currentTimeMillis();
	static long end;

	private static List<Class> prepareTimetable (Timetable timetable) {
		
		// Initialize GA  int populationSize, double mutationRate, double crossoverRate, int elitismCount,int tournamentSize
		 GeneticAlgorithm ga = new GeneticAlgorithm(100, 0.01, 1.0, 2, 5);
		
//		GeneticAlgorithm ga = new GeneticAlgorithm(100, 0.1, 0.9, 2, 5); //Bharat
        
        // Initialize population
        Population population = ga.initPopulation(timetable);
        
        // Evaluate population
        ga.evalPopulation(population, timetable);
        
        // Keep track of current generation
        int generation = 1;
        
        // Start evolution loop
        /*while (ga.isTerminationConditionMet(generation, 1000) == false
            && ga.isTerminationConditionMet(population) == false) {*/
        while (ga.isTerminationConditionMet(generation, 10000) == false
                && ga.isTerminationConditionMet(population) == false) {
            // Print fitness
//            System.out.println("G" + generation + " Best fitness: " + population.getFittest(0).getFitness());

            // Apply crossover
            population = ga.crossoverPopulation(population);

            // Apply mutation
            population = ga.mutatePopulation(population, timetable);

            // Evaluate population
            ga.evalPopulation(population, timetable);

            // Increment the current generation
            generation++;
        }
        
        // block of code to time

        end = System.currentTimeMillis();
//        System.out.println("Logic It took " + (end - start) + " milliseconds");
       

        // Print fitness
        timetable.createClasses(population.getFittest(0));
        System.out.println("Solution found in " + generation + " generations");
        System.out.println("Final solution fitness: " + population.getFittest(0).getFitness());
        System.out.println("Clashes: " + timetable.calcClashes());

        timetable.mergeBusyTimeslot();
        // Print classes
        System.out.println();
        Class classes[] = timetable.getClasses();
        List<Class> asList = Arrays.asList(classes);
        Collections.sort(asList, new ClassSortingComparator());
        return asList;
	}
	
	public List<Class> generateTimetable (Timetable timetable) {
		
		// Initialize GA  int populationSize, double mutationRate, double crossoverRate, int elitismCount,int tournamentSize
		 GeneticAlgorithm ga = new GeneticAlgorithm(100, 0.01, 1.0, 2, 5);
		 
		 //GeneticAlgorithm ga = new GeneticAlgorithm(1, 0.01, 1.0, 2, 5); //DEBUG
		
//		GeneticAlgorithm ga = new GeneticAlgorithm(100, 0.1, 0.9, 2, 5); //Bharat
        
        // Initialize population
        Population population = ga.initPopulation(timetable);
        
        // Evaluate population
        ga.evalPopulation(population, timetable);
        
        // Keep track of current generation
        int generation = 1;
        
        // Start evolution loop
        /*while (ga.isTerminationConditionMet(generation, 0) == false
            && ga.isTerminationConditionMet(population) == false) {*/ //DEBUG
        while (ga.isTerminationConditionMet(generation, 10000) == false
                && ga.isTerminationConditionMet(population) == false) {
            // Print fitness
//            System.out.println("G" + generation + " Best fitness: " + population.getFittest(0).getFitness());

            // Apply crossover
            population = ga.crossoverPopulation(population);

            // Apply mutation
            population = ga.mutatePopulation(population, timetable);

            // Evaluate population
            ga.evalPopulation(population, timetable);

            // Increment the current generation
            generation++;
        }
        
        // block of code to time

        end = System.currentTimeMillis();
//        System.out.println("Logic It took " + (end - start) + " milliseconds");
       

        // Print fitness
        timetable.createClasses(population.getFittest(0));
        System.out.println("Solution found in " + generation + " generations");
        System.out.println("Final solution fitness: " + population.getFittest(0).getFitness());
        System.out.println("Clashes: " + timetable.getClashes());

        timetable.setFinalFitness(population.getFittest(0).getFitness());
        timetable.mergeBusyTimeslot();
        // Print classes
        Class classes[] = timetable.getClasses();
        List<Class> asList = Arrays.asList(classes);
        Collections.sort(asList, new ClassSortingComparator());
        return asList;
	}
	
	public void printTimetables(List<Class> classes, Timetable timetable, StringBuilder sb) {
		System.out.println("class length ... " + classes.size());
        int classIndex = 1;
        StringBuilder column = new StringBuilder();
        /*column.append("\t");
        column.append("9:00 - 11:00, ");
        column.append("11:00 - 13:00,");
        column.append("13:00 - 15:00 \t");*/
        
        
        column.append(",");
        column.append(" 9:00 - 9:40,");
        column.append("9:40 - 10:20,");
        column.append("10:30 - 11:10,");
        column.append("11:10 - 11:50,");
        column.append("11:50 - 12:30,");
        column.append(" 1:15 - 1:55,");
        column.append(" 1:55 - 2:35,");
        column.append(" 2:40 - 3:20");
        sb.append(column.toString());
        sb.append("\n");
        System.out.println(column.toString());
        
        column = null;
        String[] days = new String[] { "Mon" , "Tue", "Wed", "Thur", "Fri" };
        int daysInd = 0;
        try {
        	for (Class bestClass : classes) {
        		StringBuilder cell = new StringBuilder();

        		cell.append("\"Class: ");
        		cell.append(timetable.getGroup(bestClass.getGroupId()).getGroupId());
        		cell.append(": ");
        		cell.append(timetable.getModule(bestClass.getModuleId()).getModuleCode());
        		cell.append("\n (");
        		cell.append(timetable.getProfessor(bestClass.getProfessorId()).getProfessorName());
        		cell.append(") \n");
        		cell.append(timetable.getTimeslot(bestClass.getTimeslotId()).getTimeslot());
        		cell.append("\",");

        		if (classIndex % 8 == 1) {
        			column = new StringBuilder();
        			daysInd = classIndex / 8;
        			column.append(days[daysInd % 5]);
        			column.append(",");
        			column.append(cell.toString());
        		} else if (classIndex % 8 == 0) {
        			column.append(cell.toString());
        			System.out.println(column.toString());
        			sb.append(column.toString());
        			sb.append("\n");
        			column = null;
        		} else {
        			column.append(cell.toString());
        		}


        		//            System.out.println("Class " + classIndex + ":");
        		/*System.out.println("Module: " + 
                    timetable.getModule(bestClass.getModuleId()).getModuleName());*/


        		 /*System.out.println("Group: " + 
                    timetable.getGroup(bestClass.getGroupId()).getGroupId());
//            System.out.println("Room: " + 
//                    timetable.getRoom(bestClass.getRoomId()).getRoomNumber());
            System.out.println("Professor: " + 
                    timetable.getProfessor(bestClass.getProfessorId()).getProfessorName());
            System.out.println("Time: " + 
                    timetable.getTimeslot(bestClass.getTimeslotId()).getTimeslot());
        		            System.out.println("-----");*/
        		classIndex++;
        	}
        } catch (Exception e) {
        	System.out.println("classIndex...." + classIndex + " daysInd="+daysInd);
        	e.printStackTrace();
        }
        end = System.currentTimeMillis();
        System.out.println("Final after pring It took " + (end - start) + " milliseconds");
	}

	public static void printTimetable(List<Class> classes, Timetable timetable, StringBuilder sb) {
		System.out.println("class length ... " + classes.size());
        int classIndex = 1;
        StringBuilder column = new StringBuilder();
        /*column.append("\t");
        column.append("9:00 - 11:00, ");
        column.append("11:00 - 13:00,");
        column.append("13:00 - 15:00 \t");*/
        
        
        column.append(",");
        column.append(" 9:00 - 9:40,");
        column.append("9:40 - 10:20,");
        column.append("10:30 - 11:10,");
        column.append("11:10 - 11:50,");
        column.append("11:50 - 12:30,");
        column.append(" 1:15 - 1:55,");
        column.append(" 1:55 - 2:35,");
        column.append(" 2:40 - 3:20");
        sb.append(column.toString());
        sb.append("\n");
        System.out.println(column.toString());
        
        column = null;
        String[] days = new String[] { "Mon" , "Tue", "Wed", "Thur", "Fri" };
        int daysInd = 0;
        try {
        	for (Class bestClass : classes) {
        		StringBuilder cell = new StringBuilder();

        		cell.append("\"Class: ");
        		cell.append(timetable.getGroup(bestClass.getGroupId()).getGroupId());
        		cell.append(": ");
        		cell.append(bestClass.getModuleId() == -1 ? "Free" : timetable.getModule(bestClass.getModuleId()).getModuleCode());
        		cell.append("\n (");
        		cell.append(bestClass.getProfessorId() == -1 ? "" : timetable.getProfessor(bestClass.getProfessorId()).getProfessorName());
        		cell.append(") \n");
        		cell.append(bestClass.getTimeslotId() == -1 ? -1 : timetable.getTimeslot(bestClass.getTimeslotId()).getTimeslot());
        		cell.append("\",");

        		if (classIndex % 8 == 1) {
        			column = new StringBuilder();
        			daysInd = classIndex / 8;
        			column.append(days[daysInd % 5]);
        			column.append(",");
        			column.append(cell.toString());
        		} else if (classIndex % 8 == 0) {
        			column.append(cell.toString());
        			System.out.println(column.toString());
        			sb.append(column.toString());
        			sb.append("\n");
        			column = null;
        		} else {
        			column.append(cell.toString());
        		}


        		//            System.out.println("Class " + classIndex + ":");
        		/*System.out.println("Module: " + 
                    timetable.getModule(bestClass.getModuleId()).getModuleName());*/


        		 /*System.out.println("Group: " + 
                    timetable.getGroup(bestClass.getGroupId()).getGroupId());
//            System.out.println("Room: " + 
//                    timetable.getRoom(bestClass.getRoomId()).getRoomNumber());
            System.out.println("Professor: " + 
                    timetable.getProfessor(bestClass.getProfessorId()).getProfessorName());
            System.out.println("Time: " + 
                    timetable.getTimeslot(bestClass.getTimeslotId()).getTimeslot());
        		            System.out.println("-----");*/
        		classIndex++;
        	}
        } catch (Exception e) {
        	System.out.println("classIndex...." + classIndex + " daysInd="+daysInd);
        	e.printStackTrace();
        }
        end = System.currentTimeMillis();
        System.out.println("Final after pring It took " + (end - start) + " milliseconds");
	}
	
	
	public static void printTimetable3(List<Class> classes, Timetable timetable, StringBuilder sb) {
		System.out.println("class length ... " + classes.size());
        int classIndex = 1;
        StringBuilder column = new StringBuilder();
        /*column.append("\t");
        column.append("9:00 - 11:00, ");
        column.append("11:00 - 13:00,");
        column.append("13:00 - 15:00 \t");*/
        
        
        column.append(",");
        column.append(" 9:00 - 11:00,");
        column.append("11:00 - 13:00,");
        column.append("13:00 - 15:00,");
        
        sb.append(column.toString());
        sb.append("\n");
        System.out.println(column.toString());
        
        column = null;
        String[] days = new String[] { "Mon" , "Tue", "Wed" };
        int daysInd = 0;
        try {
        	for (Class bestClass : classes) {
        		StringBuilder cell = new StringBuilder();

        		cell.append("\"Class: ");
        		cell.append(timetable.getGroup(bestClass.getGroupId()).getGroupId());
        		cell.append(": ");
        		cell.append(bestClass.getModuleId() == -1 ? "Free" : timetable.getModule(bestClass.getModuleId()).getModuleCode());
        		cell.append("\n (");
        		cell.append(bestClass.getProfessorId() == -1 ? "" : timetable.getProfessor(bestClass.getProfessorId()).getProfessorName());
        		cell.append(") \n");
        		cell.append(bestClass.getTimeslotId() == -1 ? -1 : timetable.getTimeslot(bestClass.getTimeslotId()).getTimeslot());
        		cell.append("\",");

        		if (classIndex % 3 == 1) {
        			column = new StringBuilder();
        			daysInd = classIndex / 3;
        			column.append(days[daysInd % 3]);
        			column.append(",");
        			column.append(cell.toString());
        		} else if (classIndex % 3 == 0) {
        			column.append(cell.toString());
        			System.out.println(column.toString());
        			sb.append(column.toString());
        			sb.append("\n");
        			column = null;
        		} else {
        			column.append(cell.toString());
        		}


        		//            System.out.println("Class " + classIndex + ":");
        		/*System.out.println("Module: " + 
                    timetable.getModule(bestClass.getModuleId()).getModuleName());*/


        		 /*System.out.println("Group: " + 
                    timetable.getGroup(bestClass.getGroupId()).getGroupId());
//            System.out.println("Room: " + 
//                    timetable.getRoom(bestClass.getRoomId()).getRoomNumber());
            System.out.println("Professor: " + 
                    timetable.getProfessor(bestClass.getProfessorId()).getProfessorName());
            System.out.println("Time: " + 
                    timetable.getTimeslot(bestClass.getTimeslotId()).getTimeslot());
        		            System.out.println("-----");*/
        		classIndex++;
        	}
        } catch (Exception e) {
        	System.out.println("classIndex...." + classIndex + " daysInd="+daysInd);
        	e.printStackTrace();
        }
        end = System.currentTimeMillis();
        System.out.println("Final after pring It took " + (end - start) + " milliseconds");
	}
	
	public static void main(String[] args) {
    	// Get a Timetable object with all the available information.
        Timetable timetable = initializeTimetable2();
        timetable.setNumOfDays(5);
        timetable.setNumOfPeriodsPerDay(8);
        timetable.setMaxNumPeriods(8);
        
        timetable.addGroup(1, 40, new HashMap<Integer, Integer>() { {put(1,5); put(2, 5); put(3, 3); put(4, 7); put(5, 5); 
		put(6, 6); put(7, 2); put(8, 2); put(9, 1); put(10, 1); put(11, 1);  put(12, 1); put(13, 1); } });
        
//        timetable.addGroup(1, 40, new HashMap<Integer, Integer>() { { put(1,8); put(2, 5); put(3,5); put(4, 5); put(5, 5);put(6, 6);  put(7, 2);put(8, 2);} });
        List<Class>  classes = prepareTimetable(timetable);
        printTimetable(classes, timetable, new StringBuilder());
		
		
		 /*Timetable timetable = initializeTimetable();
	        timetable.setNumOfDays(3);
	        timetable.setNumOfPeriodsPerDay(3);
	        timetable.setMaxNumPeriods(3);
	        
		timetable.addGroup(1, 10, new HashMap<Integer, Integer>() { {put(1,4); put(2, 2); put(3, 1); put(4, 2); } });
		List<Class>  classes = prepareTimetable(timetable);
        printTimetable3(classes, timetable, new StringBuilder());*/
		
		
		
		
        
		/*Timetable timetable = initializeTimetable2();
		
        timetable.addGroup(1, 40, new HashMap<Integer, Integer>() { {put(1,5); put(2, 5); put(3, 3); put(4, 7); put(5, 5); 
			put(6, 6); put(7, 2); put(8, 2); put(9, 1); put(10, 1); put(11, 1);  put(12, 1); put(13, 1); } });
        

//        
//        timetable.addGroup(2, 40, new HashMap<Integer, Integer>() { {put(1,5); put(2, 5); put(3, 3); put(4, 7); put(5, 5); 
//    		put(6, 6); put(7, 2); put(8, 2); put(9, 1); put(10, 1); put(11, 1);  put(12, 1); put(13, 1); } });
//        
//        
//    	timetable.addGroup(3, 40, new HashMap<Integer, Integer>() { {put(1,5); put(2, 5); put(3, 3); put(4, 7); put(5, 5); 
//    		put(6, 6); put(7, 2); put(8, 2); put(9, 1); put(10, 1); put(11, 1);  put(12, 1); put(13, 1); } });
//    	
//        
//    	timetable.addGroup(4, 40, new HashMap<Integer, Integer>() { {put(21,5); put(22, 5); put(23, 3); put(24, 7); put(25, 5); 
//    		put(26, 6); put(27, 2); put(28, 2); put(9, 1); put(10, 1); put(11, 1);  put(12, 1); put(13, 1); } });
//    	
//        
//    	timetable.addGroup(5, 40, new HashMap<Integer, Integer>() { {put(21,5); put(22, 5); put(23, 3); put(24, 7); put(25, 5); 
//    	put(26, 6); put(27, 2); put(28, 2); put(9, 1); put(10, 1); put(11, 1);  put(12, 1); put(13, 1); } });
//    	
//    	
//    	timetable.addGroup(6, 40, new HashMap<Integer, Integer>() { {put(21,5); put(22, 5); put(23, 3); put(24, 7); put(25, 5); 
//    	put(26, 6); put(27, 2); put(28, 2); put(9, 1); put(10, 1); put(11, 1);  put(12, 1); put(13, 1); } });
//    	
        
        StringBuilder sb = new StringBuilder();
        
        List<Class> classes1 = prepareTimetable(timetable);
        printTimetable(classes1, timetable, sb);
        Collection<Professor> allProfessors = timetable.getAllProfessors();
        for (Professor professor : allProfessors) {
			System.out.println(professor.getProfessorName() + " Busy hrs " + professor.getBusyTimeslotIds());
		}
        
        timetable.clearGroup();
        
        timetable.addGroup(2, 40, new HashMap<Integer, Integer>() { {put(1,5); put(2, 5); put(3, 3); put(4, 7); put(5, 5); 
			put(6, 6); put(7, 2); put(8, 2); put(9, 1); put(10, 1); put(11, 1);  put(12, 1); put(13, 1); } });
        
        List<Class> classes2 = prepareTimetable(timetable);
        printTimetable(classes2, timetable, sb);
        Collection<Professor> allProfessors2 = timetable.getAllProfessors();
        for (Professor professor : allProfessors2) {
			System.out.println(professor.getProfessorName() + " Busy hrs " + professor.getBusyTimeslotIds());
		}
        
        timetable.clearGroup();
        timetable.addGroup(3, 40, new HashMap<Integer, Integer>() { {put(1,5); put(2, 5); put(3, 3); put(4, 7); put(5, 5); 
			put(6, 6); put(7, 2); put(8, 2); put(9, 1); put(10, 1); put(11, 1);  put(12, 1); put(13, 1); } });
        
        List<Class> classes3 = prepareTimetable(timetable);
        printTimetable(classes3, timetable, sb);
        
        Collection<Professor> allProfessors3 = timetable.getAllProfessors();
        for (Professor professor : allProfessors3) {
			System.out.println(professor.getProfessorName() + " Busy hrs " + professor.getBusyTimeslotIds());
		}
//        sb.append(lavBusyHrs);
        writeToFile(sb.toString());*/
        
//        System.out.print("lavBusyHrs...." + lavBusyHrs);
    }
	
	private static void printProfessorsTimeslots(Professor professors) {
		
	}
	
	private static void writeToFile(String content) {

		BufferedWriter bw = null;
		FileWriter fw = null;

		try {

			fw = new FileWriter("/Users/bharatkumarr/Desktop/timetable4.csv");
			bw = new BufferedWriter(fw);
			bw.write(content);

			System.out.println("Done");

		} catch (IOException e) {

			e.printStackTrace();

		} finally {

			try {

				if (bw != null)
					bw.close();

				if (fw != null)
					fw.close();

			} catch (IOException ex) {

				ex.printStackTrace();

			}

		}

	}

    /**
     * Creates a Timetable with all the necessary course information.
     * 
     * Normally you'd get this info from a database.
     * 
     * @return
     */
	private static Timetable initializeTimetable() {
		// Create timetable
		Timetable timetable = new Timetable();

		// Set up rooms
		timetable.addRoom(1, "A1", 40);

		// Set up timeslots
		timetable.addTimeslot(1, "Mon 9:00 - 11:00");
		timetable.addTimeslot(2, "Mon 11:00 - 13:00");
		timetable.addTimeslot(3, "Mon 13:00 - 15:00");
		timetable.addTimeslot(4, "Tue 9:00 - 11:00");
		timetable.addTimeslot(5, "Tue 11:00 - 13:00");
		timetable.addTimeslot(6, "Tue 13:00 - 15:00");
		timetable.addTimeslot(7, "Wed 9:00 - 11:00");
		timetable.addTimeslot(8, "Wed 11:00 - 13:00");
		timetable.addTimeslot(9, "Wed 13:00 - 15:00");
		/*timetable.addTimeslot(10, "Thu 9:00 - 11:00");
		timetable.addTimeslot(11, "Thu 11:00 - 13:00");
		timetable.addTimeslot(12, "Thu 13:00 - 15:00");
		timetable.addTimeslot(13, "Fri 9:00 - 11:00");
		timetable.addTimeslot(14, "Fri 11:00 - 13:00");
		timetable.addTimeslot(15, "Fri 13:00 - 15:00");*/

		// Set up professors
		timetable.addProfessor(1, "Dr P Smith", new ArrayList<Integer>(){ { add(1); add(4);  add(6); add(7);  add(9);}});
//		timetable.addProfessor(1, "Dr P Smith");
		timetable.addProfessor(2, "Mrs E Mitchell", new ArrayList<Integer>(){ {add(1); add(3); add(6); add(7); }});
		timetable.addProfessor(3, "Dr R Williams", new ArrayList<Integer>(){ { add(3);  add(5); add(8); add(9);}});
		timetable.addProfessor(4, "Mr A Thompson");

		// Set up modules and define the professors that teach them
		timetable.addModule(1, "cs", "Computer Science", new int[] { 1 });
		timetable.addModule(2, "en", "English", new int[] { 2 });
		timetable.addModule(3, "mat", "Maths", new int[] { 3 });
		timetable.addModule(4, "phy", "Physics", new int[] { 4 });
//		timetable.addModule(5, "his", "History", new int[] { 4 });
//		timetable.addModule(6, "dra", "Drama", new int[] { 1, 4 });

		// Set up student groups and the modules they take.
//		timetable.addGroup(1, 10, new HashMap<Integer, Integer>() { {put(1,4); put(2, 3); put(3, 5); put(4, 3); } });
		/*timetable.addGroup(2, 30, new int[] { 2, 3, 5, 6 });
		timetable.addGroup(3, 18, new int[] { 3, 4, 5 });
		timetable.addGroup(4, 25, new int[] { 1, 4 });
		timetable.addGroup(5, 20, new int[] { 2, 3, 5 });
		timetable.addGroup(6, 22, new int[] { 1, 4, 5 });
		timetable.addGroup(7, 16, new int[] { 1, 3 });
		timetable.addGroup(8, 18, new int[] { 2, 6 });
		timetable.addGroup(9, 24, new int[] { 1, 6 });
		timetable.addGroup(10, 25, new int[] { 3, 4 });*/
		return timetable;
	}
	
	private static Timetable initializeTimetable3() {
		// Create timetable
		Timetable timetable = new Timetable();

		// Set up rooms
		timetable.addRoom(1, "A1", 40);

		// Set up timeslots
		timetable.addTimeslot(1, "{ \"day_id\": 1, \"period_id\": 1}");
		timetable.addTimeslot(2, "{ \"day_id\": 1, \"period_id\": 2}");
		timetable.addTimeslot(3, "{ \"day_id\": 1, \"period_id\": 3}");
		timetable.addTimeslot(4, "{ \"day_id\": 1, \"period_id\": 4}");
		timetable.addTimeslot(5, "{ \"day_id\": 1, \"period_id\": 6}");
		timetable.addTimeslot(6, "{ \"day_id\": 1, \"period_id\": 7}");
		timetable.addTimeslot(7, "{ \"day_id\": 1, \"period_id\": 8}");
		timetable.addTimeslot(8, "{ \"day_id\": 1, \"period_id\": 9}");
		timetable.addTimeslot(9, "{ \"day_id\": 2, \"period_id\": 1}");
		timetable.addTimeslot(10, "{ \"day_id\": 2, \"period_id\": 2}");
		timetable.addTimeslot(11, "{ \"day_id\": 2, \"period_id\": 3}");
		timetable.addTimeslot(12, "{ \"day_id\": 2, \"period_id\": 4}");
		timetable.addTimeslot(13, "{ \"day_id\": 2, \"period_id\": 6}");
		timetable.addTimeslot(14, "{ \"day_id\": 2, \"period_id\": 7}");
		timetable.addTimeslot(15, "{ \"day_id\": 2, \"period_id\": 8}");
		timetable.addTimeslot(16, "{ \"day_id\": 2, \"period_id\": 9}");
		timetable.addTimeslot(17, "{ \"day_id\": 3, \"period_id\": 1}");
		timetable.addTimeslot(18, "{ \"day_id\": 3, \"period_id\": 2}");
		timetable.addTimeslot(19, "{ \"day_id\": 3, \"period_id\": 3}");
		timetable.addTimeslot(20, "{ \"day_id\": 3, \"period_id\": 4}");
		timetable.addTimeslot(21, "{ \"day_id\": 3, \"period_id\": 6}");
		timetable.addTimeslot(22, "{ \"day_id\": 3, \"period_id\": 7}");
		timetable.addTimeslot(23, "{ \"day_id\": 3, \"period_id\": 8}");
		timetable.addTimeslot(24, "{ \"day_id\": 3, \"period_id\": 9}");
		timetable.addTimeslot(25, "{ \"day_id\": 4, \"period_id\": 1}");
		timetable.addTimeslot(26, "{ \"day_id\": 4, \"period_id\": 2}");
		timetable.addTimeslot(27, "{ \"day_id\": 4, \"period_id\": 3}");
		timetable.addTimeslot(28, "{ \"day_id\": 4, \"period_id\": 4}");
		timetable.addTimeslot(29, "{ \"day_id\": 4, \"period_id\": 6}");
		timetable.addTimeslot(30, "{ \"day_id\": 4, \"period_id\": 7}");
		timetable.addTimeslot(31, "{ \"day_id\": 4, \"period_id\": 8}");
		timetable.addTimeslot(32, "{ \"day_id\": 4, \"period_id\": 9}");
		timetable.addTimeslot(33, "{ \"day_id\": 5, \"period_id\": 1}");
		timetable.addTimeslot(34, "{ \"day_id\": 5, \"period_id\": 2}");
		timetable.addTimeslot(35, "{ \"day_id\": 5, \"period_id\": 3}");
		timetable.addTimeslot(36, "{ \"day_id\": 5, \"period_id\": 4}");
		timetable.addTimeslot(37, "{ \"day_id\": 5, \"period_id\": 6}");
		timetable.addTimeslot(38, "{ \"day_id\": 5, \"period_id\": 7}");
		timetable.addTimeslot(39, "{ \"day_id\": 5, \"period_id\": 8}");
		timetable.addTimeslot(40, "{ \"day_id\": 5, \"period_id\": 9}");

		// Set up professors
//		timetable.addProfessor(1, "Dr P Smith", new ArrayList<Integer>(){ {add(1); add(2); add(3); add(4); add(5); add(6); add(7); add(8); add(9);}});
		timetable.addProfessor(1, "bharat");
		timetable.addProfessor(2, "kamala");
		timetable.addProfessor(3, "Karthick");
		timetable.addProfessor(4, "Poojitha");
		timetable.addProfessor(5, "Senthil");
		timetable.addProfessor(6, "Priya");
		timetable.addProfessor(7, "Deepak");
		timetable.addProfessor(8, "Anjan");
		
		// Set up modules and define the professors that teach them
		timetable.addModule(1, "Mathematics", "f8ad6611-638a-4038-951a-60c57b71cb2f", new int[] { 1 });
		timetable.addModule(2, "Tamil", "1e9ed215-6c28-4988-8ae5-38289c4ece6d", new int[] { 2 });
		timetable.addModule(3, "English", "f8ad6611-638a-4038-951a-60c57b71cb2f", new int[] { 3 });
		timetable.addModule(4, "Hindi", "1e9ed215-6c28-4988-8ae5-38289c4ece6d", new int[] { 4 });
		timetable.addModule(5, "Science", "f8ad6611-638a-4038-951a-60c57b71cb2f", new int[] { 5 });
		timetable.addModule(6, "Social", "1e9ed215-6c28-4988-8ae5-38289c4ece6d", new int[] { 6 });
		timetable.addModule(7, "PT", "1e9ed215-6c28-4988-8ae5-38289c4ece6d", new int[] { 7 });
		timetable.addModule(8, "Arts", "1e9ed215-6c28-4988-8ae5-38289c4ece6d", new int[] { 8 });

		// Set up student groups and the modules they take.
//		timetable.addGroup(1, 10, new HashMap<Integer, Integer>() { {put(1,4); put(2, 3); put(3, 5); put(4, 3); } });
		/*timetable.addGroup(2, 30, new int[] { 2, 3, 5, 6 });
		timetable.addGroup(3, 18, new int[] { 3, 4, 5 });
		timetable.addGroup(4, 25, new int[] { 1, 4 });
		timetable.addGroup(5, 20, new int[] { 2, 3, 5 });
		timetable.addGroup(6, 22, new int[] { 1, 4, 5 });
		timetable.addGroup(7, 16, new int[] { 1, 3 });
		timetable.addGroup(8, 18, new int[] { 2, 6 });
		timetable.addGroup(9, 24, new int[] { 1, 6 });
		timetable.addGroup(10, 25, new int[] { 3, 4 });*/
		return timetable;
	}
	
	private static Timetable initializeTimetable2() {
		
		// Create timetable
		Timetable timetable = new Timetable();

		// Set up rooms
		timetable.addRoom(1, "Boloria", 40);
		/*timetable.addRoom(2, "Colia", 40);
		timetable.addRoom(3, "Erebia", 40);
		timetable.addRoom(4, "Appolia", 40);
		timetable.addRoom(5, "Drupadia", 40);
		timetable.addRoom(6, "Frisia", 40);*/
		

		// Set up timeslots
		timetable.addTimeslot(1, "Mon 9:00 - 9:40");
		timetable.addTimeslot(2, "Mon 9:40 - 10:20");
		timetable.addTimeslot(3, "Mon 10:30 - 11:10");
		timetable.addTimeslot(4, "Mon 11:10 - 11:50");
		timetable.addTimeslot(5, "Mon 11:50 - 12:30");
		timetable.addTimeslot(6, "Mon 1:15 - 1:55");
		timetable.addTimeslot(7, "Mon 1:55 - 2:35");
		timetable.addTimeslot(8, "Mon 2:40 - 3:20");
		
		timetable.addTimeslot(9, "Tue 9:00 - 9:40");
		timetable.addTimeslot(10, "Tue 9:40 - 10:20");
		timetable.addTimeslot(11, "Tue 10:30 - 11:10");
		timetable.addTimeslot(12, "Tue 11:10 - 11:50");
		timetable.addTimeslot(13, "Tue 11:50 - 12:30");
		timetable.addTimeslot(14, "Tue 1:15 - 1:55");
		timetable.addTimeslot(15, "Tue 1:55 - 2:35");
		timetable.addTimeslot(16, "Tue 2:40 - 3:20");
		
		timetable.addTimeslot(17, "Wed 9:00 - 9:40");
		timetable.addTimeslot(18, "Wed 9:40 - 10:20");
		timetable.addTimeslot(19, "Wed 10:30 - 11:10");
		timetable.addTimeslot(20, "Wed 11:10 - 11:50");
		timetable.addTimeslot(21, "Wed 11:50 - 12:30");
		timetable.addTimeslot(22, "Wed 1:15 - 1:55");
		timetable.addTimeslot(23, "Wed 1:55 - 2:35");
		timetable.addTimeslot(24, "Wed 2:40 - 3:20");
		
		timetable.addTimeslot(25, "Thu 9:00 - 9:40");
		timetable.addTimeslot(26, "Thu 9:40 - 10:20");
		timetable.addTimeslot(27, "Thu 10:30 - 11:10");
		timetable.addTimeslot(28, "Thu 11:10 - 11:50");
		timetable.addTimeslot(29, "Thu 11:50 - 12:30");
		timetable.addTimeslot(30, "Thu 1:15 - 1:55");
		timetable.addTimeslot(31, "Thu 1:55 - 2:35");
		timetable.addTimeslot(32, "Thu 2:40 - 3:20");
		
		timetable.addTimeslot(33, "Fri 9:00 - 9:40");
		timetable.addTimeslot(34, "Fri 9:40 - 10:20");
		timetable.addTimeslot(35, "Fri 10:30 - 11:10");
		timetable.addTimeslot(36, "Fri 11:10 - 11:50");
		timetable.addTimeslot(37, "Fri 11:50 - 12:30");
		timetable.addTimeslot(38, "Fri 1:15 - 1:55");
		timetable.addTimeslot(39, "Fri 1:55 - 2:35");
		timetable.addTimeslot(40, "Fri 2:40 - 3:20");

		// Set up professors
//		timetable.addProfessor(1, "Dr P Smith", new ArrayList<Integer>(){ {add(1); add(2); add(3); add(4); add(5); add(6); add(7); add(8); add(9);}});
//		timetable.addProfessor(1, "Dr P Smith");
		
		timetable.addProfessor(1,  "ARUNAKUMARI", new ArrayList<Integer>(){ {add(1); add(2); add(3); add(4); add(5); add(6); add(8); add(9); add(10); add(12); add(13); add(14); add(15); add(16); add(17); add(18); add(19);add(20); add(22); add(23); add(24); add(25); add(27); add(28); add(29); add(30); add(31); add(32); add(33); add(34); add(35); add(36); add(38); add(39); add(40); }});
		timetable.addProfessor(2,  "MADHAVI");
		timetable.addProfessor(3,  "MDS    ", new ArrayList<Integer>(){ {add(1); add(3); add(4); add(5); add(6); add(7); add(8); add(9); add(10); add(11); add(12); add(13); add(14); add(15); add(18); add(19);add(20); add(21); add(22); add(23); add(24); add(25); add(26); add(27); add(28); add(29); add(30); add(31); add(33); add(35); add(36); add(37); add(38); add(39); add(40); }});
		timetable.addProfessor(4,  "SHILAJA");
		timetable.addProfessor(5,  "SHARADA");
		timetable.addProfessor(6,  "RATNASUBA");
		timetable.addProfessor(7,  "K.VIJAYA");
		timetable.addProfessor(8,  "SANGEETHA");
		timetable.addProfessor(9,  "LAVANYA", new ArrayList<Integer>(){ {add(1); add(2); add(3); add(4); add(5); add(7); add(8); add(9); add(10); add(11); add(12); add(15); add(16); add(17); add(18); add(19);add(20); add(21); add(23); add(24); add(25); add(26); add(28); add(29); add(30); add(31); add(32); add(33); add(34); add(35); add(36); add(37); add(39);}});
		timetable.addProfessor(10,  "KIRAN");
		timetable.addProfessor(11,  "NAGAMANI", new ArrayList<Integer>(){ {add(1); add(2); add(3); add(4); add(6); add(7); add(8); add(10); add(11); add(12); add(13); add(14); add(15); add(16); add(17); add(19);add(20); add(21); add(22); add(23); add(24);  add(26); add(27); add(28); add(29); add(30); add(31); add(32); add(33); add(34); add(35); add(36); add(37); add(38); add(40); }});
		timetable.addProfessor(12,  "G.RAMADEVI");
		timetable.addProfessor(13,  "B.ARUNA", new ArrayList<Integer>(){ { add(2); add(3); add(5); add(7); add(8); add(9); add(11); add(12);  add(15); add(16); add(17); add(18); add(20); add(21); add(23); add(25); add(28); add(29); add(30); add(31); add(32); add(33); add(34); add(35); add(37);  add(39);  }});
		timetable.addProfessor(14,  "MADHAVI");
		timetable.addProfessor(15,  "HEENA");
		timetable.addProfessor(16,  "DIVYA");
		timetable.addProfessor(17,  "S.BALARAM");
		timetable.addProfessor(18,  "RAJESH");
		timetable.addProfessor(19,  "L.VENUBABU");
		timetable.addProfessor(20,  "RALITA");
		timetable.addProfessor(21,  "B.NLAKSHMI");
		timetable.addProfessor(22,  "G.NAGAMANI");
		timetable.addProfessor(23,  "VLAKSHMI");

		/*timetable.addProfessor(1,  "ARUNAKUMARI", new ArrayList<Integer>(){ {add(13); add(22); add(20); add(10); add(36); }});
		timetable.addProfessor(2,  "MADHAVI");
		timetable.addProfessor(3,  "MDS    ", new ArrayList<Integer>(){ {add(2); add(28); add(38); add(26); add(19); }});
		timetable.addProfessor(4,  "SHILAJA");
		timetable.addProfessor(5,  "SHARADA");
		timetable.addProfessor(6,  "RATNASUBA", new ArrayList<Integer>(){ {add(4); add(12); add(27);  }});
		timetable.addProfessor(7,  "K.VIJAYA");
		timetable.addProfessor(8,  "SANGEETHA");
		timetable.addProfessor(9,  "LAVANYA", new ArrayList<Integer>(){ {add(33); add(39); add(31); add(29); add(23); add(21); add(25); }});
		timetable.addProfessor(10,  "KIRAN");
		timetable.addProfessor(11,  "NAGAMANI", new ArrayList<Integer>(){ {add(34); add(15); add(11); add(8); add(35); }});
		timetable.addProfessor(12,  "G.RAMADEVI");
		timetable.addProfessor(13,  "B.ARUNA", new ArrayList<Integer>(){ {add(32); add(9); add(1); add(7); add(3); add(6); }});
		timetable.addProfessor(14,  "MADHAVI");
		timetable.addProfessor(15,  "HEENA", new ArrayList<Integer>(){ {add(30); add(18); }});
		timetable.addProfessor(16,  "DIVYA");
		timetable.addProfessor(17,  "S.BALARAM", new ArrayList<Integer>(){ {add(37); add(40); }});
		timetable.addProfessor(18,  "RAJESH");
		timetable.addProfessor(19,  "L.VENUBABU", new ArrayList<Integer>(){ {add(14); }});
		timetable.addProfessor(20,  "RALITA", new ArrayList<Integer>(){ { add(5); }});
		timetable.addProfessor(21,  "B.NLAKSHMI", new ArrayList<Integer>(){ { add(24); }});
		timetable.addProfessor(22,  "G.NAGAMANI");
		timetable.addProfessor(23,  "VLAKSHMI", new ArrayList<Integer>(){ { add(17); add(16);}});*/

		
		// Set up modules and define the professors that teach them
		timetable.addModule(1, "TEL", "Telegu", new int[] { 1 });
		timetable.addModule(2, "ENG", "English", new int[] {3});
		timetable.addModule(3, "HIN", "Hindi", new int[] {6});
		timetable.addModule(4, "MAT", "Maths", new int[] { 9 });
		timetable.addModule(5, "SCI", "Science", new int[] { 11 });
		timetable.addModule(6, "SOC", "Social Science", new int[] { 13 });
		timetable.addModule(7, "CS", "Computer Science", new int[] { 15 });
		timetable.addModule(8, "PE", "Physical Education", new int[] { 17 });
		timetable.addModule(9, "SWIM", "Swmimming", new int[] { 19 });
		timetable.addModule(10, "ASL", "ASL", new int[] { 20 });
		timetable.addModule(11, "GK", "General Knowledge", new int[] { 21 });
		timetable.addModule(12, "LIB", "Library", new int[] { 23 });
		timetable.addModule(13, "A&C", "Arts & Crafts", new int[] { 12, 23 });
		
		/*timetable.addModule(21, "TEL", "Telegu", new int[] { 2 });
		timetable.addModule(22, "ENG", "English", new int[] {4});
		timetable.addModule(23, "HIN", "Hindi", new int[] { 7});
		timetable.addModule(24, "MAT", "Maths", new int[] { 10 });
		timetable.addModule(25, "SCI", "Science", new int[] { 12 });
		timetable.addModule(26, "SOC", "Social Science", new int[] {  14 });
		timetable.addModule(27, "CS", "Computer Science", new int[] {  16 });
		timetable.addModule(28, "PE", "Physical Education", new int[] { 18 });*/

		// Set up student groups and the modules they take.
		
		/*timetable.addGroup(2, 30, new int[] { 2, 3, 5, 6 });
		timetable.addGroup(3, 18, new int[] { 3, 4, 5 });
		timetable.addGroup(4, 25, new int[] { 1, 4 });
		timetable.addGroup(5, 20, new int[] { 2, 3, 5 });
		timetable.addGroup(6, 22, new int[] { 1, 4, 5 });
		timetable.addGroup(7, 16, new int[] { 1, 3 });
		timetable.addGroup(8, 18, new int[] { 2, 6 });
		timetable.addGroup(9, 24, new int[] { 1, 6 });
		timetable.addGroup(10, 25, new int[] { 3, 4 });*/
		return timetable;
	}
}
