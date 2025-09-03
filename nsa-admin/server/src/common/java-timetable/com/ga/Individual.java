package com.ga;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

public class Individual {
	
	/**
	 * In this case, the chromosome is an array of integers rather than a string. 
	 */
	private int[] chromosome;
	private double fitness = -1;

	/**
	 * Initializes random individual based on a timetable
	 * 
	 * The Timetable class is a bit overloaded. It knows both fixed information
	 * (the courses that MUST be scheduled, the professors that MUST be given
	 * jobs, the classrooms that DO exist) -- but it also understands how to
	 * parse and unpack chromosomes which contain variable information (which
	 * professor teaches which class and when?)
	 * 
	 * In this case, we use the Timetable for the fixed information only, and
	 * generate a random chromosome, making guesses at the variable information.
	 * 
	 * Given the fixed information in a Timetable, we create a chromosome that
	 * randomly assigns timeslots, rooms, and professors to the chromosome for
	 * each student group and module.
	 * 
	 * @param timetable
	 *            The timetable information
	 */
	public Individual(Timetable timetable) {
		int numClasses = timetable.getNumClasses();

		// 1 gene for room, 1 for time, 1 for professor
		int chromosomeLength = numClasses * 3;
//		System.out.println("chromosomeLength...."+ chromosomeLength);
		// Create random individual
		int newChromosome[] = new int[chromosomeLength];
		int chromosomeIndex = 0;
		
		
//		for (int i = 0; i < timetable.numOfDays; i++) {//Bharat

			// Loop through groups
			for (Group group : timetable.getGroupsAsArray()) {
				// Loop through modules
				
				Map<Integer, Integer> occupiedTimeSlots = new HashMap<Integer, Integer>(chromosomeLength);
				Map<Integer, ArrayList<Integer>> profTimeSlots = new HashMap<Integer, ArrayList<Integer>>(16);
//				for (int moduleId : group.getModuleIds()) { Bharat
				HashMap<Integer, Integer> modules = group.getModules();
				for (int moduleId : modules.keySet()) {
					for (int numClass = 0; numClass < modules.get(moduleId); numClass++) { //Bharat
						// Add random time
						chromosomeIndex = createChromosome(timetable, newChromosome, chromosomeIndex, modules, moduleId,
								numClass, occupiedTimeSlots,profTimeSlots);
					}
				}
				
				for (;chromosomeIndex <  chromosomeLength; ) {
					chromosomeIndex = createChromosome(timetable, newChromosome, chromosomeIndex, modules, -1,
							0, occupiedTimeSlots, profTimeSlots);
				}
			}
//		}
		this.chromosome = newChromosome;
	}

	private int createChromosome(Timetable timetable, int[] newChromosome, int chromosomeIndex,
			HashMap<Integer, Integer> modules, int moduleId, int numClass, 
			Map<Integer, Integer> occupiedTimeSlots, Map<Integer, ArrayList<Integer>> profTimeSlots) {
		
		int profId = -1;
		if (moduleId != -1) {
			// Add random professor
			Module module = timetable.getModule(moduleId); // Bharat
			profId = module.getRandomProfessorId(); //Bharat
		}
		
		if (moduleId != -1 && modules.get(moduleId) >= timetable.numOfDays) {
			int dayIndex = numClass % timetable.numOfDays;
			int min = (dayIndex * timetable.numOfPeriodsPerDay);
			int max = ((dayIndex + 1) * timetable.numOfPeriodsPerDay); // - 1;
			if ((numClass - 2) > timetable.numOfDays) {
				min = 1;
				max = timetable.numOfDays * timetable.numOfPeriodsPerDay;
			}

			min = min == 0 ? 1 : min;
			
			/*if (profId == 9) {
				System.out.println( " already occupied 9 " + profTimeSlots);
			}*/
//			System.out.println("min...." + min);
//			System.out.println("max...." + max);
//			int timeslotId = timetable.getRandomTimeslot(min, max).getTimeslotId();
			int profAvailTimeslotId = getProfAvailablePeriod(timetable, profId, min, max, profTimeSlots);
			if (profAvailTimeslotId == -1) {
				max = timetable.numOfDays * timetable.numOfPeriodsPerDay;
				profAvailTimeslotId = getProfAvailablePeriod(timetable, profId, min, max, profTimeSlots);
			}
			/*if (profId == 9) {
				System.out.println("numClass..." + numClass + " prof id" + profId + ", avail time " + profAvailTimeslotId + " already occupied  " + profTimeSlots);
			}*/
			Integer existingTimeslotIndex = occupiedTimeSlots.get(profAvailTimeslotId);
			newChromosome[chromosomeIndex] = profAvailTimeslotId;
			if (profTimeSlots.get(profId) == null) {
				ArrayList<Integer> list = new ArrayList<Integer>(5);
				list.add(profAvailTimeslotId);
				profTimeSlots.put(profId,  list);
			} else{
				profTimeSlots.get(profId).add(profAvailTimeslotId);
			}
			occupiedTimeSlots.put(profAvailTimeslotId, chromosomeIndex);
		} else {
			int max = timetable.numOfDays * timetable.numOfPeriodsPerDay;
//			int timeslotId = timetable.getRandomTimeslot(0, max+1).getTimeslotId();
			int timeslotId = getProfAvailablePeriod(timetable, profId, 1, max, profTimeSlots);
			occupiedTimeSlots.put(timeslotId, chromosomeIndex);
			newChromosome[chromosomeIndex] = timeslotId;
		}
		chromosomeIndex++;

		// Add random room
		int roomId = timetable.getRandomRoom().getRoomId();
		newChromosome[chromosomeIndex] = roomId;
		chromosomeIndex++;
		
		newChromosome[chromosomeIndex] = profId;
		
		chromosomeIndex++;
		return chromosomeIndex;
	}
	
	private int getProfAvailablePeriod(Timetable timetable, int profId, int min, int max, Map<Integer, ArrayList<Integer>> profTimeSlots) {
		
		Professor professor = timetable.getProfessor(profId);
		ArrayList<Integer> availTimeslot = new ArrayList<Integer>(8);
		
		for (int i=min; i<=max; i++) {
			int timeslotId2 = timetable.getTimeslot(i).getTimeslotId();
			if (professor == null || (professor != null && !professor.getInitBusyTimeslotIds().contains(timeslotId2)) && 
					(profTimeSlots.get(profId) == null || 
					(profTimeSlots.get(profId) != null && !profTimeSlots.get(profId).contains(timeslotId2)))) {
				availTimeslot.add(timeslotId2);
			}
		}
		/*if (profId == 9) {
			System.out.println("min ..." + min + "max ..." + max + "availTimeslot. prof 9....." + availTimeslot);
		}*/
		if (availTimeslot.size() > 0) {
			max++;
			Random generator = new Random(System.currentTimeMillis()); 
			int randomNum = generator.nextInt(availTimeslot.size() - 0) + 0;
			return (int) availTimeslot.get(randomNum);
		} else {
			return -1;
		}
	}

	/**
	 * Initializes random individual
	 * 
	 * The book instructs you to copy this constructor over from Chapter 4. This
	 * case is a little tricky -- used in Chapter 4, this constructor will
	 * create a valid chromosome for a list of cities for the TSP, by using each
	 * city once and only once.
	 * 
	 * If used in Chapter 5, however, this will create an utterly INVALID
	 * chromosome for the class scheduler. So you should not use this
	 * constructor if you hope to create a valid random individual. For that
	 * purpose, use the Individual(Timetable) constructor, which will create a
	 * valid Individual from the fixed information in the Timetable object.
	 * 
	 * However, Chapter 5 still needs an Individual(int) constructor that
	 * creates an Individual with a chromosome of a given size. It's used in the
	 * crossoverPopulation method in order to initialize the offspring. The fact
	 * that this creates an invalid Individual doesn't matter in this case,
	 * because the crossover algorithm immediately rewrites the whole
	 * chromosome.
	 * 
	 * 
	 * @param chromosomeLength
	 *            The length of the individuals chromosome
	 */
	public Individual(int chromosomeLength) {
		// Create random individual
		int[] individual;
		individual = new int[chromosomeLength];
		
		/**
		 * This comment and the for loop doesn't make sense for this chapter.
		 * But I'm leaving it in here because you were instructed to copy this
		 * class from Chapter 4 -- and NOT having this comment here might be
		 * more confusing than keeping it in.
		 * 
		 * Comment from Chapter 4:
		 * 
		 * "In this case, we can no longer simply pick 0s and 1s -- we need to
		 * use every city index available. We also don't need to randomize or
		 * shuffle this chromosome, as crossover and mutation will ultimately
		 * take care of that for us."
		 */
		for (int gene = 0; gene < chromosomeLength; gene++) {
			individual[gene] = gene;
		}
		
		this.chromosome = individual;
	}
    
	/**
	 * Initializes individual with specific chromosome
	 * 
	 * @param chromosome
	 *            The chromosome to give individual
	 */
	public Individual(int[] chromosome) {
		// Create individual chromosome
		this.chromosome = chromosome;
	}

	/**
	 * Gets individual's chromosome
	 * 
	 * @return The individual's chromosome
	 */
	public int[] getChromosome() {
		return this.chromosome;
	}

	/**
	 * Gets individual's chromosome length
	 * 
	 * @return The individual's chromosome length
	 */
	public int getChromosomeLength() {
		return this.chromosome.length;
	}

	/**
	 * Set gene at offset
	 * 
	 * @param gene
	 * @param offset
	 */
	public void setGene(int offset, int gene) {
		this.chromosome[offset] = gene;
	}

	/**
	 * Get gene at offset
	 * 
	 * @param offset
	 * @return gene
	 */
	public int getGene(int offset) {
		return this.chromosome[offset];
	}

	/**
	 * Store individual's fitness
	 * 
	 * @param fitness
	 *            The individuals fitness
	 */
	public void setFitness(double fitness) {
		this.fitness = fitness;
	}

	/**
	 * Gets individual's fitness
	 * 
	 * @return The individual's fitness
	 */
	public double getFitness() {
		return this.fitness;
	}
	
	public String toString() {
		String output = "";
		for (int gene = 0; gene < this.chromosome.length; gene++) {
			output += this.chromosome[gene] + ",";
		}
		return output;
	}

	/**
	 * Search for a specific integer gene in this individual.
	 * 
	 * For instance, in a Traveling Salesman Problem where cities are encoded as
	 * integers with the range, say, 0-99, this method will check to see if the
	 * city "42" exists.
	 * 
	 * @param gene
	 * @return
	 */
	public boolean containsGene(int gene) {
		for (int i = 0; i < this.chromosome.length; i++) {
			if (this.chromosome[i] == gene) {
				return true;
			}
		}
		return false;
	}


	
}
