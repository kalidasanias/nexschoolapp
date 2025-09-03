package com.ga;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Random;

/**
 * Timetable is the main evaluation class for the class scheduler GA.
 * 
 * A timetable represents a potential solution in human-readable form, unlike an
 * Individual or a chromosome. This timetable class, then, can read a chromosome
 * and develop a timetable from it, and ultimately can evaluate the timetable
 * for its fitness and number of scheduling clashes.
 * 
 * The most important methods in this class are createClasses and calcClashes.
 * 
 * The createClasses method accepts an Individual (really, a chromosome),
 * unpacks its chromosome, and creates Class objects from the genetic
 * information. Class objects are lightweight; they're just containers for
 * information with getters and setters, but it's more convenient to work with
 * them than with the chromosome directly.
 * 
 * The calcClashes method is used by GeneticAlgorithm.calcFitness, and requires
 * that createClasses has been run first. calcClashes looks at the Class objects
 * created by createClasses, and figures out how many hard constraints have been
 * violated.
 * 
 */
public class Timetable {
	private final HashMap<Integer, Room> rooms;
	private final HashMap<Integer, Professor> professors;
	private final HashMap<Integer, Module> modules;
	private final HashMap<Integer, Group> groups;
	private final HashMap<Integer, Timeslot> timeslots;
	private Class classes[];

//	private int numClasses = 0;
	private int maxNumPeriods; // = 6;
	public int numOfDays; // = 5;
	public int numOfPeriodsPerDay; // = 8;
	
	private double finalFitness;
	private int clashes;
//	public int maxWorkingPeriodsPerDay = 5;

	/**
	 * Initialize new Timetable
	 */
	public Timetable() {
		this.rooms = new HashMap<Integer, Room>();
		this.professors = new HashMap<Integer, Professor>();
		this.modules = new HashMap<Integer, Module>();
		this.groups = new HashMap<Integer, Group>();
		this.timeslots = new HashMap<Integer, Timeslot>();
	}

	/**
	 * "Clone" a timetable. We use this before evaluating a timetable so we have
	 * a unique container for each set of classes created by "createClasses".
	 * Truthfully, that's not entirely necessary (no big deal if we wipe out and
	 * reuse the .classes property here), but Chapter 6 discusses
	 * multi-threading for fitness calculations, and in order to do that we need
	 * separate objects so that one thread doesn't step on another thread's
	 * toes. So this constructor isn't _entirely_ necessary for Chapter 5, but
	 * you'll see it in action in Chapter 6.
	 * 
	 * @param cloneable
	 */
	public Timetable(Timetable cloneable) {
		this.rooms = cloneable.getRooms();
		this.professors = cloneable.getProfessors();
		this.modules = cloneable.getModules();
		this.groups = cloneable.getGroups();
		this.timeslots = cloneable.getTimeslots();
	}

	private HashMap<Integer, Group> getGroups() {
		return this.groups;
	}
	

	private HashMap<Integer, Timeslot> getTimeslots() {
		return this.timeslots;
	}

	private HashMap<Integer, Module> getModules() {
		return this.modules;
	}

	private HashMap<Integer, Professor> getProfessors() {
		return this.professors;
	}

	public int getMaxNumPeriods() {
		return maxNumPeriods;
	}

	public void setMaxNumPeriods(int maxNumPeriods) {
		this.maxNumPeriods = maxNumPeriods;
	}

	public int getNumOfDays() {
		return numOfDays;
	}

	public void setNumOfDays(int numOfDays) {
		this.numOfDays = numOfDays;
	}

	public int getNumOfPeriodsPerDay() {
		return numOfPeriodsPerDay;
	}

	public void setNumOfPeriodsPerDay(int numOfPeriodsPerDay) {
		this.numOfPeriodsPerDay = numOfPeriodsPerDay;
	}

	/**
	 * Add new room
	 * 
	 * @param roomId
	 * @param roomName
	 * @param capacity
	 */
	public void addRoom(int roomId, String roomName, int capacity) {
		this.rooms.put(roomId, new Room(roomId, roomName, capacity));
	}

	/**
	 * Add new professor
	 * 
	 * @param professorId
	 * @param professorName
	 */
	public void addProfessor(int professorId, String professorName) {
		this.professors.put(professorId, new Professor(professorId, professorName));
	}
	
	/**
	 * Add new professor
	 * 
	 * @param professorId
	 * @param professorName
	 * @param busyTimeslots
	 */
	public void addProfessor(int professorId, String professorName, ArrayList<Integer> busyTimeslots) {
		this.professors.put(professorId, new Professor(professorId, professorName, busyTimeslots));
	}

	/**
	 * Add new module
	 * 
	 * @param moduleId
	 * @param moduleCode
	 * @param module
	 * @param professorIds
	 */
	public void addModule(int moduleId, String moduleCode, String module, int professorIds[]) {
		this.modules.put(moduleId, new Module(moduleId, moduleCode, module, professorIds));
	}

	/**
	 * Add new group
	 * 
	 * @param groupId
	 * @param groupSize
	 * @param moduleIds
	 */
	public void addGroup(int groupId, int groupSize, int moduleIds[]) {
		this.groups.put(groupId, new Group(groupId, groupSize, moduleIds));
//		this.numClasses = 0;
	}
	
	/**
	 * Add new group
	 * 
	 * @param groupId
	 * @param groupSize
	 * @param moduleIds
	 */
	public void addGroup(int groupId, int groupSize, HashMap<Integer, Integer> moduleIds) {
//		this.groups.clear();
		this.groups.put(groupId, new Group(groupId, groupSize, moduleIds));
//		this.numClasses = 0;
	}

	/**
	 * Add new timeslot
	 * 
	 * @param timeslotId
	 * @param timeslot
	 */
	public void addTimeslot(int timeslotId, String timeslot) {
		this.timeslots.put(timeslotId, new Timeslot(timeslotId, timeslot));
	}

	/**
	 * Create classes using individual's chromosome
	 * 
	 * One of the two important methods in this class; given a chromosome,
	 * unpack it and turn it into an array of Class (with a capital C) objects.
	 * These Class objects will later be evaluated by the calcClashes method,
	 * which will loop through the Classes and calculate the number of
	 * conflicting timeslots, rooms, professors, etc.
	 * 
	 * While this method is important, it's not really difficult or confusing.
	 * Just loop through the chromosome and create Class objects and store them.
	 * 
	 * @param individual
	 */
	public void createClasses(Individual individual) {
		
//		System.out.println("total number of classes....." + this.getNumClasses());
		
		this.clearBusyTimeslot();
		// Init classes
		Class classes[] = new Class[this.getNumClasses()];

		// Get individual's chromosome
		int chromosome[] = individual.getChromosome();
		int chromosomePos = 0;
		int classIndex = 0;

		for (Group group : this.getGroupsAsArray()) {
			//				int moduleIds[] = group.getModuleIds(); //Bharat
			HashMap<Integer, Integer> modules = group.getModules();

			//				for (int moduleId : moduleIds) { //Bharat
			for (int moduleId : modules.keySet()) {

				for (int numClass = 0; numClass < modules.get(moduleId); numClass++) { //Bharat

					chromosomePos = createClasses(classes, chromosome, chromosomePos, classIndex, group, moduleId);
					classIndex++;
				}
			}
//			System.out.println("createClasses chromosomePos..." + chromosomePos);
//			System.out.println("createClasses classIndex..." + classIndex);

			for (;classIndex <  this.getNumClasses(); classIndex++) {
				chromosomePos = createClasses(classes, chromosome, chromosomePos, classIndex, group, -1);
			}
			
//			System.out.println("final chromosomePos..." + chromosomePos);
//			System.out.println("final classIndex..." + classIndex);
		}
		
		
		//		}

//		System.out.println("total number of classes created....." + classes.length);
		this.classes = classes;
	}

	private int createClasses(Class[] classes, int[] chromosome, int chromosomePos, int classIndex, Group group,
			int moduleId) {
		classes[classIndex] = new Class(classIndex, group.getGroupId(), moduleId);

		Integer timeslot = chromosome[chromosomePos]; 
		// Add timeslot
		classes[classIndex].addTimeslot(timeslot);
		chromosomePos++;

		// Add room
		classes[classIndex].setRoomId(chromosome[chromosomePos]);
		chromosomePos++;

//		System.out.println("createClasses chromosome[chromosomePos]..." +  chromosome[chromosomePos]);
		// Add professor
		classes[classIndex].addProfessor(chromosome[chromosomePos]);
		Professor professor = this.getProfessor(chromosome[chromosomePos]);
		if (professor != null) {
			professor.addBusyTimeslotId(timeslot, maxNumPeriods);
		}
//					System.out.println("timeslot...."+timeslot + " professor..." + this.getProfessor(chromosome[chromosomePos]).getProfessorId());
		chromosomePos++;
		return chromosomePos;
	}
	
	private void clearBusyTimeslot() {
		HashMap<Integer, Professor> profs = this.getProfessors();
		Iterator it = profs.entrySet().iterator();
	    while (it.hasNext()) {
	        Map.Entry pair = (Map.Entry)it.next();
	        Professor prof = (Professor) pair.getValue();
	        prof.clearBusyTimeslots();
	    }
	}

	
	public void mergeBusyTimeslot() {
		HashMap<Integer, Professor> profs = this.getProfessors();
		Iterator it = profs.entrySet().iterator();
	    while (it.hasNext()) {
	        Map.Entry pair = (Map.Entry)it.next();
	        Professor prof = (Professor) pair.getValue();
	        prof.mergeToInitBusyIds();
	    }
	}
	
	/**
	 * Get room from roomId
	 * 
	 * @param roomId
	 * @return room
	 */
	public Room getRoom(int roomId) {
		if (!this.rooms.containsKey(roomId)) {
			System.out.println("Rooms doesn't contain key " + roomId);
		}
		return (Room) this.rooms.get(roomId);
	}

	public HashMap<Integer, Room> getRooms() {
		return this.rooms;
	}

	/**
	 * Get random room
	 * 
	 * @return room
	 */
	public Room getRandomRoom() {
		Object[] roomsArray = this.rooms.values().toArray();
		Room room = (Room) roomsArray[(int) (roomsArray.length * Math.random())];
		return room;
	}
	
	/**
	 * Get random Professor
	 * 
op[	 * @return Professor
	 */
	public Professor getRandomProfessor(int moduleId, int timeslot) {
		Professor professor = getProfessor(getModule(moduleId).getRandomProfessorId());
		if (professor.getBusyTimeslotIds().contains(timeslot)) {
			return getRandomProfessor(moduleId, timeslot);
		} else {
			return professor;
		}
	}

	/**
	 * Get professor from professorId
	 * 
	 * @param professorId
	 * @return professor
	 */
	public Professor getProfessor(int professorId) {
		return (Professor) this.professors.get(professorId);
	}

	public Collection<Professor> getAllProfessors() {
		return this.professors.values();
	}
	
	/**
	 * Get module from moduleId
	 * 
	 * @param moduleId
	 * @return module
	 */
	public Module getModule(int moduleId) {
		return (Module) this.modules.get(moduleId);
	}

	/**
	 * Get moduleIds of student group
	 * 
	 * @param groupId
	 * @return moduleId array
	 */
	public int[] getGroupModules(int groupId) {
		Group group = (Group) this.groups.get(groupId);
		return group.getModuleIds();
	}

	/**
	 * Get group from groupId
	 * 
	 * @param groupId
	 * @return group
	 */
	public Group getGroup(int groupId) {
		return (Group) this.groups.get(groupId);
	}

	/**
	 * Get all student groups
	 * 
	 * @return array of groups
	 */
	public Group[] getGroupsAsArray() {
		return (Group[]) this.groups.values().toArray(new Group[this.groups.size()]);
	}
	
	/**
	 * Clear Groups
	 */
	public void clearGroup() {
		this.groups.clear();
	}

	/**
	 * Get timeslot by timeslotId
	 * 
	 * @param timeslotId
	 * @return timeslot
	 */
	public Timeslot getTimeslot(int timeslotId) {
		return (Timeslot) this.timeslots.get(timeslotId);
	}
	
	public int getTotalTimeslotsSize() {
		return this.timeslots.size();
	}

	/**
	 * Get random timeslotId
	 * 
	 * @return timeslot
	 */
	public Timeslot getRandomTimeslot(int min, int max) {
//		System.out.println("min... "+ min + " max... " + max);
		Object[] timeslotArray = this.timeslots.values().toArray();
		Random generator = new Random(System.currentTimeMillis()); // see comments!
		int randomNum = generator.nextInt(max - min) + min;
		/*if (randomNum > (timeslotArray.length - 1)) {
			Timeslot timeslot  = (Timeslot) timeslotArray[(int) (timeslotArray.length * Math.random())];  //Bharat
			return timeslot; //Bharat			
		} else {*/
		randomNum = (randomNum-1) < 0 ? 0 : randomNum-1;
			return (Timeslot) timeslotArray[randomNum];
//		}
	}

	/**
	 * Get classes
	 * 
	 * @return classes
	 */
	public Class[] getClasses() {
		return this.classes;
	}

	/**
	 * Get number of classes that need scheduling
	 * 
	 * @return numClasses
	 */
	public int getNumClasses() {
		//Bharat
		/*if (this.numClasses > 0) {
			return this.numClasses;
		}

		int numClasses = 0;
		Group groups[] = (Group[]) this.groups.values().toArray(new Group[this.groups.size()]);
		for (Group group : groups) {
			numClasses += group.getModuleIds().length;
		}
		
		this.numClasses = numClasses;

		return this.numClasses;*/
		return this.getTotalTimeslotsSize() * this.groups.size();
	}

	/**
	 * Calculate the number of clashes between Classes generated by a
	 * chromosome.
	 * 
	 * The most important method in this class; look at a candidate timetable
	 * and figure out how many constraints are violated.
	 * 
	 * Running this method requires that createClasses has been run first (in
	 * order to populate this.classes). The return value of this method is
	 * simply the number of constraint violations (conflicting professors,
	 * timeslots, or rooms), and that return value is used by the
	 * GeneticAlgorithm.calcFitness method.
	 * 
	 * There's nothing too difficult here either -- loop through this.classes,
	 * and check constraints against the rest of the this.classes.
	 * 
	 * The two inner `for` loops can be combined here as an optimization, but
	 * kept separate for clarity. For small values of this.classes.length it
	 * doesn't make a difference, but for larger values it certainly does.
	 * 
	 * @return numClashes
	 */
	
	
	public int calcClashes() {
		int clashes = 0; 

		for (Class classA : this.classes) {
			// Check room capacity
			int roomCapacity = this.getRoom(classA.getRoomId()).getRoomCapacity();
			int groupSize = this.getGroup(classA.getGroupId()).getGroupSize();
			
			if (roomCapacity < groupSize) {
				clashes++;
			}
			
			int dayOfWeek = classA.getTimeslotId() / 8 + 1;
			int periodNo = classA.getTimeslotId() % 8;
			if (periodNo == 0) {
				dayOfWeek--;
			}
			
			if (classA.getProfessorId() != -1) {
				ArrayList<Integer> busyTimeslotIdsA = this.getProfessor(classA.getProfessorId()).getInitBusyTimeslotIds();
				/*// for lavanya only
			if (classA.getProfessorId() == 9) {
				System.out.println("lavanya busy ids,,, " + busyTimeslotIdsA + " contains check... "+ busyTimeslotIdsA.contains((Integer)classA.getProfessorId()));
			}*/

				if (busyTimeslotIdsA.contains((Integer) classA.getTimeslotId())) {
					clashes++;
					//				break;
				}
			}
			
			// Check if room is taken
			for (Class classB : this.classes) {
				/*System.out.println("classB.........." + classB);
				System.out.println("classA.getGroupId.." + classA.getGroupId());
				System.out.println("classB.getGroupId.." + classB.getGroupId());
				System.out.println("classA.getTimeslotId.." + classA.getTimeslotId());
				System.out.println("classB.getTimeslotId.." + classB.getTimeslotId());
				System.out.println("classA.getClassId.." + classA.getClassId());
				System.out.println("classB.getClassId.." + classB.getClassId());*/
				if (classB != null) {
					if (classA.getGroupId() == classB.getGroupId() && classA.getTimeslotId() == classB.getTimeslotId()
							&& classA.getClassId() != classB.getClassId()) {
						clashes++;
						//					break;
					}

					if (classA.getProfessorId() == classB.getProfessorId() && classA.getTimeslotId() == classB.getTimeslotId()
							&& classA.getClassId() != classB.getClassId()) {
						clashes++;
						//					break;
					} else {
						
						if (classB.getProfessorId() != -1) {
//							System.out.println("classB.getProfessorId()...." + classB.getProfessorId());
//							System.out.println("this.getProfessor()...." + this.getProfessor(classB.getProfessorId()));
							ArrayList<Integer> busyTimeslotIdsB = this.getProfessor(classB.getProfessorId()).getBusyTimeslotIds();

							if (classA.getClassId() != classB.getClassId() && 
									classA.getTimeslotId() == classB.getTimeslotId() && 
									busyTimeslotIdsB.contains(Integer.valueOf(classA.getTimeslotId()))) {
								clashes++;
								//						break;
							}
						}
					}
				}
			}
			
		}
		
//		HashMap<Integer, Professor> profs = this.getProfessors();
//		Iterator it = profs.entrySet().iterator();
//	    while (it.hasNext()) {
		Collection<Professor> listProfessors = this.getProfessors().values();
		for (Iterator iterator = listProfessors.iterator(); iterator.hasNext();) {
			Professor professor = (Professor) iterator.next();
			 clashes = clashes + professor.getNumofOverloadedPeriods();
		}
//	        Map.Entry pair = (Map.Entry)it.next();
//	        Professor prof = (Professor) pair.getValue();
//	        int [] workingPeriods = new int[numOfDays+1];  
	       
	        /*if (busyTimeslotIds.size() > 0) {
	        	for (int i = 1; i <= numOfDays; i++) {
	        		for (Integer timeslot : busyTimeslotIds) {
	        			int startPeriod = (i - 1) * numOfPeriodsPerDay;
	        			if (startPeriod > timeslot && timeslot <= i * numOfPeriodsPerDay) {
	        				++workingPeriods[i];
	        				if (workingPeriods[i] > maxWorkingPeriodsPerDay) {
	        					clashes++;
	        				}

	        			}
	        		}
	        	}
	        }*/
//	    }
		
		setClashes(clashes);
		
		return clashes;
	}

	public int getClashes() {
		return clashes;
	}

	public void setClashes(int clashes) {
		this.clashes = clashes;
	}

	public double getFinalFitness() {
		return finalFitness;
	}

	public void setFinalFitness(double finalFitness) {
		this.finalFitness = finalFitness;
	}
}
